# 📡 دليل API Reference

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register (تسجيل حساب جديد)

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "ahmed",
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "username": "ahmed",
      "email": "ahmed@example.com",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "User already exists with this email"
}
```

---

### 2. Login (تسجيل الدخول)

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "ahmed",
      "email": "ahmed@example.com",
      "avatar": "https://example.com/avatar.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 3. Get Profile (الحصول على ملف المستخدم)

**Request:**
```http
GET /auth/me
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": 1,
    "username": "ahmed",
    "email": "ahmed@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📋 Forum Endpoints

### 4. Get All Posts (جميع المنشورات)

**Request:**
```http
GET /forum/posts
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "مرحباً بالجميع",
      "content": "هذا أول منشور",
      "category": "introductions",
      "username": "ahmed",
      "avatar": "https://example.com/avatar.jpg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "user_id": 2,
      "title": "سؤال عن البرمجة",
      "content": "كيفية استخدام React؟",
      "category": "questions",
      "username": "fatima",
      "avatar": "https://example.com/avatar2.jpg",
      "created_at": "2024-01-14T15:20:00Z",
      "updated_at": "2024-01-14T15:20:00Z"
    }
  ]
}
```

---

### 5. Get Single Post (منشور واحد)

**Request:**
```http
GET /forum/posts/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "مرحباً بالجميع",
    "content": "هذا أول منشور",
    "category": "introductions",
    "username": "ahmed",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 6. Create Post (إنشاء منشور)

**Request:**
```http
POST /forum/posts
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "موضوع جديد",
  "content": "محتوى المنشور هنا",
  "category": "general"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": 3,
    "user_id": 1,
    "title": "موضوع جديد",
    "content": "محتوى المنشور هنا",
    "category": "general",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "User not authenticated"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation Error: title: Title must be at least 5 characters"
}
```

---

### 7. Get Post Comments (تعليقات المنشور)

**Request:**
```http
GET /forum/posts/1/comments
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 2,
      "content": "تعليق رائع!",
      "username": "fatima",
      "avatar": "https://example.com/avatar2.jpg",
      "created_at": "2024-01-15T11:00:00Z"
    },
    {
      "id": 2,
      "post_id": 1,
      "user_id": 3,
      "content": "أتفق معك تماماً",
      "username": "ali",
      "avatar": "https://example.com/avatar3.jpg",
      "created_at": "2024-01-15T11:15:00Z"
    }
  ]
}
```

---

### 8. Create Comment (إضافة تعليق)

**Request:**
```http
POST /forum/posts/1/comments
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "تعليق جديد على المنشور"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 3,
    "post_id": 1,
    "user_id": 1,
    "content": "تعليق جديد على المنشور",
    "created_at": "2024-01-15T11:30:00Z"
  }
}
```

---

## 🔌 Socket.io Events

### Connection

```typescript
// Frontend
const socket = io('http://localhost:5000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('error', (error) => {
  console.error('Connection error:', error);
});
```

---

### Chat Events

**1. Join Chat**
```typescript
// Frontend
socket.emit('join_chat');
```

**2. Send Message**
```typescript
// Frontend
socket.emit('send_message', {
  content: 'مرحباً بالجميع!'
});

// Listen for messages
socket.on('message_sent', (message) => {
  console.log(message);
  // {
  //   id: 1,
  //   user_id: 1,
  //   content: 'مرحباً بالجميع!',
  //   username: 'ahmed',
  //   created_at: '2024-01-15T10:30:00Z'
  // }
});
```

**3. Typing Indicator**
```typescript
// Emit when user is typing
socket.emit('typing');

// Listen for others typing
socket.on('user_typing', (data) => {
  console.log(`${data.username} is typing...`);
});

// Emit when user stops typing
socket.emit('stop_typing');

socket.on('user_stopped_typing', (data) => {
  console.log(`${data.username} stopped typing`);
});
```

---

### Graffiti Events

**1. Join Graffiti Room**
```typescript
socket.emit('join_graffiti');
```

**2. Draw**
```typescript
socket.emit('draw', {
  x: 100,
  y: 150,
  color: '#ff0000',
  size: 5
});

socket.on('draw', (data) => {
  // Update canvas
});
```

**3. Clear**
```typescript
socket.emit('clear_graffiti');

socket.on('clear_graffiti', () => {
  // Clear canvas
});
```

---

## ⚠️ Error Codes

| Code | Message | السبب |
|------|---------|------|
| 400 | Bad Request | بيانات مدخلة خاطئة |
| 401 | Unauthorized | بدون token أو token غير صالح |
| 404 | Not Found | المورد غير موجود |
| 422 | Validation Error | خطأ في validation |
| 429 | Too Many Requests | تجاوز Rate Limit |
| 500 | Internal Server Error | خطأ من الـ server |

---

## 🧪 اختبار مع Postman

### 1. إعداد الـ Environment

```json
{
  "baseUrl": "http://localhost:5000/api",
  "token": ""
}
```

### 2. Scripts للـ Tests

```javascript
// في Post-response Scripts:

// حفظ الـ token بعد Login
if (pm.response.code === 200) {
  const data = pm.response.json();
  pm.environment.set("token", data.data.token);
}

// التحقق من الـ response format
pm.tests["Response is valid", function() {
  pm.expect(pm.response.json()).to.have.property("success");
}];
```

---

## 📝 Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes
- **API endpoints**: 100 requests per 15 minutes

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1610710800
```

---

**🎯 Ready to start? استخدم هذا الـ Reference أثناء التطوير!**
