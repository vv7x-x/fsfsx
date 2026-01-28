# ⚙️ دليل الإعدادات والمشاكل الشائعة

## 🔧 الإعدادات الأساسية

### 1. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
createdb fsfs_db

# تطبيق schema
psql -U postgres -d fsfs_db -f backend/schema.sql

# التحقق من الجداول
psql -U postgres -d fsfs_db
\dt
```

### 2. متغيرات البيئة

**Backend (.env)**
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/fsfs_db

# JWT
JWT_SECRET=your_super_secret_key_change_in_production

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**
```env
# API
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🆘 مشاكل شائعة وحلولها

### ❌ المشكلة: "Cannot find module 'express'"

```
Error: Cannot find module 'express'
```

**الحل:**
```bash
cd backend
npm install
# أو
npm install --save express typescript ts-node
```

### ❌ المشكلة: "Database connection failed"

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**الحل:**
1. تحقق من تشغيل PostgreSQL:
```bash
# Windows
pg_ctl status

# Linux/Mac
brew services list | grep postgres
```

2. تحقق من DATABASE_URL في .env:
```env
# الصيغة الصحيحة:
DATABASE_URL=postgresql://user:password@host:port/database
```

3. اختبر الاتصال:
```bash
psql postgresql://user:password@localhost:5432/fsfs_db
```

### ❌ المشكلة: "Port 5000 already in use"

```
Error: listen EADDRINUSE :::5000
```

**الحل:**
```bash
# Windows: ابحث عن العملية وأوقفها
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# أو غيّر PORT في .env
PORT=5001
```

### ❌ المشكلة: "CORS error"

```
Access to XMLHttpRequest blocked by CORS policy
```

**الحل:**
```typescript
// تأكد من أن CORS محسّنة في server.ts
app.use(cors());

// أو تحديد origin معين:
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
```

### ❌ المشكلة: "401 Unauthorized"

```
Error: "توكن غير صالح"
```

**الحل:**
```typescript
// تأكد من أن token يتم إرساله مع كل request:
// في api.ts:
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem("fsfs_token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// أو وحدوياً:
fetch(url, {
  headers: {
    'Authorization': token
  }
})
```

### ❌ المشكلة: "Hot Module Replacement (HMR) not working"

```
WebSocket closed
```

**الحل:**
```typescript
// في vite.config.ts:
export default defineConfig({
  server: {
    port: 3000,
    hmr: {
      host: 'localhost',
      port: 3000
    }
  }
});
```

### ❌ المشكلة: "Validation error: X is not a valid email"

```
Validation Error: email: Invalid email address
```

**الحل:**
```typescript
// تأكد من صيغة البريد الإلكتروني:
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// أو استخدم Zod:
const schema = z.object({
  email: z.string().email("Invalid email address")
});
```

### ❌ المشكلة: "Cannot GET /api/auth/login"

```
404 Not Found
```

**الحل:**
1. تأكد من أن routes محسّنة في server.ts:
```typescript
app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes);
```

2. تأكد من الـ path الصحيح:
```typescript
// ✅ صحيح
router.post("/login", AuthController.login);

// ❌ خطأ
router.post("/auth/login", AuthController.login); // سيصبح /api/auth/auth/login
```

### ❌ المشكلة: "npm ERR! code EACCES (Permission denied)"

**الحل:**
```bash
# لا تستخدم sudo مع npm
# بدلاً من ذلك، غيّر مالك node_modules:
sudo chown -R $(whoami) ~/.npm

# أو استخدم nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node
```

---

## 📋 Checklist قبل البدء

- [ ] Node.js مثبت (`node --version`)
- [ ] npm مثبت (`npm --version`)
- [ ] PostgreSQL مثبت وتعمل (`psql --version`)
- [ ] Clone المشروع
- [ ] تثبيت dependencies: `npm install` في كلا المجلدين
- [ ] نسخ .env.example إلى .env
- [ ] ملء متغيرات البيئة الصحيحة
- [ ] تشغيل Database schema
- [ ] بدء Backend: `npm run dev`
- [ ] بدء Frontend: `npm run dev`

---

## 🧪 اختبار الاتصال

### اختبار Backend

```bash
# 1. التحقق من صحة الـ TypeScript
cd backend
npx tsc --noEmit

# 2. اختبار Health Check
curl http://localhost:5000/health

# 3. اختبار Registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### اختبار Frontend

```bash
# 1. التحقق من صحة الـ TypeScript
cd frontend
npx tsc --noEmit

# 2. فحص الـ linting
npm run lint

# 3. بناء الـ production
npm run build
```

---

## 📱 اختبار على الهاتف

### الوصول إلى Server من جهاز آخر

```env
# في .env الخاص بـ Frontend:
VITE_API_URL=http://YOUR_COMPUTER_IP:5000/api
VITE_SOCKET_URL=http://YOUR_COMPUTER_IP:5000
```

### الحصول على IP الجهاز

```bash
# Windows
ipconfig | findstr "IPv4"

# Linux/Mac
ifconfig | grep "inet "
```

---

## 📚 أدوات مفيدة للتطوير

### 1. Postman - لاختبار API
```
https://www.postman.com/downloads/
```

### 2. VS Code Extensions
```
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- REST Client
- PostgreSQL
- Socket.io Client
```

### 3. Database GUI
```
- pgAdmin 4 (PostgreSQL GUI)
- DBeaver (Cross-platform DB Tool)
```

---

## 🚀 Deployment Checklist

قبل الـ deployment:

- [ ] `npm run build` نجح بدون أخطاء
- [ ] `npm run lint` لا توجد أخطاء
- [ ] المتغيرات الحساسة في .env الـ production
- [ ] Database backup موجود
- [ ] SSL certificate جاهز
- [ ] Domain name محسّن
- [ ] Environment الـ production معزول عن Development

---

## 💡 نصائح للأداء

### Backend
```typescript
// استخدم Database Indexes
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

// استخدم Pagination
router.get('/posts?page=1&limit=10', ...);

// Cache نتائج البيانات المتكررة
const cache = new Map();
```

### Frontend
```typescript
// استخدم React.memo للـ Components الثقيلة
export const ForumPost = React.memo(({ post }) => {
  return <div>{post.title}</div>;
});

// استخدم useMemo للحسابات المعقدة
const sortedPosts = useMemo(() => {
  return posts.sort((a, b) => b.id - a.id);
}, [posts]);

// استخدم useCallback لـ Event Handlers
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

---

**هل تحتاج لمساعدة إضافية؟ تحقق من الملفات الأخرى في المشروع! 📖**
