# توثيق API - محاسب برو

## 📌 معلومات عامة

- **Base URL:** `http://localhost:5000/api`
- **Content-Type:** `application/json`
- **Authentication:** Bearer Token (JWT)

## 🔐 المصادقة

### تسجيل حساب جديد
```
POST /auth/register
```

**Parameters:**
```json
{
  "username": "username",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Full Name"
}
```

**Response:**
```json
{
  "message": "تم إنشاء الحساب بنجاح"
}
```

### تسجيل الدخول
```
POST /auth/login
```

**Parameters:**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

## 👥 المستخدمين

### الحصول على جميع المستخدمين (Admin فقط)
```
GET /users
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### الحصول على بيانات المستخدم الحالي
```
GET /users/profile
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "fullName": "Admin User",
  "role": "admin"
}
```

### تغيير دور المستخدم (Admin فقط)
```
PUT /users/:id/role
```

**Parameters:**
```json
{
  "role": "accountant"
}
```

## 👥 الموردين

### الحصول على جميع الموردين
```
GET /suppliers
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Supplier Name",
    "email": "supplier@example.com",
    "phone": "+966123456789",
    "address": "Address",
    "city": "City",
    "country": "Country",
    "taxId": "TAX123",
    "paymentTerms": "Net 30"
  }
]
```

### إضافة مورد جديد
```
POST /suppliers
```

**Parameters:**
```json
{
  "name": "Supplier Name",
  "email": "supplier@example.com",
  "phone": "+966123456789",
  "address": "Address",
  "city": "City",
  "country": "Country",
  "taxId": "TAX123",
  "paymentTerms": "Net 30"
}
```

**Response:**
```json
{
  "id": 1,
  "message": "تم إضافة المورد بنجاح"
}
```

### تحديث مورد
```
PUT /suppliers/:id
```

**Parameters:** (نفس إضافة مورد)

### حذف مورد
```
DELETE /suppliers/:id
```

## 👤 العملاء

### الحصول على جميع العملاء
```
GET /customers
```

### إضافة عميل جديد
```
POST /customers
```

**Parameters:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+966123456789",
  "address": "Address",
  "city": "City",
  "country": "Country",
  "taxId": "TAX123",
  "creditLimit": 50000
}
```

### تحديث عميل
```
PUT /customers/:id
```

### حذف عميل
```
DELETE /customers/:id
```

## 📦 المنتجات

### الحصول على جميع المنتجات
```
GET /products
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "sku": "SKU-001",
    "description": "Description",
    "category": "Category",
    "buyingPrice": 100.00,
    "sellingPrice": 150.00,
    "quantity": 50,
    "minimumStock": 10,
    "maximumStock": 200
  }
]
```

### إضافة منتج جديد
```
POST /products
```

**Parameters:**
```json
{
  "name": "Product Name",
  "sku": "SKU-001",
  "description": "Description",
  "category": "Category",
  "buyingPrice": 100.00,
  "sellingPrice": 150.00,
  "minimumStock": 10,
  "maximumStock": 200
}
```

### تحديث منتج
```
PUT /products/:id
```

### حذف منتج
```
DELETE /products/:id
```

## 🏭 المخازن

### الحصول على جميع المخازن
```
GET /warehouses
```

### إضافة مخزن جديد
```
POST /warehouses
```

**Parameters:**
```json
{
  "name": "Warehouse Name",
  "location": "Location",
  "manager": "Manager Name",
  "capacity": 10000
}
```

### تحديث مخزن
```
PUT /warehouses/:id
```

## 🛒 المشتريات

### الحصول على جميع المشتريات
```
GET /purchases
```

### إضافة فاتورة شراء جديدة
```
POST /purchases
```

**Parameters:**
```json
{
  "supplierId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 10,
      "unitPrice": 100.00,
      "totalPrice": 1000.00
    }
  ],
  "totalAmount": 1000.00,
  "notes": "Notes",
  "status": "pending"
}
```

## 💰 المبيعات

### الحصول على جميع المبيعات
```
GET /sales
```

### إضافة فاتورة بيع جديدة
```
POST /sales
```

**Parameters:**
```json
{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "unitPrice": 150.00,
      "totalPrice": 750.00
    }
  ],
  "totalAmount": 750.00,
  "discount": 0,
  "tax": 0,
  "notes": "Notes",
  "status": "pending"
}
```

## 📊 التقارير

### لوحة التحكم (Dashboard)
```
GET /reports/dashboard
```

**Response:**
```json
{
  "totalSalesToday": 10000.00,
  "totalPurchasesToday": 5000.00,
  "productCount": 50,
  "lowStockProducts": [
    {
      "id": 1,
      "name": "Product Name",
      "sku": "SKU-001",
      "quantity": 2,
      "minimumStock": 10
    }
  ]
}
```

### تقرير المبيعات
```
GET /reports/sales
```

### تقرير المشتريات
```
GET /reports/purchases
```

## 🏢 بيانات الشركة

### الحصول على بيانات الشركة
```
GET /company
```

### تحديث بيانات الشركة (Admin فقط)
```
PUT /company
```

**Parameters:**
```json
{
  "name": "Company Name",
  "commercialRegister": "CR123",
  "taxId": "TAX123",
  "phone": "+966123456789",
  "email": "company@example.com",
  "address": "Address",
  "city": "City",
  "country": "Country",
  "logo": "base64_encoded_image"
}
```

## ⚠️ رموز الخطأ

### 200 - نجاح
```json
{
  "message": "تمت العملية بنجاح"
}
```

### 400 - بيانات خاطئة
```json
{
  "message": "جميع الحقول مطلوبة"
}
```

### 401 - غير مصرح
```json
{
  "message": "لم يتم توفير رمز المصادقة"
}
```

### 403 - ممنوع
```json
{
  "message": "ليس لديك صلاحيات كافية"
}
```

### 404 - غير موجود
```json
{
  "message": "المورد غير موجود"
}
```

### 500 - خطأ الخادم
```json
{
  "message": "خطأ في السيرفر"
}
```

## 🔒 ملاحظات الأمان

1. **جميع الطلبات المحمية** تتطلب رمز JWT صحيح
2. **صلاحيات الدور** يتم التحقق منها على كل طلب
3. **كلمات المرور** مشفرة باستخدام bcrypt
4. **يتم تسجيل جميع العمليات** للأمان والتتبع

## 📝 مثال استخدام JavaScript/Fetch

```javascript
// الحصول على الموردين
fetch('http://localhost:5000/api/suppliers', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## 📝 مثال استخدام cURL

```bash
# تسجيل الدخول
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

# الحصول على الموردين
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/suppliers
```

---

للمزيد من المعلومات، راجع الملفات الأخرى في المشروع.
