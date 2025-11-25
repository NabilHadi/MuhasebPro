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

-- جدول أنواع التقارير
CREATE TABLE IF NOT EXISTS report_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) NOT NULL UNIQUE,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول أنواع الحسابات
CREATE TABLE IF NOT EXISTS account_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول أنواع الأرصدة
CREATE TABLE IF NOT EXISTS balance_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- جدول بيانات الشركة
-- CREATE TABLE IF NOT EXISTS company (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   name VARCHAR(200) NOT NULL,
--   commercialRegister VARCHAR(100),
--   taxId VARCHAR(100),
--   phone VARCHAR(20),
--   email VARCHAR(100),
--   address TEXT,
--   city VARCHAR(50),
--   country VARCHAR(50),
--   logo LONGBLOB,
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول القيود المحاسبية (Journal Entries)
-- CREATE TABLE IF NOT EXISTS journal_entries (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     date DATE NOT NULL,
--     description VARCHAR(255),
--     reference VARCHAR(50),
--     is_void BOOLEAN DEFAULT FALSE,
--     status ENUM('draft', 'posted', 'voided') DEFAULT 'draft',
--     reversed_of INT DEFAULT NULL,
--     FOREIGN KEY (reversed_of) REFERENCES journal_entries(id) ON DELETE SET NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE IF NOT EXISTS units_of_measure_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_ar VARCHAR(100) NOT NULL,       -- Arabic name (e.g. الوزن، الحجم)
  name_en VARCHAR(100),                -- English name
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS units_of_measure (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  name_ar VARCHAR(100) NOT NULL,           -- Arabic name (قطعة، كرتون...)
  name_en VARCHAR(100),                    -- English name
  short_name VARCHAR(20),                  -- Abbreviation (pcs, ctn, kg...)

  category_id INT DEFAULT NULL,            -- FK → units_of_measure_categories(id)

  ratio_to_base DECIMAL(15,6) DEFAULT 1.000000,  
  is_base BOOLEAN DEFAULT FALSE,           
  is_active BOOLEAN DEFAULT TRUE,          
  description TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_uom_category 
    FOREIGN KEY (category_id) REFERENCES units_of_measure_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_number` int NOT NULL UNIQUE,
  `category_name_ar` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_name_en` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO product_categories 
(id, category_number, category_name_ar, category_name_en, description, is_active)
VALUES
(1, 1, 'إلكترونيات', 'Electronics', 'أجهزة إلكترونية مثل الهواتف، الحواسيب، الملحقات', 1),
(2, 2, 'أجهزة كهربائية', 'Home Appliances', 'أجهزة كهربائية منزلية مثل الغسالات والثلاجات', 1),
(3, 3, 'مواد غذائية', 'Food & Groceries', 'مواد غذائية معلبة وطازجة واستهلاكية', 1),
(4, 4, 'مستلزمات مكتبية', 'Office Supplies', 'ورق، أقلام، أحبار، أدوات مكتبية', 1),
(5, 5, 'أثاث', 'Furniture', 'أثاث مكتبي ومنزلي مثل الطاولات والكراسي', 1),
(6, 6, 'ملابس', 'Clothing', 'ملابس رجالية، نسائية، وأطفال', 1),
(7, 7, 'مجوهرات', 'Jewelry', 'ذهب، فضة، إكسسوارات فاخرة', 1),
(8, 8, 'مستحضرات تجميل', 'Cosmetics', 'منتجات التجميل والعناية بالبشرة والشعر', 1),
(9, 9, 'أدوية', 'Pharmaceuticals', 'أدوية ومستلزمات طبية وصحية', 1),
(10, 10, 'قطع غيار سيارات', 'Auto Parts', 'قطع غيار واكسسوارات المركبات', 1),
(11, 11, 'منظفات ومستلزمات منزلية', 'Cleaning & Household', 'منظفات، مطهرات، ومنتجات العناية بالمنزل', 1),
(12, 12, 'ألعاب', 'Toys', 'ألعاب أطفال وتعليمية', 1),
(13, 13, 'خدمات', 'Services', 'خدمات تكميلية غير مرتبطة بمخزون مادي', 1),
(14, 14, 'معدات صناعية', 'Industrial Equipment', 'معدات وأدوات صناعية', 1),
(15, 15, 'مواد بناء', 'Construction Materials', 'مواد بناء، دهانات، إسمنت، حديد', 1),
(16, 16, 'منتجات رقمية', 'Digital Products', 'برامج ورخص إلكترونية ومنتجات رقمية', 1),
(17, 17, 'سجاد وأرضيات', 'Carpets & Flooring', 'سجاد، موكيت، باركيه، وفينيل', 1),
(18, 18, 'مستلزمات مطاعم', 'Restaurant Supplies', 'مستلزمات مطابخ ومطاعم ومقاهي', 1),
(19, 19, 'مستلزمات زراعية', 'Agricultural Supplies', 'بذور، أسمدة، معدات زراعية', 1),
(20, 20, 'أجهزة الشبكات', 'Networking Devices', 'راوترات، سويتشات، معدات شبكات', 1);


CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_code VARCHAR(50) UNIQUE NOT NULL,           -- رقم الصنف
  product_name_ar VARCHAR(255) NOT NULL,              -- الاسم العربي
  product_name_en VARCHAR(255),                       -- الاسم الانجليزي
  cost DECIMAL(15,2) DEFAULT 0.00,                    -- تكلفة الصنف
  profit_ratio DECIMAL(5,2) DEFAULT 0.00,             -- نسبة الارباح (%)
  selling_price DECIMAL(15,2) DEFAULT 0.00,           -- سعر البيع
  main_category_id INT DEFAULT NULL,                  -- القسم الاساسي
  product_group VARCHAR(100) DEFAULT NULL,            -- مجموعة الصنف
  classification_1 VARCHAR(100) DEFAULT NULL,         -- التصنيف الاول
  classification_2 VARCHAR(100) DEFAULT NULL,         -- التصنيف الثاني
  classification_3 VARCHAR(100) DEFAULT NULL,         -- التصنيف الثالث
  classification_4 VARCHAR(100) DEFAULT NULL,         -- التصنيف الرابع
  classification_5 VARCHAR(100) DEFAULT NULL,         -- التصنيف الخامس
  unit_id INT DEFAULT NULL,                           -- وحدة الصنف
  product_type ENUM('Stockable','Service') DEFAULT 'Stockable',
  category_id INT DEFAULT NULL,                       -- الفئة القديمة (للتوافقية)
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (main_category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (unit_id) REFERENCES units_of_measure(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,

  code VARCHAR(50),
  name_ar VARCHAR(200) NOT NULL,
  name_en VARCHAR(200),
  phone VARCHAR(50),
  email VARCHAR(100),
  address TEXT,
  tax_number VARCHAR(100),

  is_active BOOLEAN DEFAULT TRUE,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data for customers table
INSERT INTO customers
(id, code, name_ar, name_en, phone, email, address, tax_number, is_active, createdAt, updatedAt)
VALUES
(1, 'CUST-001', 'شركة النور للتجارة', 'Al Noor Trading Co.', '0501234567', 'info@alnoor.example.com', 'الرياض - شارع العليا، مبنى 12', 'TAX-10001', TRUE, '2025-01-10 09:12:00', '2025-01-10 09:12:00'),
(2, 'CUST-002', 'مؤسسة الريان', 'Al Rayan Establishment', '0502345678', 'contact@alrayan.example.com', 'جدة - حي الروضة، عمارة 5', 'TAX-10002', TRUE, '2025-02-05 11:00:00', '2025-02-05 11:00:00'),
(3, 'CUST-003', 'المستودع الكبير', 'Big Warehouse', '0503456789', 'sales@bigwarehouse.example.com', 'الدمام - المنطقة الصناعية', 'TAX-10003', TRUE, '2025-03-12 14:30:00', '2025-03-12 14:30:00'),
(4, 'CUST-004', 'محلات السعادة', 'Al Saada Stores', '0504567890', 'hello@alsaada.example.com', 'الخبر - شارع الملك فهد', 'TAX-10004', TRUE, '2025-04-01 08:45:00', '2025-04-01 08:45:00'),
(5, 'CUST-005', 'شركة التقنيات الحديثة', 'Modern Tech Ltd.', '0505678901', 'support@modtech.example.com', 'الرياض - طريق الملك عبدالعزيز، مبنى 8', 'TAX-10005', TRUE, '2025-04-20 10:15:00', '2025-04-20 10:15:00'),
(6, 'CUST-006', 'ورشة الأحلام', 'Dreams Workshop', '0506789012', 'contact@dreams.example.com', 'مكة - حي العزيزية، شارع 7', 'TAX-10006', TRUE, '2025-05-07 16:20:00', '2025-05-07 16:20:00'),
(7, 'CUST-007', 'مكتبة المدن', 'Cities Bookstore', '0507890123', 'info@citiesbooks.example.com', 'الرياض - حي النخيل، شارع التجارة', 'TAX-10007', TRUE, '2025-06-11 09:00:00', '2025-06-11 09:00:00'),
(8, 'CUST-008', 'شركة الأغذية الطيبة', 'Tayyib Foods Co.', '0508901234', 'orders@tayyibfoods.example.com', 'جدة - المنطقة التجارية، برج B', 'TAX-10008', TRUE, '2025-07-02 12:10:00', '2025-07-02 12:10:00'),
(9, 'CUST-009', 'مؤسسة النخبة', 'Elite Establishment', '0509012345', 'admin@elite.example.com', 'الدمام - شارع البحر، مبنى 3', 'TAX-10009', FALSE, '2025-07-30 15:40:00', '2025-07-30 15:40:00'),
(10, 'CUST-010', 'حلويات المدينة', 'Al Madina Sweets', '0510123456', 'sales@almadina.example.com', 'الرياض - حي العليا، شارع القصر', 'TAX-10010', TRUE, '2025-08-15 10:05:00', '2025-08-15 10:05:00'),
(11, 'CUST-011', 'موزع المعدات', 'Equip Distributor', '0511234567', 'info@equipdist.example.com', 'جدة - منطقة المخازن', 'TAX-10011', TRUE, '2025-09-01 09:30:00', '2025-09-01 09:30:00'),
(12, 'CUST-012', 'عيادة الأمل', 'Al Amal Clinic', '0512345678', 'appointments@alamal.example.com', 'الخبر - حي الصناعية، شارع 4', 'TAX-10012', TRUE, '2025-09-18 08:00:00', '2025-09-18 08:00:00'),
(13, 'CUST-013', 'مركز التقنية', 'Tech Center', '0513456789', 'support@techcenter.example.com', 'الرياض - حي السليمانية، مبنى 21', 'TAX-10013', TRUE, '2025-10-03 13:25:00', '2025-10-03 13:25:00'),
(14, 'CUST-014', 'مطاعم الشذا', 'Al Shatha Restaurants', '0514567890', 'bookings@alshatha.example.com', 'مكة - شارع الحج التجاري', 'TAX-10014', TRUE, '2025-10-20 18:45:00', '2025-10-20 18:45:00'),
(15, 'CUST-015', 'مؤسسة الأمان', 'Al Aman Co.', '0515678901', 'contact@alaman.example.com', 'الرياض - حي المروج، شارع 12', 'TAX-10015', FALSE, '2025-11-05 11:11:00', '2025-11-05 11:11:00');


CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,   -- رقم التسلسل
  payment_method VARCHAR(50) DEFAULT NULL,      -- طريقة الدفع
  company_id INT DEFAULT NULL,                  -- الشركة (مرجع companies.id)
  warehouse_id INT DEFAULT NULL,                -- المخزن (مرجع warehouses.id)
  is_posted BOOLEAN DEFAULT FALSE,              -- انزال المستند
  tax_number VARCHAR(100) DEFAULT NULL,         -- الرقم الضريبي
  mobile VARCHAR(50) DEFAULT NULL,              -- رقم الجوال
  document_number VARCHAR(50) DEFAULT NULL,     -- رقم المستند
  invoice_date DATE NOT NULL,                   -- التاريخ
  supply_date DATE DEFAULT NULL,                -- تاريخ التوريد
  branch_id INT DEFAULT NULL,                   -- الفرع (مرجع branches.id)
  account_id INT DEFAULT NULL,                  -- رقم الحساب (مرجع accounts.id)
  employee_id INT DEFAULT NULL,                 -- الموظف (مرجع employees.id)
  customer_id INT DEFAULT NULL,                 -- مرجع العميل (customers.id)
  customer_name_ar VARCHAR(200) DEFAULT NULL,   -- اسم العميل (نسخة نصية)
  address TEXT DEFAULT NULL,                    -- العنوان
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- الفهارس الشائعة
  INDEX (invoice_date),
  INDEX (payment_method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- جدول المخازن
-- CREATE TABLE IF NOT EXISTS warehouses (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   is_active BOOLEAN DEFAULT TRUE,
--   name VARCHAR(200) NOT NULL,
--   location VARCHAR(200),
--   manager VARCHAR(100),
--   manager_id INT DEFAULT NULL,
--   type ENUM('Main', 'Branch', 'Transit') DEFAULT 'Main',
--   capacity DECIMAL(10,2) DEFAULT 0,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   FOREIGN KEY (manager_id) REFERENCES users(id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- CREATE TABLE stock_movements (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     product_id INT NOT NULL,
--     warehouse_id INT DEFAULT NULL,
--     movement_type ENUM('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT') NOT NULL,
--     reference VARCHAR(50),                         -- e.g. INV-1001 or PO-2002
--     description VARCHAR(255),
--     quantity DECIMAL(12,2) NOT NULL,
--     unit_cost DECIMAL(12,2) DEFAULT 0.00,          -- Cost per unit for valuation
--     total_cost DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
--     movement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
--     related_journal_id INT DEFAULT NULL,           -- Optional: link to accounting entry
--     created_by INT DEFAULT NULL,
--     FOREIGN KEY (product_id) REFERENCES products(id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- جدول المشتريات
-- CREATE TABLE IF NOT EXISTS purchases (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   invoiceNumber VARCHAR(100),
--   supplierId INT NOT NULL,
--   totalAmount DECIMAL(15, 2) NOT NULL,
--   notes TEXT,
--   status ENUM('pending', 'received', 'cancelled') DEFAULT 'pending',
--   invoiceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   INDEX idx_status (status),
--   INDEX idx_invoiceDate (invoiceDate)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول عناصر المشتريات
-- CREATE TABLE IF NOT EXISTS purchase_items (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   purchaseId INT NOT NULL,
--   productId INT NOT NULL,
--   quantity INT NOT NULL,
--   unitPrice DECIMAL(15, 2) NOT NULL,
--   totalPrice DECIMAL(15, 2) NOT NULL,
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE,
--   FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
--   INDEX idx_purchaseId (purchaseId)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المبيعات
-- CREATE TABLE IF NOT EXISTS sales (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   invoiceNumber VARCHAR(100),
--   customerId INT NOT NULL,
--   totalAmount DECIMAL(15, 2) NOT NULL,
--   discount DECIMAL(15, 2) DEFAULT 0,
--   tax DECIMAL(15, 2) DEFAULT 0,
--   notes TEXT,
--   status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
--   invoiceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   INDEX idx_status (status),
--   INDEX idx_invoiceDate (invoiceDate)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول عناصر المبيعات
-- CREATE TABLE IF NOT EXISTS sale_items (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   saleId INT NOT NULL,
--   productId INT NOT NULL,
--   quantity INT NOT NULL,
--   unitPrice DECIMAL(15, 2) NOT NULL,
--   totalPrice DECIMAL(15, 2) NOT NULL,
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
--   FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
--   INDEX idx_saleId (saleId)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المدفوعات
-- CREATE TABLE IF NOT EXISTS payments (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   relatedType ENUM('purchase', 'sale') NOT NULL,
--   relatedId INT NOT NULL,
--   amount DECIMAL(15, 2) NOT NULL,
--   paymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   paymentMethod ENUM('cash', 'bank_transfer', 'check', 'credit_card') DEFAULT 'cash',
--   reference VARCHAR(100),
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   INDEX idx_relatedId (relatedId),
--   INDEX idx_paymentDate (paymentDate)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول حركات المخزون
-- CREATE TABLE IF NOT EXISTS inventory_movements (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   productId INT NOT NULL,
--   warehouseId INT,
--   movementType ENUM('purchase', 'sale', 'adjustment', 'return') NOT NULL,
--   quantity INT NOT NULL,
--   referenceId INT,
--   notes TEXT,
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
--   FOREIGN KEY (warehouseId) REFERENCES warehouses(id) ON DELETE SET NULL,
--   INDEX idx_productId (productId),
--   INDEX idx_movementType (movementType)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Purchases Module
-- CREATE TABLE IF NOT EXISTS purchase_orders (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   supplier_id INT NOT NULL,
--   warehouse_id INT DEFAULT NULL,
--   reference_no VARCHAR(50),
--   purchase_date DATE NOT NULL,
--   due_date DATE DEFAULT NULL,
--   status ENUM('Draft','Received','Billed','Cancelled') DEFAULT 'Draft',
--   total_amount DECIMAL(15,2) DEFAULT 0.00,
--   total_tax DECIMAL(15,2) DEFAULT 0.00,
--   total_discount DECIMAL(15,2) DEFAULT 0.00,
--   net_amount DECIMAL(15,2) GENERATED ALWAYS AS (total_amount + total_tax - total_discount) STORED,
--   notes TEXT,
--   is_active BOOLEAN DEFAULT TRUE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
--   FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CREATE TABLE IF NOT EXISTS purchase_lines (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   purchase_id INT NOT NULL,
--   product_id INT NOT NULL,
--   quantity DECIMAL(12,2) NOT NULL,
--   unit_price DECIMAL(15,2) NOT NULL,
--   discount DECIMAL(15,2) DEFAULT 0.00,
--   tax DECIMAL(15,2) DEFAULT 0.00,
--   total DECIMAL(15,2) GENERATED ALWAYS AS ((quantity * unit_price) - discount + tax) STORED,
  
--   FOREIGN KEY (purchase_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
--   FOREIGN KEY (product_id) REFERENCES products(id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- ==========================================
-- ==========================================
-- ==========================================
-- ==========================================
-- ==========================================
-- ==========================================
-- ==========================================
-- ==========================================
-- ==========================================

-- ملاحظة: استبدل كلمة المرور المشفرة أعلاه بكلمة مرور محشفة الفعلية

-- بيانات تجريبية لنظام محاسب برو

-- إنشاء حساب تجريبي
INSERT INTO users (username, email, password, fullName, role) VALUES 
('admin', 'admin@accounterp.local', '$2b$10$mh8lQ7KG/U6mPHzQY20rKOxV7fquqmdVrkNdHdn8eCgFPyIjPrOEK', 'مسؤول النظام', 'admin');


-- إدراج أنواع وحدات القياس
INSERT INTO units_of_measure_categories 
(id, name_ar, name_en, description, is_active)
VALUES
(1, 'الوزن', 'Weight', 'وحدات قياس الوزن مثل جرام وكيلو جرام', TRUE),
(2, 'الحجم', 'Volume', 'وحدات قياس السوائل مثل لتر ومليلتر', TRUE),
(3, 'الطول', 'Length', 'وحدات قياس المسافة مثل متر وسنتيمتر', TRUE),
(4, 'الكمية', 'Quantity', 'وحدات العد مثل قطعة وكرتون وعلبة', TRUE),
(5, 'المنطقة', 'Area', 'وحدات قياس المساحة مثل متر مربع', TRUE),
(6, 'الوحدات الجمركية', 'Customs Units', 'وحدات تستخدم لأغراض الجمارك والفواتير الدولية', TRUE),
(7, 'أخرى', 'Other', 'فئات غير مصنفة', TRUE);

-- إدراج وحدات قياس تجريبية
INSERT INTO units_of_measure 
(id, name_ar, name_en, short_name, category_id, ratio_to_base, is_base, is_active, description)
VALUES

-- QUANTITY (Base: قطعة pcs)
(1, 'حبة', 'Piece', 'pcs', 4, 1.000000, TRUE, TRUE, 'الوحدة الأساسية للعد'),
(2, 'علبة', 'Box', 'box', 4, 12.000000, FALSE, TRUE, 'علبة تحتوي على 12 قطعة'),
(3, 'كرتون', 'Carton', 'ctn', 4, 24.000000, FALSE, TRUE, 'كرتون يحتوي على 24 قطعة'),
(4, 'درزن', 'Dozen', 'doz', 4, 12.000000, FALSE, TRUE, 'درزن يحتوي على 12 قطعة'),
-- (5, 'حبة', 'Unit', 'unit', 4, 1.000000, FALSE, TRUE, 'مرادف لقطعة'),

-- WEIGHT (Base: غرام g)
(6, 'غرام', 'Gram', 'g', 1, 1.000000, TRUE, TRUE, 'الوزن الأساسي'),
(7, 'كيلوغرام', 'Kilogram', 'kg', 1, 1000.000000, FALSE, TRUE, '1 كغم = 1000 غرام'),

-- VOLUME (Base: مليلتر ml)
(8, 'مليلتر', 'Milliliter', 'ml', 2, 1.000000, TRUE, TRUE, 'الحجم الأساسي'),
(9, 'لتر', 'Liter', 'L', 2, 1000.000000, FALSE, TRUE, '1 لتر = 1000 مليلتر'),

-- LENGTH (Base: سنتيمتر cm)
(10, 'سنتيمتر', 'Centimeter', 'cm', 3, 1.000000, TRUE, TRUE, 'وحدة الطول الأساسية'),
(11, 'متر', 'Meter', 'm', 3, 100.000000, FALSE, TRUE, '1 متر = 100 سم'),
(12, 'كيلومتر', 'Kilometer', 'km', 3, 100000.000000, FALSE, TRUE, '1 كم = 100000 سم'),

-- AREA (Base: متر مربع m²)
(13, 'متر مربع', 'Square Meter', 'm²', 5, 1.000000, TRUE, TRUE, 'الوحدة الأساسية للمساحة'),
(14, 'سنتيمتر مربع', 'Square Centimeter', 'cm²', 5, 0.0001, FALSE, TRUE, '1 سم² = 0.0001 م²'),

-- CUSTOMS UNITS
(15, 'وحدة جمركية', 'Custom Unit', 'cu', 6, 1.000000, TRUE, TRUE, 'وحدة لأغراض الجمارك'),

-- OTHER
(16, 'خدمة', 'Service', 'srv', 7, 1.000000, TRUE, TRUE, 'وحدة قياس للخدمات (لا تحتاج تحويل)');

INSERT INTO products 
(id, product_code, product_name_ar, product_name_en, cost, profit_ratio, selling_price, main_category_id, product_group, classification_1, classification_2, classification_3, classification_4, classification_5, unit_id, product_type, category_id, is_active, description)
VALUES

-- ELECTRONICS (category_id = 1)
(1, 'ELEC-001', 'هاتف ذكي سامسونج', 'Samsung Smartphone', 1500.00, 30.00, 1950.00, 1, 'هواتف ذكية', 'الهواتف', 'سامسونج', NULL, NULL, NULL, 1, 'Stockable', 1, 1, 'هاتف ذكي بشاشة لمس'),
(2, 'ELEC-002', 'حاسوب محمول لينوفو', 'Lenovo Laptop', 3000.00, 25.00, 3750.00, 1, 'أجهزة كمبيوتر', 'الحواسيب', 'لينوفو', NULL, NULL, NULL, 1, 'Stockable', 1, 1, 'حاسوب محمول للأعمال'),
(3, 'ELEC-003', 'سماعات بلوتوث', 'Bluetooth Headphones', 250.00, 35.00, 337.50, 1, 'الملحقات', 'السماعات', 'بلوتوث', NULL, NULL, NULL, 1, 'Stockable', 1, 1, 'سماعات لاسلكية'),

-- HOME APPLIANCES (category_id = 2)
(4, 'HOME-001', 'غسالة ملابس', 'Washing Machine', 2500.00, 20.00, 3000.00, 2, 'أجهزة غسيل', 'الغسالات', 'اوتوماتيك', NULL, NULL, NULL, 1, 'Stockable', 2, 1, 'غسالة كهربائية'),
(5, 'HOME-002', 'ثلاجة 14 قدم', 'Refrigerator 14ft', 3500.00, 18.00, 4130.00, 2, 'أجهزة تبريد', 'الثلاجات', 'كبيرة', NULL, NULL, NULL, 1, 'Stockable', 2, 1, 'ثلاجة منزلية'),

-- FOOD & GROCERIES (category_id = 3)
(6, 'FOOD-001', 'سكر كيلو', 'Sugar 1kg', 8.50, 40.00, 11.90, 3, 'السكريات', 'السكر', 'أبيض', NULL, NULL, NULL, 7, 'Stockable', 3, 1, 'سكر أبيض ناعم'),
(7, 'FOOD-002', 'أرز بسمتي 5 كيلو', 'Basmati Rice 5kg', 65.00, 35.00, 87.75, 3, 'الحبوب', 'الأرز', 'بسمتي', NULL, NULL, NULL, 7, 'Stockable', 3, 1, 'أرز عالي الجودة'),
(8, 'FOOD-003', 'ماء عبوة 330 مل', 'Water Bottle 330ml', 2.00, 50.00, 3.00, 3, 'المشروبات', 'الماء', 'معبأ', NULL, NULL, NULL, 9, 'Stockable', 3, 1, 'ماء شرب معبأ'),

-- OFFICE SUPPLIES (category_id = 4)
(9, 'OFF-001', 'دفتر 100 ورقة', 'Notebook 100 pages', 5.00, 60.00, 8.00, 4, 'أدوات الكتابة', 'الدفاتر', 'عادي', NULL, NULL, NULL, 1, 'Stockable', 4, 1, 'دفتر للكتابة'),
(10, 'OFF-002', 'حبرة طابعة HP', 'HP Printer Ink', 75.00, 45.00, 108.75, 4, 'الحبر والطباعة', 'الحبر', 'أسود', NULL, NULL, NULL, 1, 'Stockable', 4, 1, 'حبرة طابعة أصلية'),
(11, 'OFF-003', 'قلم حبر أزرق', 'Blue Ink Pen', 1.50, 70.00, 2.55, 4, 'أدوات الكتابة', 'الأقلام', 'أزرق', NULL, NULL, NULL, 1, 'Stockable', 4, 1, 'قلم حبر كتابة'),

-- FURNITURE (category_id = 5)
(12, 'FURN-001', 'كرسي مكتب', 'Office Chair', 400.00, 40.00, 560.00, 5, 'مقاعد', 'الكراسي', 'مكتبية', NULL, NULL, NULL, 1, 'Stockable', 1, 1, 'كرسي مريح'),
(13, 'FURN-002', 'طاولة عمل', 'Work Desk', 600.00, 35.00, 810.00, 5, 'طاولات', 'الطاولات', 'خشبية', NULL, NULL, NULL, 1, 'Stockable', 1, 1, 'طاولة خشبية للمكتب'),

-- CLOTHING (category_id = 6)
(14, 'CLOT-001', 'قميص رجالي', 'Men Shirt', 80.00, 50.00, 120.00, 6, 'ملابس رجالية', 'القمصان', 'قطن', NULL, NULL, NULL, 1, 'Stockable', 6, 1, 'قميص قطن'),
(15, 'CLOT-002', 'بنطال جينز', 'Jeans Pants', 150.00, 45.00, 217.50, 6, 'ملابس رجالية', 'البنطلونات', 'جينز', NULL, NULL, NULL, 1, 'Stockable', 6, 1, 'بنطال جينز عالي الجودة'),

-- COSMETICS (category_id = 8)
(16, 'COS-001', 'عطر نسائي', 'Women Perfume', 200.00, 55.00, 310.00, 8, 'العطور', 'عطور نسائية', 'فرنسي', NULL, NULL, NULL, 8, 'Stockable', 8, 1, 'عطر أنيق'),
(17, 'COS-002', 'شامبو 500 مل', 'Shampoo 500ml', 25.00, 60.00, 40.00, 8, 'العناية', 'الشعر', 'شامبو', NULL, NULL, NULL, 9, 'Stockable', 8, 1, 'شامبو للشعر'),

-- PHARMACEUTICALS (category_id = 9)
(18, 'MED-001', 'باراسيتامول 500 مج', 'Paracetamol 500mg', 15.00, 25.00, 18.75, 9, 'الأدوية', 'مسكنات', 'باراسيتامول', NULL, NULL, NULL, 1, 'Stockable', 9, 1, 'مسكن آلام'),

-- AUTO PARTS (category_id = 10)
(19, 'AUTO-001', 'فلتر زيت', 'Oil Filter', 50.00, 40.00, 70.00, 10, 'قطع المحرك', 'الفلاتر', 'زيت', NULL, NULL, NULL, 1, 'Stockable', 10, 1, 'فلتر محرك'),
(20, 'AUTO-002', 'بطارية سيارة', 'Car Battery', 300.00, 30.00, 390.00, 10, 'البطاريات', 'سيارات', 'رصاص', NULL, NULL, NULL, 1, 'Stockable', 10, 1, 'بطارية عالية الجودة'),

-- CLEANING PRODUCTS (category_id = 11)
(21, 'CLEAN-001', 'كلور 3 لتر', 'Chlorine 3L', 18.00, 65.00, 29.70, 11, 'المطهرات', 'الكلور', 'سائل', NULL, NULL, NULL, 9, 'Stockable', 11, 1, 'مطهر قوي'),
(22, 'CLEAN-002', 'مناديل معطرة', 'Wet Wipes', 5.00, 75.00, 8.75, 11, 'المنظفات', 'مناديل', 'معطرة', NULL, NULL, NULL, 1, 'Stockable', 11, 1, 'مناديل مطهرة'),

-- TOYS (category_id = 12)
(23, 'TOY-001', 'لعبة سيارات', 'Toy Car', 30.00, 55.00, 46.50, 12, 'ألعاب', 'سيارات', 'صغيرة', NULL, NULL, NULL, 1, 'Stockable', 12, 1, 'لعبة أطفال'),

-- SERVICES (category_id = 13) — product_type = Service
(24, 'SRV-001', 'خدمة صيانة كمبيوتر', 'Computer Maintenance Service', 0.00, 0.00, 250.00, 13, 'الخدمات', 'الصيانة', 'الكمبيوتر', NULL, NULL, NULL, NULL, 'Service', 13, 1, 'خدمة إصلاح وصيانة أجهزة'),
(25, 'SRV-002', 'تصميم موقع إلكتروني', 'Website Design Service', 0.00, 0.00, 1500.00, 13, 'الخدمات', 'التصميم', 'ويب', NULL, NULL, NULL, NULL, 'Service', 13, 1, 'خدمة تصميم المواقع'),

-- INDUSTRIAL EQUIPMENT (category_id = 14)
(26, 'IND-001', 'مثقاب كهربائي', 'Electric Drill', 350.00, 30.00, 455.00, 14, 'الأدوات', 'المثاقب', 'كهربائي', NULL, NULL, NULL, 1, 'Stockable', 14, 1, 'عدة كهربائية'),
(27, 'IND-002', 'مطرقة', 'Hammer', 40.00, 50.00, 60.00, 14, 'الأدوات', 'المطاقم', 'معادن', NULL, NULL, NULL, 1, 'Stockable', 14, 1, 'مطرقة معدنية'),

-- CONSTRUCTION MATERIALS (category_id = 15)
(28, 'CONS-001', 'أسمنت كيس 50kg', 'Cement 50kg Bag', 35.00, 20.00, 42.00, 15, 'مواد البناء', 'الأسمنت', 'أبيض', NULL, NULL, NULL, 7, 'Stockable', 15, 1, 'أسمنت البناء'),
(29, 'CONS-002', 'طلاء أبيض', 'White Paint', 120.00, 35.00, 162.00, 15, 'مواد البناء', 'الدهانات', 'أبيض', NULL, NULL, NULL, 9, 'Stockable', 15, 1, 'دهان داخلي'),

-- DIGITAL PRODUCTS (category_id = 16)
(30, 'DIG-001', 'رخصة ويندوز', 'Windows License', 0.00, 0.00, 500.00, 16, 'المنتجات الرقمية', 'البرامج', 'نظام تشغيل', NULL, NULL, NULL, NULL, 'Service', 16, 1, 'رخصة برامج رقمية'),

-- NETWORKING DEVICES (category_id = 20)
(31, 'NET-001', 'راوتر واي فاي', 'WiFi Router', 280.00, 35.00, 378.00, 20, 'معدات الشبكة', 'الراوترات', 'لاسلكي', NULL, NULL, NULL, 1, 'Stockable', 20, 1, 'راوتر لاسلكي'),
(32, 'NET-002', 'سويتش شبكات 8 منافذ', '8-Port Network Switch', 400.00, 30.00, 520.00, 20, 'معدات الشبكة', 'السويتش', '8 منافذ', NULL, NULL, NULL, 1, 'Stockable', 20, 1, 'سويتش قوي للشبكات');

-- ==========================================
-- ==========================================
-- ==========================================

-- إدراج أنواع الحسابات
INSERT INTO account_types (name_ar, name_en) VALUES 
('رئيسي', 'Main'),
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
INSERT INTO accounts 
(id, account_number, parent_account_number, name_ar, name_en, account_type_id, report_type_id, balance_type_id, account_level, status)
VALUES
(1, '1', NULL, 'الأصول', 'Assets', 1, 1, 1, 1, 'active'),
(2, '2', NULL, 'الخصوم', 'Liabilities', 1, 1, 2, 1, 'active'),
(3, '3', NULL, 'المصروفات', 'Expenses', 1, 2, 1, 1, 'active'),
(4, '4', NULL, 'الإيرادات', 'Revenues', 1, 1, 2, 1, 'active'),

(11, '11', '1', 'الأصول المتداولة', 'Current Assets', 1, 1, 1, 2, 'active'),
(12, '111', '11', 'الصناديق', 'Cash Accounts', 1, 1, 1, 3, 'active'),
(13, '1111', '111', 'صندوق الادارة', NULL, 1, 1, 1, 4, 'active'),
(15, '1111001', '1111', 'صندوق الريال السعودي', NULL, 2, 1, 1, 5, 'active'),

(16, '21', '2', 'الخصوم المتداولة', NULL, 1, 1, 2, 2, 'active'),
(17, '22', '2', 'الخصوم غير المتداولة', NULL, 1, 1, 2, 2, 'active'),
(18, '23', '2', 'حقوق الملكية', NULL, 1, 1, 2, 2, 'active'),

(19, '31', '3', 'تكلفة النشاط', NULL, 1, 1, 1, 2, 'active'),
(20, '32', '3', 'مصروفات النشاط', NULL, 1, 1, 1, 2, 'active'),

(21, '41', '4', 'ايرادات النشاط', NULL, 1, 1, 2, 2, 'active'),
(22, '411', '41', 'ايرادات المبيعات', NULL, 1, 1, 2, 3, 'active'),

(23, '12', '1', 'الأصول غير المتداولة', 'Non-Current Assets', 1, 1, 1, 2, 'active'),
(24, '121', '12', 'الممتلكات والمعدات', 'Property & Equipment', 1, 1, 1, 3, 'active'),
(25, '1211', '121', 'الأثاث', 'Furniture', 1, 1, 1, 4, 'active'),
(26, '1212', '121', 'أجهزة الكمبيوتر', 'Computers', 1, 1, 1, 4, 'active'),

(27, '24', '2', 'القروض قصيرة الأجل', 'Short-term Loans', 1, 1, 2, 2, 'active'),
(28, '25', '2', 'القروض طويلة الأجل', 'Long-term Loans', 1, 1, 2, 2, 'active'),

(29, '33', '3', 'مصروفات إدارية', 'Administrative Expenses', 1, 2, 1, 2, 'active'),
(30, '331', '33', 'رواتب الموظفين', 'Salaries', 1, 2, 1, 3, 'active'),
(31, '332', '33', 'مصاريف إيجار', 'Rent Expense', 1, 2, 1, 3, 'active'),

(32, '42', '4', 'ايرادات أخرى', 'Other Revenues', 1, 1, 2, 2, 'active'),
(33, '421', '42', 'ايرادات خدمات', 'Service Revenue', 1, 1, 2, 3, 'active');



