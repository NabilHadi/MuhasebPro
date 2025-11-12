# دليل نشر المشروع على VPS
# VPS Deployment Guide - Step by Step

## المتطلبات / Requirements
- VPS with Ubuntu 20.04+ or 22.04 (Recommended: DigitalOcean, Linode, AWS EC2)
- Minimum 2GB RAM, 2 CPU cores
- Domain name (optional but recommended)
- SSH access to your VPS

---

## الخطوة 1: إعداد VPS / Step 1: VPS Setup

### 1.1 الاتصال بـ VPS / Connect to VPS
```bash
ssh root@your-vps-ip
```

### 1.2 تحديث النظام / Update System
```bash
apt update && apt upgrade -y
```

### 1.3 إنشاء مستخدم جديد / Create New User
```bash
adduser deployer
usermod -aG sudo deployer
su - deployer
```

---

## الخطوة 2: تثبيت البرامج المطلوبة / Step 2: Install Required Software

### 2.1 تثبيت Node.js / Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x
npm --version
```

### 2.2 تثبيت MySQL / Install MySQL
```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# تأمين MySQL / Secure MySQL
sudo mysql_secure_installation
```

**Answer the prompts:**
- Set root password: YES → choose a strong password
- Remove anonymous users: YES
- Disallow root login remotely: YES
- Remove test database: YES
- Reload privilege tables: YES

### 2.3 إعداد قاعدة البيانات / Setup Database
```bash
sudo mysql -u root -p
```

**في MySQL prompt:**
```sql
CREATE DATABASE accounterp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'erp_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';
GRANT ALL PRIVILEGES ON accounterp_db.* TO 'erp_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.4 تثبيت Nginx / Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.5 تثبيت PM2 / Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 2.6 تثبيت Git / Install Git
```bash
sudo apt install -y git
```

---

## الخطوة 3: رفع المشروع / Step 3: Upload Project

### Option A: Using Git (Recommended)
```bash
cd /home/deployer
git clone https://github.com/NabilHadi/MuhasebPro.git
cd MuhasebPro
```

### Option B: Upload via SCP (من جهازك / From your local machine)
```bash
# On your local machine:
scp -r AccountingERP_RJS deployer@your-vps-ip:/home/deployer/
```

---

## الخطوة 4: إعداد Backend / Step 4: Setup Backend

### 4.1 الانتقال لمجلد Backend
```bash
cd ~/MuhasebPro/backend
```

### 4.2 تثبيت Dependencies
```bash
npm install
```

### 4.3 إنشاء ملف .env
```bash
nano .env
```

**Add this content:**
```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=erp_user
DB_PASSWORD=your_strong_password_here
DB_NAME=accounterp_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://your-domain.com
```

**Save:** `Ctrl+X` → `Y` → `Enter`

### 4.4 استيراد قاعدة البيانات / Import Database
```bash
cd ~/MuhasebPro
mysql -u erp_user -p accounterp_db < database/schema.sql
mysql -u erp_user -p accounterp_db < database/sample_data.sql
```

### 4.5 بناء Backend / Build Backend
```bash
cd ~/MuhasebPro/backend
npm run build
```

---

## الخطوة 5: إعداد Frontend / Step 5: Setup Frontend

### 5.1 الانتقال لمجلد Frontend
```bash
cd ~/MuhasebPro/frontend
```

### 5.2 تثبيت Dependencies
```bash
npm install
```

### 5.3 إنشاء ملف .env
```bash
nano .env
```

**Add this content:**
```env
VITE_API_URL=http://your-domain.com/api
```

**Save:** `Ctrl+X` → `Y` → `Enter`

### 5.4 بناء Frontend / Build Frontend
```bash
npm run build
```

This creates a `dist` folder with all static files that Nginx will serve.

---

## الخطوة 6: تشغيل Backend مع PM2 / Step 6: Run Backend with PM2

**Note:** Frontend doesn't need a separate process manager. After building it with `npm run build`, it becomes static files that Nginx serves directly. Nginx automatically serves the `frontend/dist` folder when you configure it in Step 7.

### Frontend Lifecycle:
- **Development:** `npm run dev` (runs on port 3000)
- **Production:** `npm run build` (creates static files in `dist` folder)
- **Serving:** Nginx serves these static files automatically

### 6.1 بدء Backend
```bash
cd ~/MuhasebPro/backend
pm2 start dist/server.js --name "accounterp-backend"
```

### 6.2 حفظ PM2 للتشغيل التلقائي / Save PM2 for Auto-start
```bash
pm2 save
pm2 startup
# Copy and run the command that PM2 outputs
```

### 6.3 التحقق من الحالة / Check Status
```bash
pm2 status
pm2 logs accounterp-backend
```

---

## الخطوة 7: إعداد Nginx / Step 7: Configure Nginx

### 7.1 إنشاء ملف إعداد Nginx
```bash
sudo nano /etc/nginx/sites-available/accounterp
```

**Add this content:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Change this to your domain or IP

    # Frontend
    location / {
        root /home/deployer/MuhasebPro/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

**Save:** `Ctrl+X` → `Y` → `Enter`

### 7.2 تفعيل الإعداد / Enable Configuration
```bash
sudo ln -s /etc/nginx/sites-available/accounterp /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

---

## الخطوة 8: إعداد Firewall / Step 8: Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## الخطوة 9: إعداد SSL (اختياري لكن موصى به) / Step 9: Setup SSL (Optional but Recommended)

### 9.1 تثبيت Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2 الحصول على شهادة SSL
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Follow the prompts:**
- Enter email
- Agree to terms
- Choose redirect option: 2 (redirect HTTP to HTTPS)

### 9.3 التجديد التلقائي / Auto-renewal
```bash
sudo certbot renew --dry-run  # Test renewal
```

---

## الخطوة 10: التحقق من التشغيل / Step 10: Verify Deployment

### 10.1 فحص الخدمات / Check Services
```bash
# Check MySQL
sudo systemctl status mysql

# Check Nginx (serves Frontend + proxies Backend)
sudo systemctl status nginx

# Check Backend (running with PM2)
pm2 status
pm2 logs accounterp-backend --lines 50

# Check that frontend static files exist
ls -la /home/deployer/MuhasebPro/frontend/dist/

# Check disk space
df -h

# Check memory
free -h
```

**What's running:**
- ✅ MySQL: Database service (systemctl)
- ✅ Nginx: Web server serving frontend + reverse proxy for backend (systemctl)
- ✅ Backend: Node.js app on port 5000 (PM2)
- ✅ Frontend: Static files in `frontend/dist` (served by Nginx, no separate process)

### 10.2 اختبار API
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"جاهز","message":"السيرفر يعمل بشكل صحيح"}
```

### 10.3 فتح المتصفح / Open Browser
```
http://your-domain.com
# or
http://your-vps-ip
```

**Login with default credentials:**
- Username: `admin`
- Password: `admin123`

---

## أوامر مفيدة / Useful Commands

### PM2 Commands
```bash
pm2 list                    # List all processes
pm2 logs                    # View all logs
pm2 logs accounterp-backend # View specific app logs
pm2 restart accounterp-backend  # Restart app
pm2 stop accounterp-backend     # Stop app
pm2 delete accounterp-backend   # Delete app from PM2
pm2 monit                   # Monitor resources
```

### Nginx Commands
```bash
sudo nginx -t                   # Test configuration
sudo systemctl reload nginx     # Reload config
sudo systemctl restart nginx    # Restart Nginx
sudo systemctl status nginx     # Check status
sudo tail -f /var/log/nginx/access.log  # View access logs
sudo tail -f /var/log/nginx/error.log   # View error logs
```

### MySQL Commands
```bash
sudo systemctl status mysql
mysql -u erp_user -p accounterp_db  # Connect to database

# Backup database
mysqldump -u erp_user -p accounterp_db > backup.sql

# Restore database
mysql -u erp_user -p accounterp_db < backup.sql
```

### View Application Logs
```bash
# Backend logs
pm2 logs accounterp-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## تحديث التطبيق / Update Application

### When you make changes:
```bash
cd ~/MuhasebPro

# Pull latest changes
git pull origin main

# Update Backend
cd backend
npm install
npm run build
pm2 restart accounterp-backend

# Update Frontend
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

---

## استكشاف الأخطاء / Troubleshooting

### Backend not working?
```bash
pm2 logs accounterp-backend
# Check for errors in logs
```

### Frontend shows 502 Bad Gateway?
```bash
# Check if backend is running
pm2 status

# Check Nginx config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Database connection error?
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test database connection
mysql -u erp_user -p accounterp_db

# Check backend .env file
cat ~/MuhasebPro/backend/.env
```

### Can't connect to VPS?
```bash
# Check firewall
sudo ufw status

# Make sure ports are open
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
```

---

## نصائح الأمان / Security Tips

1. **تغيير كلمات المرور الافتراضية / Change default passwords**
   - Admin password in the app
   - MySQL passwords
   - SSH keys (don't use password login)

2. **تحديث النظام بانتظام / Regular updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Backup قاعدة البيانات / Backup database**
   ```bash
   # Create cron job for daily backup
   crontab -e
   
   # Add this line:
   0 2 * * * mysqldump -u erp_user -p'your_password' accounterp_db > /home/deployer/backups/db_$(date +\%Y\%m\%d).sql
   ```

4. **مراقبة الموارد / Monitor resources**
   ```bash
   pm2 monit
   htop  # Install: sudo apt install htop
   ```

---

## Done! ✅

Your application should now be live at:
- **HTTP:** `http://your-domain.com` or `http://your-vps-ip`
- **HTTPS:** `https://your-domain.com` (if you set up SSL)

Default login:
- Username: `admin`
- Password: `admin123`

**⚠️ Important: Change the admin password immediately after first login!**
