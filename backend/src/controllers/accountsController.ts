import { getConnection } from '../config/database';

export const getAllAccounts = async () => {
  const connection = await getConnection();
  try {
    const [accounts]: any = await connection.execute(
      `SELECT 
        a.id, 
        a.account_number, 
        a.parent_account_number, 
        a.name_ar, 
        a.name_en, 
        a.account_type_id,
        a.report_type_id,
        a.balance_type_id,
        a.account_level,
        a.status,
        at.name_ar as account_type_name_ar,
        at.name_en as account_type_name_en,
        rt.name_ar as report_type_name_ar,
        rt.name_en as report_type_name_en,
        bt.name_ar as balance_type_name_ar,
        bt.name_en as balance_type_name_en
       FROM accounts a 
       LEFT JOIN account_types at ON a.account_type_id = at.id
       LEFT JOIN report_types rt ON a.report_type_id = rt.id
       LEFT JOIN balance_types bt ON a.balance_type_id = bt.id
       ORDER BY a.account_number ASC`
    );
    return accounts;
  } finally {
    connection.release();
  }
};

export const getAccountById = async (accountNumber: string) => {
  const connection = await getConnection();
  try {
    const [accounts]: any = await connection.execute(
      `SELECT 
        a.id, 
        a.account_number, 
        a.parent_account_number, 
        a.name_ar, 
        a.name_en, 
        a.account_type_id,
        a.report_type_id,
        a.balance_type_id,
        a.account_level,
        a.status,
        at.name_ar as account_type_name_ar,
        at.name_en as account_type_name_en,
        rt.name_ar as report_type_name_ar,
        rt.name_en as report_type_name_en,
        bt.name_ar as balance_type_name_ar,
        bt.name_en as balance_type_name_en
       FROM accounts a 
       LEFT JOIN account_types at ON a.account_type_id = at.id
       LEFT JOIN report_types rt ON a.report_type_id = rt.id
       LEFT JOIN balance_types bt ON a.balance_type_id = bt.id
       WHERE a.account_number = ?`,
      [accountNumber]
    );

    if (accounts.length === 0) {
      throw new Error('الحساب غير موجود');
    }

    return accounts[0];
  } finally {
    connection.release();
  }
};

export const createAccount = async (data: {
  account_number: string;
  name_ar: string;
  name_en?: string;
  account_type_id: number;
  report_type_id: number;
  balance_type_id: number;
  account_level?: number;
  parent_account_number?: string | null;
}) => {
  const { account_number, name_ar, name_en, account_type_id, report_type_id, balance_type_id, account_level, parent_account_number } = data;

  // Validation
  if (!account_number || !name_ar || !account_type_id || !report_type_id || !balance_type_id) {
    throw new Error('رقم الحساب والاسم ونوع الحساب ونوع التقرير ونوع الرصيد مطلوبة');
  }

  const connection = await getConnection();
  try {
    // Check if account number already exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM accounts WHERE account_number = ?',
      [account_number]
    );

    if (existing.length > 0) {
      throw new Error('رقم الحساب مستخدم بالفعل');
    }

    // Verify parent account exists if provided
    if (parent_account_number) {
      const [parentAccount]: any = await connection.execute(
        'SELECT id FROM accounts WHERE account_number = ?',
        [parent_account_number]
      );

      if (parentAccount.length === 0) {
        throw new Error('الحساب الأب غير موجود');
      }
    }

    // Verify account type exists
    const [accountType]: any = await connection.execute(
      'SELECT id FROM account_types WHERE id = ?',
      [account_type_id]
    );

    if (accountType.length === 0) {
      throw new Error('نوع الحساب غير موجود');
    }

    // Verify report type exists
    const [reportType]: any = await connection.execute(
      'SELECT id FROM report_types WHERE id = ?',
      [report_type_id]
    );

    if (reportType.length === 0) {
      throw new Error('نوع التقرير غير موجود');
    }

    // Verify balance type exists
    const [balanceType]: any = await connection.execute(
      'SELECT id FROM balance_types WHERE id = ?',
      [balance_type_id]
    );

    if (balanceType.length === 0) {
      throw new Error('نوع الرصيد غير موجود');
    }

    // Insert new account
    const result: any = await connection.execute(
      'INSERT INTO accounts (account_number, parent_account_number, name_ar, name_en, account_type_id, report_type_id, balance_type_id, account_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [account_number, parent_account_number || null, name_ar, name_en || null, account_type_id, report_type_id, balance_type_id, account_level || 1]
    );

    return {
      id: result[0].insertId,
      message: 'تم إضافة الحساب بنجاح',
    };
  } finally {
    connection.release();
  }
};

export const updateAccount = async (accountNumber: string, data: {
  account_number?: string;
  name_ar?: string;
  name_en?: string;
  account_type_id?: number;
  report_type_id?: number;
  balance_type_id?: number;
  account_level?: number;
  parent_account_number?: string | null;
  status?: 'active' | 'inactive';
}) => {
  const { account_number, name_ar, name_en, account_type_id, report_type_id, balance_type_id, account_level, parent_account_number, status } = data;

  const connection = await getConnection();
  try {
    // Check if account exists
    const [account]: any = await connection.execute(
      'SELECT id FROM accounts WHERE account_number = ?',
      [accountNumber]
    );

    if (account.length === 0) {
      throw new Error('الحساب غير موجود');
    }

    // If changing account number, verify it's unique
    if (account_number && account_number !== accountNumber) {
      const [existing]: any = await connection.execute(
        'SELECT id FROM accounts WHERE account_number = ? AND account_number != ?',
        [account_number, accountNumber]
      );

      if (existing.length > 0) {
        throw new Error('رقم الحساب مستخدم بالفعل');
      }
    }

    // Verify parent account exists if changing
    if (parent_account_number) {
      const [parentAccount]: any = await connection.execute(
        'SELECT id FROM accounts WHERE account_number = ?',
        [parent_account_number]
      );

      if (parentAccount.length === 0) {
        throw new Error('الحساب الأب غير موجود');
      }
    }

    // Verify account type exists if changing
    if (account_type_id) {
      const [accountType]: any = await connection.execute(
        'SELECT id FROM account_types WHERE id = ?',
        [account_type_id]
      );

      if (accountType.length === 0) {
        throw new Error('نوع الحساب غير موجود');
      }
    }

    // Verify report type exists if changing
    if (report_type_id) {
      const [reportType]: any = await connection.execute(
        'SELECT id FROM report_types WHERE id = ?',
        [report_type_id]
      );

      if (reportType.length === 0) {
        throw new Error('نوع التقرير غير موجود');
      }
    }

    // Verify balance type exists if changing
    if (balance_type_id) {
      const [balanceType]: any = await connection.execute(
        'SELECT id FROM balance_types WHERE id = ?',
        [balance_type_id]
      );

      if (balanceType.length === 0) {
        throw new Error('نوع الرصيد غير موجود');
      }
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];

    if (account_number) {
      updates.push('account_number = ?');
      values.push(account_number);
    }
    if (name_ar) {
      updates.push('name_ar = ?');
      values.push(name_ar);
    }
    if (name_en !== undefined) {
      updates.push('name_en = ?');
      values.push(name_en || null);
    }
    if (account_type_id) {
      updates.push('account_type_id = ?');
      values.push(account_type_id);
    }
    if (report_type_id) {
      updates.push('report_type_id = ?');
      values.push(report_type_id);
    }
    if (balance_type_id) {
      updates.push('balance_type_id = ?');
      values.push(balance_type_id);
    }
    if (account_level) {
      updates.push('account_level = ?');
      values.push(account_level);
    }
    if (parent_account_number !== undefined) {
      updates.push('parent_account_number = ?');
      values.push(parent_account_number || null);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      throw new Error('لا توجد بيانات للتحديث');
    }

    values.push(accountNumber);

    // Update account
    await connection.execute(
      `UPDATE accounts SET ${updates.join(', ')} WHERE account_number = ?`,
      values
    );

    return { message: 'تم تحديث الحساب بنجاح' };
  } finally {
    connection.release();
  }
};

export const deactivateAccount = async (accountNumber: string) => {
  const connection = await getConnection();
  try {
    // Check if account exists
    const [account]: any = await connection.execute(
      'SELECT id FROM accounts WHERE account_number = ?',
      [accountNumber]
    );

    if (account.length === 0) {
      throw new Error('الحساب غير موجود');
    }

    // Soft deactivate: set status = 'inactive'
    await connection.execute(
      'UPDATE accounts SET status = ? WHERE account_number = ?',
      ['inactive', accountNumber]
    );

    return { message: 'تم تعطيل الحساب بنجاح' };
  } finally {
    connection.release();
  }
};

export const activateAccount = async (accountNumber: string) => {
  const connection = await getConnection();
  try {
    // Check if account exists
    const [account]: any = await connection.execute(
      'SELECT id FROM accounts WHERE account_number = ?',
      [accountNumber]
    );

    if (account.length === 0) {
      throw new Error('الحساب غير موجود');
    }

    // Activate: set status = 'active'
    await connection.execute(
      'UPDATE accounts SET status = ? WHERE account_number = ?',
      ['active', accountNumber]
    );

    return { message: 'تم تفعيل الحساب بنجاح' };
  } finally {
    connection.release();
  }
};

export const getParentAccounts = async () => {
  const connection = await getConnection();
  try {
    const [accounts]: any = await connection.execute(
      `SELECT 
        a.id, 
        a.account_number, 
        a.parent_account_number, 
        a.name_ar, 
        a.name_en, 
        a.account_type_id,
        a.report_type_id,
        a.balance_type_id,
        a.account_level,
        a.status,
        a.createdAt,
        a.updatedAt,
        at.name_ar as account_type_name_ar,
        at.name_en as account_type_name_en,
        rt.name_ar as report_type_name_ar,
        rt.name_en as report_type_name_en,
        bt.name_ar as balance_type_name_ar,
        bt.name_en as balance_type_name_en
       FROM accounts a 
       LEFT JOIN account_types at ON a.account_type_id = at.id
       LEFT JOIN report_types rt ON a.report_type_id = rt.id
       LEFT JOIN balance_types bt ON a.balance_type_id = bt.id
       WHERE a.parent_account_number IS NULL
       ORDER BY a.account_number ASC`
    );
    return accounts;
  } finally {
    connection.release();
  }
};
