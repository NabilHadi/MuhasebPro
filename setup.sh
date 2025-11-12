#!/bin/bash
# سكريبت لتثبيت وتشغيل نظام محاسب برو

echo "======================================"
echo "نظام محاسب برو - سكريبت التثبيت"
echo "======================================"

# الألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تثبيت Backend
echo -e "${YELLOW}جاري تثبيت Backend...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ تم تثبيت Backend بنجاح${NC}"
else
  echo -e "${RED}✗ فشل تثبيت Backend${NC}"
  exit 1
fi

# تثبيت Frontend
echo -e "${YELLOW}جاري تثبيت Frontend...${NC}"
cd ../frontend
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ تم تثبيت Frontend بنجاح${NC}"
else
  echo -e "${RED}✗ فشل تثبيت Frontend${NC}"
  exit 1
fi

echo -e "${GREEN}======================================"
echo -e "✓ تم التثبيت بنجاح!"
echo -e "======================================${NC}"
echo ""
echo "الخطوات التالية:"
echo "1. أنشئ قاعدة البيانات:"
echo "   mysql -u root -p < database/schema.sql"
echo ""
echo "2. أنشئ ملف .env في مجلد backend بناءً على .env.example"
echo ""
echo "3. شغّل Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "4. في نافذة جديدة، شغّل Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "5. افتح المتصفح على http://localhost:3000"
