# دليل التثبيت والتشغيل - محاسب برو

## 📋 المتطلبات

قبل البدء، تأكد من تثبيت:

- **Node.js** (الإصدار 16 أو أحدث) - [تحميل](https://nodejs.org/)
- **npm** (يأتي مع Node.js) أو **yarn**
- **MySQL** (الإصدار 8.0 أو أحدث) - [تحميل](https://www.mysql.com/downloads/)
- **Git** (اختياري) - [تحميل](https://git-scm.com/)
- متصفح ويب حديث (Chrome, Firefox, Edge)

## ✅ التحقق من التثبيت

تأكد من التثبيت الصحيح بتشغيل الأوامر التالية:

```bash
node --version
npm --version
mysql --version
```

## 🗄️ إعداد قاعدة البيانات

### الطريقة الأولى: عبر Command Line

```bash
# تسجيل الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة البيانات
CREATE DATABASE accounterp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# الخروج
exit;

# استيراد المخطط
mysql -u root -p accounterp_db < database/schema.sql
```

### الطريقة الثانية: عبر MySQL Workbench

1. افتح MySQL Workbench
2. اتصل بخادم MySQL
3. انسخ محتوى ملف `database/schema.sql`
4. الصق المحتوى وشغّل الاستعلام

### الطريقة الثالثة: عبر phpMyAdmin

1. افتح phpMyAdmin
2. اضغط على "جديد" (New)
3. أنشئ قاعدة بيانات باسم `accounterp_db`
4. اختر الترميز `utf8mb4_general_ci`
5. استوردAlternative الملف `database/schema.sql`

## 🔧 إعداد Backend

### 1. الانتقال إلى مجلد Backend

```bash
cd backend
```

### 2. تثبيت المتطلبات

```bash
npm install
```

### 3. إنشاء ملف البيئة

انسخ `.env.example` إلى `.env`:

```bash
# على Windows
copy .env.example .env

# على Mac/Linux
cp .env.example .env
```

### 4. تحرير ملف `.env`

افتح `.env` وعدّل القيم:

```env
PORT=5000
NODE_ENV=development

# تعديل بيانات قاعدة البيانات
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=accounterp_db

# غيّر هذا لقيمة آمنة
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

API_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000
```

### 5. تشغيل Backend

```bash
# بوضع التطوير (مع Reload تلقائي)
npm run dev

# أو
npm start
```

ستشاهد رسالة:
```
✓ السيرفر يعمل على المنفذ 5000
✓ تم الاتصال بقاعدة البيانات بنجاح
```

## 🎨 إعداد Frontend

### 1. الانتقال إلى مجلد Frontend (في نافذة جديدة)

```bash
cd frontend
```

### 2. تثبيت المتطلبات

```bash
npm install
```

### 3. تشغيل Frontend

```bash
npm run dev
```

ستشاهد:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

## 🌐 الوصول إلى التطبيق

افتح متصفحك وذهب إلى:

```
http://localhost:3000
```

## 🔑 بيانات الدخول الأولى

```
اسم المستخدم: admin
كلمة المرور: 123456
```

**تحذير مهم**: غير كلمة المرور الافتراضية فور الدخول الأول!

## 📡 اختبار API

يمكنك اختبار API باستخدام Postman أو cURL:

```bash
# اختبار اتصال الخادم
curl http://localhost:5000/api/health

# تسجيل الدخول
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

## 🐛 استكشاف الأخطاء

### Backend لا يعمل

1. تحقق من تشغيل MySQL
2. تحقق من بيانات `.env`
3. تأكد من تثبيت المتطلبات: `npm install`

### Frontend لا يحمّل

1. تأكد من تشغيل Backend أولاً
2. امسح ذاكرة التخزين المؤقت: `Ctrl+Shift+Delete`
3. تحقق من الأخطاء في Console (F12)

### قاعدة البيانات لا تتصل

```sql
-- تحقق من المستخدم
SELECT user, host FROM mysql.user WHERE user='root';

-- أعد تعيين كلمة المرور
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

## 📦 البناء للإنتاج

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

سيتم إنشاء مجلد `dist/` يحتوي على الملفات الجاهزة للنشر.

## 🚀 نشر على الخادم

### على Digital Ocean أو خادم Linux

```bash
# 1. استنسخ المستودع
git clone your-repo-url
cd AccountingERP_RJS

# 2. ثبّت PM2 لتشغيل البيرنامج في الخلفية
npm install -g pm2

# 3. ابدأ Backend
cd backend
npm install
pm2 start "npm start" --name "accounterp-backend"

# 4. ثبّت Nginx
sudo apt install nginx

# 5. عدّل إعدادات Nginx
sudo nano /etc/nginx/sites-available/default
```

مثال على إعدادات Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔐 إجراءات الأمان

قبل النشر:

1. **غيّر كلمة المرور الافتراضية**
2. **استخدم HTTPS** (Let's Encrypt مجانية)
3. **عيّن JWT_SECRET قوية**
4. **استخدم متغيرات بيئية آمنة**
5. **فعّل تسجيل الأخطاء والنشاط**
6. **استخدم Firewall**
7. **عمل نسخة احتياطية منتظمة للبيانات**

## 📞 المساعدة والدعم

للمساعدة:

- اقرأ الـ README الرئيسي
- اطلب في مجموعات المطورين العربية
- ابحث عن الخطأ في documentation المكتبات المستخدمة

## ✨ التالي

بعد التثبيت الناجح:

1. استكشف واجهة المستخدم
2. أنشئ حسابات موظفين
3. ابدأ بإدخال البيانات
4. جرّب جميع الميزات

---

**الحمد لله على النجاح! 🎉**
