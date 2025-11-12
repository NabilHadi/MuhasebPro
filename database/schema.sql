-- نظام محاسب برو - قاعدة البيانات
-- ==========================================

-- تعيين الترميز للـ UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET COLLATION_CONNECTION = utf8mb4_unicode_ci;

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(100),
  role ENUM('admin', 'accountant', 'sales', 'warehouse') DEFAULT 'accountant',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول بيانات الشركة
CREATE TABLE IF NOT EXISTS company (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  commercialRegister VARCHAR(100),
  taxId VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  city VARCHAR(50),
  country VARCHAR(50),
  logo LONGBLOB,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الحسابات (Chart of Accounts)
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_code VARCHAR(20) UNIQUE,
    account_name_ar VARCHAR(255) NOT NULL,
    account_name_en VARCHAR(255),
    account_type ENUM('Asset', 'Liability', 'Equity', 'Revenue', 'Expense') NOT NULL,
    normal_side ENUM('مدين', 'دائن') NOT NULL,
    parent_id INT DEFAULT NULL,
    is_group BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
    INDEX idx_code (account_code),
    INDEX idx_type (account_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول القيود المحاسبية (Journal Entries)
CREATE TABLE IF NOT EXISTS journal_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255),
    reference VARCHAR(50),
    is_void BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'posted', 'voided') DEFAULT 'draft',
    reversed_of INT DEFAULT NULL,
    FOREIGN KEY (reversed_of) REFERENCES journal_entries(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول تفاصيل القيود (Journal Lines)
CREATE TABLE IF NOT EXISTS journal_lines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    journal_entry_id INT NOT NULL,
    account_id INT NOT NULL,
    debit DECIMAL(12,2) DEFAULT 0,
    credit DECIMAL(12,2) DEFAULT 0,
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    INDEX idx_account (account_id),
    INDEX idx_entry (journal_entry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- جدول الموردين
CREATE TABLE IF NOT EXISTS suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  is_active BOOLEAN DEFAULT TRUE,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  country VARCHAR(50),
  tax_id VARCHAR(100),
  payment_terms VARCHAR(100),
  opening_balance DECIMAL(15, 2) DEFAULT 0,
  account_payable_id INT DEFAULT NULL,
  created_by INT DEFAULT NULL,
  updated_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  FOREIGN KEY (account_payable_id) REFERENCES chart_of_accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول العملاء
CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  is_active BOOLEAN DEFAULT TRUE,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  country VARCHAR(50),
  tax_id VARCHAR(100),
  credit_limit DECIMAL(15, 2) DEFAULT 0,
  opening_balance DECIMAL(15, 2) DEFAULT 0,
  account_receivable_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  FOREIGN KEY (account_receivable_id) REFERENCES chart_of_accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE,                -- SKU or internal code
    product_name_ar VARCHAR(255) NOT NULL,          -- Arabic name
    product_name_en VARCHAR(255),                   -- English name
    category_id INT DEFAULT NULL,                   -- For grouping (e.g. Electronics)
    unit_of_measure VARCHAR(50) DEFAULT 'وحدة',    -- e.g. قطعة / كرتون
    product_type ENUM('Stockable', 'Service', 'Consumable') DEFAULT 'Stockable',
    track_inventory BOOLEAN DEFAULT TRUE,           -- True if it affects stock
    quantity_on_hand DECIMAL(12,2) DEFAULT 0.00,    -- Total current quantity
    cost_price DECIMAL(12,2) DEFAULT 0.00,          -- Purchase cost
    sale_price DECIMAL(12,2) DEFAULT 0.00,          -- Sale price
    reorder_level DECIMAL(12,2) DEFAULT 0.00,       -- Alert when stock below this
    warehouse_id INT DEFAULT NULL,                  -- Main storage location
    income_account_id INT DEFAULT NULL,             -- Link to chart_of_accounts (Sales)
    expense_account_id INT DEFAULT NULL,            -- Link to chart_of_accounts (COGS)
    inventory_account_id INT DEFAULT NULL,          -- Link to chart_of_accounts (Inventory)
    is_active BOOLEAN DEFAULT TRUE,                 -- Can be sold/purchased
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (income_account_id) REFERENCES chart_of_accounts(id),
    FOREIGN KEY (expense_account_id) REFERENCES chart_of_accounts(id),
    FOREIGN KEY (inventory_account_id) REFERENCES chart_of_accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name_ar` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_name_en` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المخازن
CREATE TABLE IF NOT EXISTS warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  is_active BOOLEAN DEFAULT TRUE,
  name VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  manager VARCHAR(100),
  manager_id INT DEFAULT NULL,
  type ENUM('Main', 'Branch', 'Transit') DEFAULT 'Main',
  capacity DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    warehouse_id INT DEFAULT NULL,
    movement_type ENUM('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT') NOT NULL,
    reference VARCHAR(50),                         -- e.g. INV-1001 or PO-2002
    description VARCHAR(255),
    quantity DECIMAL(12,2) NOT NULL,
    unit_cost DECIMAL(12,2) DEFAULT 0.00,          -- Cost per unit for valuation
    total_cost DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    movement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    related_journal_id INT DEFAULT NULL,           -- Optional: link to accounting entry
    created_by INT DEFAULT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- جدول المشتريات
CREATE TABLE IF NOT EXISTS purchases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoiceNumber VARCHAR(100),
  supplierId INT NOT NULL,
  totalAmount DECIMAL(15, 2) NOT NULL,
  notes TEXT,
  status ENUM('pending', 'received', 'cancelled') DEFAULT 'pending',
  invoiceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE RESTRICT,
  INDEX idx_status (status),
  INDEX idx_invoiceDate (invoiceDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول عناصر المشتريات
CREATE TABLE IF NOT EXISTS purchase_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  purchaseId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  unitPrice DECIMAL(15, 2) NOT NULL,
  totalPrice DECIMAL(15, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_purchaseId (purchaseId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المبيعات
CREATE TABLE IF NOT EXISTS sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoiceNumber VARCHAR(100),
  customerId INT NOT NULL,
  totalAmount DECIMAL(15, 2) NOT NULL,
  discount DECIMAL(15, 2) DEFAULT 0,
  tax DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
  invoiceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE RESTRICT,
  INDEX idx_status (status),
  INDEX idx_invoiceDate (invoiceDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول عناصر المبيعات
CREATE TABLE IF NOT EXISTS sale_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  saleId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  unitPrice DECIMAL(15, 2) NOT NULL,
  totalPrice DECIMAL(15, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_saleId (saleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المدفوعات
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  relatedType ENUM('purchase', 'sale') NOT NULL,
  relatedId INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  paymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paymentMethod ENUM('cash', 'bank_transfer', 'check', 'credit_card') DEFAULT 'cash',
  reference VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_relatedId (relatedId),
  INDEX idx_paymentDate (paymentDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول حركات المخزون
CREATE TABLE IF NOT EXISTS inventory_movements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  productId INT NOT NULL,
  warehouseId INT,
  movementType ENUM('purchase', 'sale', 'adjustment', 'return') NOT NULL,
  quantity INT NOT NULL,
  referenceId INT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (warehouseId) REFERENCES warehouses(id) ON DELETE SET NULL,
  INDEX idx_productId (productId),
  INDEX idx_movementType (movementType)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الأدوار والصلاحيات
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول صلاحيات الدور
CREATE TABLE IF NOT EXISTS role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  roleId INT NOT NULL,
  permission VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_role_permission (roleId, permission)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchases Module

CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  warehouse_id INT DEFAULT NULL,
  reference_no VARCHAR(50),
  purchase_date DATE NOT NULL,
  due_date DATE DEFAULT NULL,
  status ENUM('Draft','Received','Billed','Cancelled') DEFAULT 'Draft',
  total_amount DECIMAL(15,2) DEFAULT 0.00,
  total_tax DECIMAL(15,2) DEFAULT 0.00,
  total_discount DECIMAL(15,2) DEFAULT 0.00,
  net_amount DECIMAL(15,2) GENERATED ALWAYS AS (total_amount + total_tax - total_discount) STORED,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS purchase_lines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  discount DECIMAL(15,2) DEFAULT 0.00,
  tax DECIMAL(15,2) DEFAULT 0.00,
  total DECIMAL(15,2) GENERATED ALWAYS AS ((quantity * unit_price) - discount + tax) STORED,
  
  FOREIGN KEY (purchase_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إدراج الأدوار الافتراضية
INSERT INTO roles (name, description) VALUES 
('admin', 'مسؤول النظام - صلاحيات كاملة'),
('accountant', 'محاسب - إدارة الحسابات والفواتير'),
('sales', 'موظف مبيعات - إنشاء فواتير المبيعات'),
('warehouse', 'أمين المخزن - إدارة المخزون');

-- إنشاء حساب تجريبي
INSERT INTO users (username, email, password, fullName, role) VALUES 
('admin', 'admin@accounterp.local', '$2b$10$mh8lQ7KG/U6mPHzQY20rKOxV7fquqmdVrkNdHdn8eCgFPyIjPrOEK', 'مسؤول النظام', 'admin');

-- ملاحظة: استبدل كلمة المرور المشفرة أعلاه بكلمة مرور محشفة الفعلية

INSERT INTO chart_of_accounts (account_code, account_name_ar, account_type, normal_side, is_group, parent_id)
VALUES
-- الأصول
('1000', 'الأصول', 'Asset', 'مدين', TRUE, NULL),
('1001', 'الصندوق', 'Asset', 'مدين', FALSE, 1),
('1002', 'البنك', 'Asset', 'مدين', FALSE, 1),
('1003', 'العملاء', 'Asset', 'مدين', FALSE, 1),
('1004', 'المخزون', 'Asset', 'مدين', FALSE, 1),

-- الخصوم
('2000', 'الخصوم', 'Liability', 'دائن', TRUE, NULL),
('2001', 'الموردين', 'Liability', 'دائن', FALSE, 6),
('2002', 'الضرائب المستحقة', 'Liability', 'دائن', FALSE, 6),

-- حقوق الملكية
('3000', 'حقوق الملكية', 'Equity', 'دائن', TRUE, NULL),
('3001', 'رأس المال', 'Equity', 'دائن', FALSE, 9),
('3002', 'الأرباح المحتجزة', 'Equity', 'دائن', FALSE, 9),

-- الإيرادات
('4000', 'الإيرادات', 'Revenue', 'دائن', TRUE, NULL),
('4001', 'إيرادات المبيعات', 'Revenue', 'دائن', FALSE, 13),
('4002', 'إيرادات الخدمات', 'Revenue', 'دائن', FALSE, 13),

-- المصروفات
('5000', 'المصروفات', 'Expense', 'مدين', TRUE, NULL),
('5001', 'مصروف الإيجار', 'Expense', 'مدين', FALSE, 16),
('5002', 'مصروف الرواتب', 'Expense', 'مدين', FALSE, 16),
('5003', 'مصروف الكهرباء والمياه', 'Expense', 'مدين', FALSE, 16),
('5004', 'مصروف اللوازم المكتبية', 'Expense', 'مدين', FALSE, 16),
('5005', 'مصروف الصيانة', 'Expense', 'مدين', FALSE, 16),
('5006', 'مصروف الإنترنت والاتصالات', 'Expense', 'مدين', FALSE, 16);
