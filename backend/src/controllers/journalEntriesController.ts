import { getConnection } from '../config/database';

export const getAllJournalEntries = async () => {
  const connection = await getConnection();
  try {
    const [entries]: any = await connection.execute(
      'SELECT * FROM journal_entries ORDER BY date DESC'
    );
    return entries;
  } finally {
    connection.release();
  }
};

export const getJournalEntryById = async (id: string | number) => {
  const connection = await getConnection();
  try {
    // Get main entry
    const [entries]: any = await connection.execute(
      'SELECT * FROM journal_entries WHERE id = ?',
      [id]
    );

    if (entries.length === 0) {
      throw new Error('القيد غير موجود');
    }

    // Get entry lines with account info
    const [lines]: any = await connection.execute(
      `SELECT jl.id, jl.account_id, jl.debit, jl.credit, a.account_code, a.account_name_ar, a.account_type
       FROM journal_lines jl
       JOIN chart_of_accounts a ON jl.account_id = a.id
       WHERE jl.journal_entry_id = ?
       ORDER BY jl.id`,
      [id]
    );

    return {
      ...entries[0],
      lines,
    };
  } finally {
    connection.release();
  }
};

export const createJournalEntry = async (data: {
  date: string;
  description?: string;
  reference?: string;
  lines: Array<{
    account_id: number;
    debit: number;
    credit: number;
  }>;
}) => {
  const { date, description, reference, lines } = data;

  // Validation
  if (!date || !lines || lines.length === 0) {
    throw new Error('التاريخ والتفاصيل مطلوبة');
  }

  // Check balance: debit = credit
  const totalDebit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.credit) || 0), 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(`عدم توازن: الدين (${totalDebit}) ≠ الدائن (${totalCredit})`);
  }

  const connection = await getConnection();
  try {
    // Begin transaction
    await connection.beginTransaction();

    // Insert main entry
    const [result]: any = await connection.execute(
      'INSERT INTO journal_entries (date, description, reference) VALUES (?, ?, ?)',
      [date, description || null, reference || null]
    );

    const entryId = result.insertId;

    // Insert lines
    for (const line of lines) {
      const debit = typeof line.debit === 'string' ? parseFloat(line.debit) : line.debit;
      const credit = typeof line.credit === 'string' ? parseFloat(line.credit) : line.credit;

      if (!line.account_id || (debit === 0 && credit === 0)) {
        throw new Error('كل تفصيل يجب أن يحتوي على حساب وقيمة');
      }

      await connection.execute(
        'INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)',
        [entryId, line.account_id, debit, credit]
      );
    }

    // Commit transaction
    await connection.commit();

    return {
      id: entryId,
      message: 'تم إضافة القيد بنجاح',
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateJournalEntry = async (id: string | number, data: {
  date: string;
  description?: string;
  reference?: string;
  lines: Array<{
    account_id: number;
    debit: number;
    credit: number;
  }>;
}) => {
  const { date, description, reference, lines } = data;

  // Validation
  if (!date || !lines || lines.length === 0) {
    throw new Error('التاريخ والتفاصيل مطلوبة');
  }

  // Check balance: debit = credit
  const totalDebit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.credit) || 0), 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(`عدم توازن: الدين (${totalDebit}) ≠ الدائن (${totalCredit})`);
  }

  const connection = await getConnection();
  try {
    // Check if entry exists
    const [entry]: any = await connection.execute(
      'SELECT id FROM journal_entries WHERE id = ?',
      [id]
    );

    if (entry.length === 0) {
      throw new Error('القيد غير موجود');
    }

    await connection.beginTransaction();

    // Update main entry
    await connection.execute(
      'UPDATE journal_entries SET date = ?, description = ?, reference = ? WHERE id = ?',
      [date, description || null, reference || null, id]
    );

    // Delete old lines
    await connection.execute('DELETE FROM journal_lines WHERE journal_entry_id = ?', [id]);

    // Insert new lines
    for (const line of lines) {
      const debit = typeof line.debit === 'string' ? parseFloat(line.debit) : line.debit;
      const credit = typeof line.credit === 'string' ? parseFloat(line.credit) : line.credit;

      if (!line.account_id || (debit === 0 && credit === 0)) {
        throw new Error('كل تفصيل يجب أن يحتوي على حساب وقيمة');
      }

      await connection.execute(
        'INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)',
        [id, line.account_id, debit, credit]
      );
    }

    await connection.commit();

    return { message: 'تم تحديث القيد بنجاح' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const reverseJournalEntry = async (id: string | number) => {
  const connection = await getConnection();

  try {
    // Check if entry exists
    const [entry]: any = await connection.execute(
      'SELECT * FROM journal_entries WHERE id = ?',
      [id]
    );

    if (entry.length === 0) {
      throw new Error('القيد غير موجود');
    }

    const original = entry[0];

    if (original.is_void) {
      throw new Error('هذا القيد تم إلغاؤه بالفعل');
    }

    await connection.beginTransaction();

    // Create the reversal journal entry
    const [result]: any = await connection.execute(
      `INSERT INTO journal_entries 
        (date, description, reference, status, is_void, reversed_of, created_at)
       VALUES (NOW(), ?, CONCAT(?, '-REV'), 'Posted', FALSE, ?, NOW())`,
      [`عكس القيد رقم ${id}`, original.reference || id, id]
    );

    const newJournalId = result.insertId;

    // Reverse the journal lines (swap debit and credit)
    const [lines]: any = await connection.execute(
      'SELECT * FROM journal_lines WHERE journal_entry_id = ?',
      [id]
    );

    if (lines.length === 0) {
      throw new Error('لا يوجد تفاصيل لهذا القيد');
    }

    for (const line of lines) {
      await connection.execute(
        `INSERT INTO journal_lines 
           (journal_entry_id, account_id, debit, credit)
         VALUES (?, ?, ?, ?)`,
        [
          newJournalId,
          line.account_id,
          line.credit, // swapped
          line.debit,  // swapped
        ]
      );
    }

    // Mark original as voided
    await connection.execute(
      `UPDATE journal_entries 
       SET is_void = TRUE, status = 'Voided' 
       WHERE id = ?`,
      [id]
    );

    await connection.commit();

    return {
      message: 'تم إنشاء قيد عكسي بنجاح',
      original_id: id,
      reversal_id: newJournalId,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
