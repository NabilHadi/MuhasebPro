@echo off
REM سكريبت لتثبيت وتشغيل نظام محاسب برو على Windows

echo ======================================
echo نظام محاسب برو - سكريبت التثبيت
echo ======================================

REM تثبيت Backend
echo جاري تثبيت Backend...
cd backend
call npm install
if errorlevel 1 (
  echo فشل تثبيت Backend
  exit /b 1
)
echo تم تثبيت Backend بنجاح

REM تثبيت Frontend
echo جاري تثبيت Frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
  echo فشل تثبيت Frontend
  exit /b 1
)
echo تم تثبيت Frontend بنجاح

echo ======================================
echo تم التثبيت بنجاح!
echo ======================================
echo.
echo الخطوات التالية:
echo 1. أنشئ قاعدة البيانات:
echo    mysql -u root -p ^< database/schema.sql
echo.
echo 2. أنشئ ملف .env في مجلد backend بناءً على .env.example
echo.
echo 3. شغّل Backend:
echo    cd backend ^&^& npm run dev
echo.
echo 4. في نافذة command جديدة، شغّل Frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 5. افتح المتصفح على http://localhost:3000
echo.
pause
