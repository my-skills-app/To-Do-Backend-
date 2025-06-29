# 📝 ToDo App Backend API

A professional Node.js backend API for a ToDo application with JWT authentication, MongoDB integration, and complete CRUD operations.

## 🚀 Features

- **JWT Authentication** - Secure user registration and login
- **MongoDB Integration** - Using Mongoose ODM
- **Password Hashing** - Secure password storage with bcryptjs
- **Input Validation** - Comprehensive validation using express-validator
- **Protected Routes** - JWT middleware for secure endpoints
- **CRUD Operations** - Complete ToDo management
- **Pagination** - Built-in pagination for todo lists
- **Error Handling** - Professional error handling and responses
- **Security** - Helmet, CORS, and rate limiting

## 📁 Project Structure

```
todo-app-api/
├── controllers/
│   ├── authController.js
│   └── todoController.js
├── models/
│   ├── User.js
│   └── Todo.js
├── routes/
│   ├── authRoutes.js
│   └── todoRoutes.js
├── middlewares/
│   └── authMiddleware.js
├── config/
│   └── db.js
├── .env
├── server.js
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/todo-app
   # For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/todo-app

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Security
   BCRYPT_ROUNDS=12
   ```

4. **Start MongoDB** (make sure MongoDB is running locally or use MongoDB Atlas)

5. **Run the application:**
   ```bash
   npm start
   # or for development with nodemon
   npm run dev
   ```

## 🔗 API Endpoints

### Authentication Routes

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Get Current User Profile
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

### Todo Routes (All require authentication)

#### Create Todo
- **POST** `/api/todos`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Complete project",
    "description": "Finish the ToDo API project",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-15T00:00:00.000Z"
  }
  ```

#### Get All Todos
- **GET** `/api/todos`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status` - Filter by status (pending, in-progress, completed)
  - `priority` - Filter by priority (low, medium, high)
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `sortBy` - Sort field (default: createdAt)
  - `sortOrder` - Sort order (asc, desc)

#### Get Single Todo
- **GET** `/api/todos/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Update Todo
- **PUT** `/api/todos/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed",
    "priority": "medium",
    "isCompleted": true
  }
  ```

#### Delete Todo
- **DELETE** `/api/todos/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Toggle Todo Status
- **PATCH** `/api/todos/:id/toggle`
- **Headers:** `Authorization: Bearer <token>`

## 🔐 Authentication

All todo routes require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": [ ... ] // Validation errors if any
}
```

## 🧪 Testing with Postman/Thunder Client

### 1. Register a new user:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login to get token:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Create a todo (use token from login):
```
POST http://localhost:5000/api/todos
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "My first todo",
  "description": "This is a test todo",
  "priority": "high"
}
```

### 4. Get all todos:
```
GET http://localhost:5000/api/todos
Authorization: Bearer <your-token>
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/todo-app |
| `JWT_SECRET` | JWT secret key | fallback-secret |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |

## 🛡️ Security Features

- **Password Hashing** - Passwords are hashed using bcryptjs
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - All inputs are validated and sanitized
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS** - Cross-origin resource sharing configuration
- **Helmet** - Security headers for Express

## 📝 Todo Model Schema

```javascript
{
  title: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  status: String (pending, in-progress, completed),
  priority: String (low, medium, high),
  dueDate: Date (optional),
  user: ObjectId (required, ref to User),
  isCompleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB
4. Set up proper CORS origins

## 📞 Support

For any issues or questions, please check the error logs or create an issue in the repository.

---

**Happy Coding! 🎉** 