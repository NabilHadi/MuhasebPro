import { getConnection } from '../config/database';

export const getAllAccounts = async () => {
  const connection = await getConnection();
  try {
    const [accounts]: any = await connection.execute(
      'SELECT id, account_code, account_name_ar, account_name_en, account_type, normal_side, is_group, is_active FROM chart_of_accounts WHERE is_active = TRUE ORDER BY account_code ASC'
    );
    return accounts;
  } finally {
    connection.release();
  }
};

export const getAccountById = async (id: string | number) => {
  const connection = await getConnection();
  try {
    const [accounts]: any = await connection.execute(
      'SELECT * FROM chart_of_accounts WHERE id = ?',
      [id]
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
  account_code: string;
  account_name_ar: string;
  account_name_en?: string;
  account_type: string;
  normal_side: string;
  parent_id?: number | null;
  is_group?: boolean;
  description?: string;
}) => {
  const { account_code, account_name_ar, account_name_en, account_type, normal_side, parent_id, is_group, description } = data;

  // Validation
  if (!account_code || !account_name_ar || !account_type || !normal_side) {
    throw new Error('الرمز والاسم والنوع والجانب العادي مطلوبة');
  }

  const connection = await getConnection();
  try {
    // Check if code already exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM chart_of_accounts WHERE account_code = ?',
      [account_code]
    );

    if (existing.length > 0) {
      throw new Error('رمز الحساب مستخدم بالفعل');
    }

    // Insert new account
    const result: any = await connection.execute(
      'INSERT INTO chart_of_accounts (account_code, account_name_ar, account_name_en, account_type, normal_side, parent_id, is_group, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [account_code, account_name_ar, account_name_en || null, account_type, normal_side, parent_id || null, is_group || false, description || null]
    );

    return {
      id: result[0].insertId,
      message: 'تم إضافة الحساب بنجاح',
    };
  } finally {
    connection.release();
  }
};

export const updateAccount = async (id: string | number, data: {
  account_code: string;
  account_name_ar: string;
  account_name_en?: string;
  account_type: string;
  normal_side: string;
  parent_id?: number | null;
  is_group?: boolean;
  description?: string;
  is_active?: boolean;
}) => {
  const { account_code, account_name_ar, account_name_en, account_type, normal_side, parent_id, is_group, description, is_active } = data;

  // Validation
  if (!account_code || !account_name_ar || !account_type || !normal_side) {
    throw new Error('الرمز والاسم والنوع والجانب العادي مطلوبة');
  }

  const connection = await getConnection();
  try {
    // Check if account exists
    const [account]: any = await connection.execute(
      'SELECT id FROM chart_of_accounts WHERE id = ?',
      [id]
    );

    if (account.length === 0) {
      throw new Error('الحساب غير موجود');
    }

    // Check if code is unique (if changed)
    const [existing]: any = await connection.execute(
      'SELECT id FROM chart_of_accounts WHERE account_code = ? AND id != ?',
      [account_code, id]
    );

    if (existing.length > 0) {
      throw new Error('رمز الحساب مستخدم بالفعل');
    }

    // Update account
    await connection.execute(
      'UPDATE chart_of_accounts SET account_code = ?, account_name_ar = ?, account_name_en = ?, account_type = ?, normal_side = ?, parent_id = ?, is_group = ?, description = ?, is_active = ? WHERE id = ?',
      [account_code, account_name_ar, account_name_en || null, account_type, normal_side, parent_id || null, is_group || false, description || null, is_active !== undefined ? is_active : true, id]
    );

    return { message: 'تم تحديث الحساب بنجاح' };
  } finally {
    connection.release();
  }
};

export const deleteAccount = async (id: string | number) => {
  const connection = await getConnection();
  try {
    // Check if account exists
    const [account]: any = await connection.execute(
      'SELECT id FROM chart_of_accounts WHERE id = ?',
      [id]
    );

    if (account.length === 0) {
      throw new Error('الحساب غير موجود');
    }

    // Soft delete: set is_active = FALSE
    await connection.execute(
      'UPDATE chart_of_accounts SET is_active = FALSE WHERE id = ?',
      [id]
    );

    return { message: 'تم تعطيل الحساب بنجاح' };
  } finally {
    connection.release();
  }
};

export const getParentAccounts = async () => {
  const connection = await getConnection();
  try {
    const [accounts]: any = await connection.execute(
      'SELECT id, account_code, account_name_ar, account_name_en, account_type FROM chart_of_accounts WHERE is_group = TRUE AND is_active = TRUE ORDER BY account_code ASC'
    );
    return accounts;
  } finally {
    connection.release();
  }
};
