-- نظام محاسب برو - قاعدة البيانات
-- ==========================================

-- تعيين الترميز للـ UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET COLLATION_CONNECTION = utf8mb4_unicode_ci;

-- جدول الحسابات
CREATE TABLE IF NOT EXISTS accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  account_number VARCHAR(50) NOT NULL UNIQUE,
  parent_account_number VARCHAR(50) DEFAULT NULL,
  name_ar VARCHAR(200) NOT NULL,
  name_en VARCHAR(200),
  account_type_id INT NOT NULL,
  report_type_id INT NOT NULL,
  balance_type_id INT NOT NULL,
  account_level INT NOT NULL DEFAULT 1,
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_type_id) REFERENCES account_types(id),
  FOREIGN KEY (report_type_id) REFERENCES report_types(id),
  FOREIGN KEY (balance_type_id) REFERENCES balance_types(id),
  FOREIGN KEY (parent_account_number) REFERENCES accounts(account_number),
  INDEX idx_parent_account (parent_account_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- جدول أنواع التقارير
CREATE TABLE IF NOT EXISTS report_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) NOT NULL UNIQUE,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO report_types (code, name_ar, name_en)
VALUES
('BAL', 'الميزانية العمومية', 'Balance Sheet'),
('PL', 'الأرباح والخسائر', 'Profit and Loss');

-- جدول أنواع الحسابات
CREATE TABLE IF NOT EXISTS account_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO account_types (name_ar, name_en)
VALUES 
('أساسي', 'Main'),
('فرعي', 'Sub');

-- جدول أنواع الأرصدة
CREATE TABLE IF NOT EXISTS balance_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO balance_types (name_ar, name_en)
VALUES
('مدين', 'Debit'),
('دائن', 'Credit');


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



CREATE TABLE IF NOT EXISTS units_of_measure (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_ar VARCHAR(100) NOT NULL,             -- Arabic name (e.g. "قطعة", "كرتون", "لتر")
  name_en VARCHAR(100),                      -- English name (optional)
  short_name VARCHAR(20),                    -- Abbreviation (e.g. "pcs", "ctn", "L")
  category VARCHAR(100) DEFAULT 'General',   -- For grouping (e.g. Weight, Length, Volume)
  ratio_to_base DECIMAL(15,6) DEFAULT 1.000000,  -- Conversion factor to base unit (e.g. 1 box = 12 pcs)
  is_base BOOLEAN DEFAULT FALSE,             -- Marks the base unit in that category
  is_active BOOLEAN DEFAULT TRUE,            -- Soft delete flag
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_code VARCHAR(50) UNIQUE,
  product_name_ar VARCHAR(255) NOT NULL,
  product_name_en VARCHAR(255),
  category_id INT DEFAULT NULL,
  unit_id INT DEFAULT NULL,
  product_type ENUM('Stockable','Service') DEFAULT 'Stockable',
  reorder_level DECIMAL(12,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (unit_id) REFERENCES units_of_measure(id) ON DELETE SET NULL
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

-- بيانات تجريبية لنظام محاسب برو
-- ==========================================
-- إدراج مستخدمين تجريبيين
INSERT INTO users (username, email, password, fullName, role) VALUES 
('accountant', 'accountant@accounterp.local', '$2b$10$mh8lQ7KG/U6mPHzQY20rKOxV7fquqmdVrkNdHdn8eCgFPyIjPrOEK', 'محاسب النظام', 'accountant');
('sales', 'sales@accounterp.local', '$2b$10$mh8lQ7KG/U6mPHzQY20rKOxV7fquqmdVrkNdHdn8eCgFPyIjPrOEK', 'موظف المبيعات', 'sales');
('warehouse', 'warehouse@accounterp.local', '$2b$10$mh8lQ7KG/U6mPHzQY20rKOxV7fquqmdVrkNdHdn8eCgFPyIjPrOEK', 'أمين المخزن', 'warehouse');
-- ملاحظة: استبدل كلمة المرور المشفرة أعلاه بكلمة مرور محشفة الفعلية
-- إدراج بيانات الشركة
INSERT INTO company (name, commercialRegister, taxId, phone, email, address, city, country) VALUES 
('شركة النور للتجارة', '1234567890', 'SA1234567890000', '+966123456789', 'info@alnoor.com', 'شارع الملك فهد', 'الرياض', 'السعودية');
-- إدراج موردين تجريبيين
INSERT INTO suppliers (name, email, phone, address, city, country, taxId, paymentTerms) VALUES 
('مصنع النور للمنتجات', 'contact@alnoorfactory.com', '+966112233445', 'المنطقة الصناعية، الرياض', 'الرياض', 'السعودية', 'SA9876543210000', '30 يوم');
('شركة الجودة للواردات', 'contact@aljawdahimports.com', '+966554433221', 'المنطقة الحرة، جدة', 'جدة', 'السعودية', 'SA1234567890000', '45 يوم');
-- إدراج عملاء تجريبيين
INSERT INTO customers (name, email, phone, address, city, country, taxId, creditLimit) VALUES 
('محل السوق المركزي', 'contact@centralsouq.com', '+966667788990', 'شارع السوق، الرياض', 'الرياض', 'السعودية', 'SA1122334455000', '10000');
('متجر الشرق الإلكتروني', 'contact@sharqstore.com', '+966778899001', 'شارع الشرق، جدة', 'جدة', 'السعودية', 'SA9988776655000', '15000');
-- إدراج مخازن تجريبية
INSERT INTO warehouses (name, location, manager, capacity) VALUES 
('المخزن الرئيسي', 'المنطقة الصناعية، الرياض', 'أحمد علي', 5000),
('مخزن الفرع', 'المنطقة الحرة، جدة', 'سارة محمد', 3000);
-- إدراج منتجات تجريبية
INSERT INTO products (name, sku, description, category, buyingPrice, sellingPrice, quantity, minimumStock, maximumStock) VALUES 
('مكيف هواء 2.5 طن', 'AC-2500', 'مكيف هواء بارد', 'أجهزة كهربائية', 2500.00, 3500.00, 15, 5, 50),
('ثلاجة 600 لتر', 'REF-600', 'ثلاجة عالية السعة', 'أجهزة مطبخ', 4000.00, 5500.00, 8, 3, 30),
('غسالة 8 كيلو', 'WASH-8', 'غسالة أوتوماتيكية', 'أجهزة مطبخ', 1800.00, 2500.00, 2, 4, 40);
-- إدراج أنواع وحدات القياس
INSERT INTO units_of_measure (name_ar, name_en, short_name, category, ratio_to_base, is_base) VALUES 
('قطعة', 'Piece', 'pcs', 'General', 1.000000, TRUE),
('كرتون', 'Carton', 'ctn', 'General', 12.000000, FALSE),
('لتر', 'Liter', 'L', 'Volume', 1.000000, TRUE),
('ملليلتر', 'Milliliter', 'mL', 'Volume', 0.001000, FALSE);
-- إدراج فئات المنتجات
INSERT INTO product_categories (category_name_ar, category_name_en, description) VALUES 
('أجهزة كهربائية', 'Electronics', 'منتجات وأجهزة كهربائية متنوعة'),
('أجهزة مطبخ', 'Kitchen Appliances', 'أجهزة وأدوات للمطبخ والمنزل');
-- إدراج أنواع الحسابات
INSERT INTO account_types (name_ar, name_en) VALUES 
('أساسي', 'Main'),
('فرعي', 'Sub');
-- إدراج أنواع التقارير
INSERT INTO report_types (code, name_ar, name_en) VALUES 
('BAL', 'الميزانية العمومية', 'Balance Sheet'),
('PL', 'الأرباح والخسائر', 'Profit and Loss');
-- إدراج أنواع الأرصدة
INSERT INTO balance_types (name_ar, name_en) VALUES
('مدين', 'Debit'),
('دائن', 'Credit');
-- إدراج حسابات محاسبية تجريبية
INSERT INTO accounts (account_number, parent_account_number, name_ar, name_en, account_type_id, report_type_id, balance_type_id, account_level, status) VALUES 
('1', NULL, 'الأصول', 'Assets', 1, 1, 1, 1, 'active'),
('11', '1', 'النقدية والبنوك', 'Cash and Banks', 1, 1, 1, 2, 'active'),
('111', '11', 'النقدية', 'Cash', 1, 1, 1, 3, 'active'),
('112', '11', 'البنك الأهلي', 'National Bank', 2, 1, 1, 3, 'active'),
('2', NULL, 'الخصوم', 'Liabilities', 1, 1, 2, 1, 'active'),
('21', '2', 'الحسابات الدائنة', 'Accounts Payable', 1, 1, 2, 2, 'active'),
('211', '21', 'موردين محليين', 'Local Suppliers', 2, 1, 2, 3, 'active'),
('3', NULL, 'الإيرادات', 'Revenue', 1, 2, 2, 1, 'active'),
('31', '3', 'مبيعات المنتجات', 'Product Sales', 2, 2, 2, 2, 'active'),
('4', NULL, 'المصروفات', 'Expenses', 1, 2, 1, 1, 'active'),
('41', '4', 'مصروفات التشغيل', 'Operating Expenses', 2, 2, 1, 2, 'active');



