-- بيانات تجريبية لنظام محاسب برو
-- ==========================================

-- إدراج مستخدمين تجريبيين
INSERT INTO users (username, email, password, fullName, role) VALUES 
('accountant', 'accountant@accounterp.local', '$2b$10$xxxxx', 'محمد علي - المحاسب', 'accountant'),
('sales', 'sales@accounterp.local', '$2b$10$xxxxx', 'فاطمة سعيد - مبيعات', 'sales'),
('warehouse', 'warehouse@accounterp.local', '$2b$10$xxxxx', 'احمد حسن - مخزن', 'warehouse');

-- إدراج بيانات الشركة
INSERT INTO company (name, commercialRegister, taxId, phone, email, address, city, country) VALUES 
('شركة النور للتجارة', '1234567890', 'SA1234567890000', '+966123456789', 'info@alnoor.com', 'الرياض - شارع الملك فهد', 'الرياض', 'السعودية');

-- إدراج موردين تجريبيين
INSERT INTO suppliers (name, email, phone, address, city, country, taxId, paymentTerms) VALUES 
('مصنع النور للمنتجات', 'contact@almuntagat.com', '+966591234567', 'الدمام - المنطقة الصناعية', 'الدمام', 'السعودية', 'SA9876543210000', 'دفع عند الاستلام'),
('شركة الجودة للواردات', 'sales@aljouda.com', '+966501111111', 'جدة - ميناء جدة', 'جدة', 'السعودية', 'SA1111111111000', 'أجل 30 يوم'),
('مصنع السلام الصناعي', 'info@alsalam.com', '+966522222222', 'الإحساء - الشرقية', 'الإحساء', 'السعودية', 'SA2222222222000', 'أجل 45 يوم');

-- إدراج عملاء تجريبيين
INSERT INTO customers (name, email, phone, address, city, country, taxId, creditLimit) VALUES 
('محل السوق المركزي', 'owner@souq.com', '+966551234567', 'الرياض - السوق القديم', 'الرياض', 'السعودية', 'SA3333333333000', 50000.00),
('متجر الشرق الإلكتروني', 'sales@sharqonline.com', '+966503456789', 'جدة - شارع التحلية', 'جدة', 'السعودية', 'SA4444444444000', 75000.00),
('مركز التمويل والتجارة', 'manager@altamweel.com', '+966544444444', 'الدمام - الخليج مول', 'الدمام', 'السعودية', 'SA5555555555000', 100000.00);

-- إدراج مخازن تجريبية
INSERT INTO warehouses (name, location, manager, capacity) VALUES 
('المخزن الرئيسي', 'الرياض - المنطقة الصناعية', 'احمد حسن', 10000),
('مخزن الفرع', 'جدة - ميناء جدة', 'سارة محمد', 5000);

-- إدراج منتجات تجريبية
INSERT INTO products (name, sku, description, category, buyingPrice, sellingPrice, quantity, minimumStock, maximumStock) VALUES 
('مكيف هواء 2.5 طن', 'AC-2500', 'مكيف هواء بارد', 'أجهزة كهربائية', 2500.00, 3500.00, 15, 5, 50),
('ثلاجة 600 لتر', 'REF-600', 'ثلاجة عالية السعة', 'أجهزة مطبخ', 4000.00, 5500.00, 8, 3, 30),
('غسالة 8 كيلو', 'WASH-8', 'غسالة أوتوماتيكية', 'أجهزة مطبخ', 1800.00, 2500.00, 2, 4, 40);
