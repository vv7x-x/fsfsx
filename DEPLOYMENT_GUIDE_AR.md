# 📚 دليل الرفع على GitHub و Vercel

## الخطوة 1️⃣: تحضير المشروع

### أ) تثبيت Dependencies

```bash
# اذهب إلى المجلد الرئيسي
cd d:\project

# ثبت جميع Dependencies مرة واحدة
npm run install:all
```

عند مواجهة خطأ `npm ERR!`:
```bash
npm cache clean --force
npm install --legacy-peer-deps
cd backend && npm install --legacy-peer-deps
cd ../frontend && npm install --legacy-peer-deps
```

### ب) إعداد متغيرات البيئة

```bash
# في المجلد الرئيسي
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

**ملء ملفات .env:**

**backend/.env:**
```env
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=5000
NODE_ENV=production
```

**frontend/.env:**
```env
VITE_API_URL=https://your-vercel-url.vercel.app/api
VITE_SOCKET_URL=https://your-vercel-url.vercel.app
```

### ج) اختبر المشروع محليًا

```bash
# تشغيل Vercel محليًا
npm install -g vercel
vercel dev
```

---

## الخطوة 2️⃣: رفع على GitHub

### أ) إنشاء مستودع GitHub

1. اذهب إلى [github.com/new](https://github.com/new)
2. أسماء الاسم: `fsfs` أو `forum-system`
3. الوصف: "FSFS - Forum Social Forum System"
4. انقر **Create Repository**

### ب) رفع الملفات

```bash
# في مجلد المشروع الرئيسي
cd d:\project

# تهيئة git
git init
git add .
git commit -m "Initial commit: FSFS - TypeScript + React + Express Monorepo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fsfs.git
git push -u origin main
```

**استبدل `YOUR_USERNAME` باسم حسابك على GitHub**

---

## الخطوة 3️⃣: رفع على Vercel ✨

### الطريقة الأولى: عبر الواجهة (الأسهل)

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول أو أنشئ حساب
3. انقر **New Project**
4. اختر **Import Git Repository**
5. اختر `fsfs` من قائمة مستودعاتك
6. اترك الإعدادات الافتراضية
7. انقر **Deploy**

### الطريقة الثانية: عبر Vercel CLI

```bash
# 1. ثبت Vercel CLI
npm install -g vercel

# 2. سجل دخول
vercel login

# 3. من مجلد المشروع
cd d:\project
vercel

# 4. اتبع الخطوات التفاعلية
# - هل تريد إرسال مشروع موجود؟ → yes
# - اختر الدليل الرئيسي
# - اختر فريقك (أو الحساب الشخصي)

# 5. للـ Production
vercel --prod
```

---

## الخطوة 4️⃣: إعدادات Vercel البيئية

### إضافة متغيرات البيئة على Vercel:

1. اذهب إلى [vercel.com/dashboard](https://vercel.com/dashboard)
2. انقر على مشروع `fsfs`
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف هذه المتغيرات:

| المتغير | القيمة | الملاحظات |
|--------|--------|---------|
| `DATABASE_URL` | اتصال PostgreSQL | مثال: `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | مفتاح عشوائي قوي | استخدم `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NODE_ENV` | `production` | للـ Production |
| `VITE_API_URL` | رابط Vercel API | سيكون مثل `https://fsfs.vercel.app/api` |

5. انقر **Save** و **Redeploy**

---

## الخطوة 5️⃣: إعداد قاعدة البيانات

### استخدام Supabase (مجاني):

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ `DATABASE_URL` من إعدادات المشروع
4. أضفه إلى متغيرات Vercel البيئية
5. نفذ schema:

```bash
# عبر Supabase SQL Editor
# انسخ محتوى backend/schema.sql والصقه في محرر SQL
# ثم انقر Run
```

أو عبر الطرفية:
```bash
psql "YOUR_DATABASE_URL" -f backend/schema.sql
```

---

## الخطوة 6️⃣: التحقق من النشر

### اختبر المشروع:

1. اذهب إلى `https://fsfs.vercel.app` (استبدل بـ URL الفعلي)
2. جرب تسجيل دخول جديد
3. تحقق من console لرسائل الأخطاء

### عرض السجلات:

```bash
# شاهد السجلات على Vercel
vercel logs

# أو عبر الواجهة:
# Dashboard → fsfs → Deployments → Select → Logs
```

---

## الخطوة 7️⃣: التحديثات المستقبلية

بعد كل تحديث:

```bash
# في مجلد المشروع
git add .
git commit -m "Update: description of changes"
git push origin main

# Vercel سينشر تلقائيًا! 🎉
```

---

## 🛠️ استكشاف الأخطاء

### خطأ: "Module not found"
```bash
# حل
cd backend && npm install --legacy-peer-deps
cd ../frontend && npm install --legacy-peer-deps
```

### خطأ: "Database connection failed"
```bash
# تحقق من:
# 1. DATABASE_URL صحيح في .env
# 2. قاعدة البيانات موجودة
# 3. PostgreSQL يعمل
```

### خطأ: "VITE_API_URL is undefined"
```bash
# تأكد من وجود .env في frontend مع:
VITE_API_URL=https://your-vercel-url.vercel.app/api
```

### خطأ: Port 5000 مستخدم
```bash
# استخدم port مختلف
PORT=5001 npm start
```

---

## ✅ قائمة التحقق النهائية

- ✅ تثبيت Dependencies بنجاح
- ✅ ملفات .env ممتلئة بقيم صحيحة
- ✅ اختبار محلي ناجح
- ✅ مستودع GitHub منشأ
- ✅ كود مرفوع على GitHub
- ✅ Vercel مربوطة بـ GitHub
- ✅ متغيرات البيئة مضافة على Vercel
- ✅ قاعدة البيانات جاهزة
- ✅ النشر على Vercel ناجح
- ✅ اختبار Production يعمل

---

## 📞 الدعم الإضافي

- [توثيق Vercel](https://vercel.com/docs)
- [توثيق GitHub](https://docs.github.com)
- [توثيق PostgreSQL](https://www.postgresql.org/docs)

---

**النتيجة النهائية:** مشروع واحد مرفوع على GitHub و Vercel بسهولة! 🚀
