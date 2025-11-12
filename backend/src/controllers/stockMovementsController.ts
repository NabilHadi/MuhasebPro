import { getConnection } from '../config/database';
import * as journalEntriesController from './journalEntriesController';

export const getAllStockMovements = async () => {
  const connection = await getConnection();
  try {
    const [movements]: any = await connection.execute(
      `SELECT sm.*, p.product_code, p.product_name_ar 
       FROM stock_movements sm
       JOIN products p ON sm.product_id = p.id
       ORDER BY sm.movement_date DESC`
    );
    return movements;
  } finally {
    connection.release();
  }
};

export const getMovementsByProductId = async (productId: number) => {
  const connection = await getConnection();
  try {
    const [movements]: any = await connection.execute(
      `SELECT sm.*, p.product_code, p.product_name_ar
       FROM stock_movements sm
       JOIN products p ON sm.product_id = p.id
       WHERE sm.product_id = ?
       ORDER BY sm.movement_date DESC`,
      [productId]
    );
    return movements;
  } finally {
    connection.release();
  }
};

export const createStockMovement = async (data: {
  product_id: number;
  warehouse_id?: number | null;
  movement_type: 'IN' | 'OUT' | 'ADJUSTMENT';
  reference?: string;
  description?: string;
  quantity: number;
  unit_cost?: number;
  movement_date?: string;
  autoCreateJournal?: boolean;
  inventory_account_id?: number;
  adjustment_account_id?: number;
}) => {
  const {
    product_id,
    warehouse_id,
    movement_type,
    reference,
    description,
    quantity,
    unit_cost = 0,
    movement_date = new Date().toISOString().split('T')[0],
    autoCreateJournal = true,
    inventory_account_id,
    adjustment_account_id,
  } = data;

  // Validation
  if (!product_id || !movement_type || quantity === 0) {
    throw new Error('معرف المنتج، نوع الحركة، والكمية مطلوبة');
  }

  if (!['IN', 'OUT', 'ADJUSTMENT'].includes(movement_type)) {
    throw new Error('نوع الحركة يجب أن يكون IN, OUT, أو ADJUSTMENT');
  }

  const connection = await getConnection();
  try {
    // Check if product exists
    const [product]: any = await connection.execute(
      'SELECT id, quantity_on_hand, inventory_account_id FROM products WHERE id = ?',
      [product_id]
    );

    if (product.length === 0) {
      throw new Error('المنتج غير موجود');
    }

    const currentQty = product[0].quantity_on_hand || 0;
    const newQty = currentQty + quantity;

    // Create stock movement record
    const result: any = await connection.execute(
      `INSERT INTO stock_movements (
        product_id, warehouse_id, movement_type, reference, description,
        quantity, unit_cost, movement_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_id, warehouse_id || null, movement_type, reference || null, description || null, quantity, unit_cost, movement_date]
    );

    const movementId = result[0].insertId;

    // Update product quantity
    await connection.execute('UPDATE products SET quantity_on_hand = ? WHERE id = ?', [newQty, product_id]);

    // Auto-create journal entry if requested
    let journalId = null;
    if (autoCreateJournal && inventory_account_id) {
      journalId = await createJournalForMovement(
        movement_type,
        quantity,
        unit_cost,
        inventory_account_id,
        adjustment_account_id,
        reference,
        movement_date,
        product_id,
        connection
      );

      // Link journal entry to stock movement
      if (journalId) {
        await connection.execute('UPDATE stock_movements SET related_journal_id = ? WHERE id = ?', [journalId, movementId]);
      }
    }

    return { id: movementId, journalId, message: 'تم تسجيل حركة المخزون بنجاح' };
  } finally {
    connection.release();
  }
};

/**
 * Create a journal entry for stock movement
 * IN: Debit Inventory, Credit Opening Balance / Capital
 * OUT/ADJUSTMENT Decrease: Debit Adjustment Account, Credit Inventory
 * ADJUSTMENT Increase: Debit Inventory, Credit Adjustment Account
 */
export const createJournalForMovement = async (
  movementType: string,
  quantity: number,
  unitCost: number,
  inventoryAccountId: number,
  adjustmentAccountId: number | undefined,
  reference: string | undefined,
  movementDate: string,
  productId: number,
  connection: any
): Promise<number | null> => {
  try {
    const totalCost = quantity * unitCost;

    // Fetch product name
    const [product]: any = await connection.execute(
      'SELECT product_name_ar, product_code FROM products WHERE id = ?',
      [productId]
    );
    const productName = product.length > 0 ? product[0].product_name_ar : `منتج ${productId}`;

    let debitAccount: number;
    let creditAccount: number;
    let description: string;

    if (movementType === 'IN') {
      // IN: Debit Inventory, Credit Opening Balance/Capital (use first capital account)
      debitAccount = inventoryAccountId;
      const [capitalAccounts]: any = await connection.execute(
        "SELECT id FROM chart_of_accounts WHERE account_type = 'Equity' LIMIT 1"
      );
      creditAccount = capitalAccounts.length > 0 ? capitalAccounts[0].id : inventoryAccountId; // Fallback to inventory
      description = `استقبال مخزون - ${productName}`;
    } else if (movementType === 'ADJUSTMENT') {
      if (quantity > 0) {
        // Increase: Debit Inventory, Credit Adjustment Account
        debitAccount = inventoryAccountId;
        creditAccount = adjustmentAccountId || inventoryAccountId;
        description = `تعديل مخزون زيادة - ${productName}`;
      } else {
        // Decrease: Debit Adjustment Account, Credit Inventory
        debitAccount = adjustmentAccountId || inventoryAccountId;
        creditAccount = inventoryAccountId;
        description = `تعديل مخزون نقصان - ${productName}`;
      }
    } else if (movementType === 'OUT') {
      // OUT: Debit COGS/Expense, Credit Inventory
      const [expenseAccounts]: any = await connection.execute(
        "SELECT id FROM chart_of_accounts WHERE account_type = 'Expense' LIMIT 1"
      );
      debitAccount = expenseAccounts.length > 0 ? expenseAccounts[0].id : inventoryAccountId;
      creditAccount = inventoryAccountId;
      description = `صرف مخزون - ${productName}`;
    } else {
      return null;
    }

    // Create journal entry
    const journalResult: any = await connection.execute(
      `INSERT INTO journal_entries (date, reference, description) VALUES (?, ?, ?)`,
      [movementDate, reference || `MOV-${productId}`, description]
    );

    const journalId = journalResult[0].insertId;

    // Create journal lines
    await connection.execute(
      `INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)`,
      [journalId, debitAccount, totalCost, 0]
    );

    await connection.execute(
      `INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)`,
      [journalId, creditAccount, 0, totalCost]
    );

    return journalId;
  } catch (error) {
    console.error('خطأ في إنشاء قيد محاسبي للحركة:', error);
    return null;
  }
};

export const updateStockMovement = async (
  id: number,
  data: {
    reference?: string;
    description?: string;
    quantity?: number;
    unit_cost?: number;
    movement_date?: string;
  }
) => {
  const connection = await getConnection();
  try {
    // Check if movement exists
    const [movement]: any = await connection.execute(
      'SELECT * FROM stock_movements WHERE id = ?',
      [id]
    );

    if (movement.length === 0) {
      throw new Error('حركة المخزون غير موجودة');
    }

    const currentMovement = movement[0];
    const newQuantity = data.quantity !== undefined ? data.quantity : currentMovement.quantity;
    const quantityDiff = newQuantity - currentMovement.quantity;

    await connection.execute(
      `UPDATE stock_movements SET
        reference = ?, description = ?, quantity = ?, unit_cost = ?, movement_date = ?
      WHERE id = ?`,
      [
        data.reference || currentMovement.reference,
        data.description || currentMovement.description,
        newQuantity,
        data.unit_cost !== undefined ? data.unit_cost : currentMovement.unit_cost,
        data.movement_date || currentMovement.movement_date,
        id,
      ]
    );

    // If quantity changed, update product quantity
    if (quantityDiff !== 0) {
      await connection.execute(
        'UPDATE products SET quantity_on_hand = quantity_on_hand + ? WHERE id = ?',
        [quantityDiff, currentMovement.product_id]
      );
    }

    return { message: 'تم تحديث حركة المخزون بنجاح' };
  } finally {
    connection.release();
  }
};

export const deleteStockMovement = async (id: number) => {
  const connection = await getConnection();
  try {
    // Get the movement to get quantity and product_id
    const [movement]: any = await connection.execute(
      'SELECT * FROM stock_movements WHERE id = ?',
      [id]
    );

    if (movement.length === 0) {
      throw new Error('حركة المخزون غير موجودة');
    }

    const { product_id, quantity, related_journal_id } = movement[0];

    // Delete the stock movement
    await connection.execute('DELETE FROM stock_movements WHERE id = ?', [id]);

    // Reverse the product quantity
    await connection.execute(
      'UPDATE products SET quantity_on_hand = quantity_on_hand - ? WHERE id = ?',
      [quantity, product_id]
    );

    // Delete related journal entry if exists
    if (related_journal_id) {
      await connection.execute('DELETE FROM journal_lines WHERE journal_entry_id = ?', [related_journal_id]);
      await connection.execute('DELETE FROM journal_entries WHERE id = ?', [related_journal_id]);
    }

    return { message: 'تم حذف حركة المخزون والقيد المرتبط بنجاح' };
  } finally {
    connection.release();
  }
};
