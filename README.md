# WTWR Backend API

## 📌 Project Description

This project is the backend server for the **WTWR (What to Wear)** application.
It provides a RESTful API that allows users to create profiles and manage clothing items based on weather conditions.

The server is built with **Node.js**, **Express**, and **MongoDB**, and follows best practices for routing, validation, and error handling.

---

## ⚙️ Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for building APIs
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **Validator** – Data validation library
- **ESLint (Airbnb config)** – Code quality and style
- **Nodemon** – automatically restarts a Node.js server whenever developer makes a change to the backend code.

- **Prettier** – Code formatting

---

## 🚀 Features

### 👤 Users

- Create a new user
- Get all users
- Get a user by ID

### 👕 Clothing Items

- Create a clothing item
- Get all clothing items
- Get a clothing item by ID
- Delete a clothing item

### ❤️ Likes System

- Like an item
- Unlike an item

### ⚠️ Error Handling

- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- All errors return a consistent format:

```json
{
  "message": "Error description"
}
```

---

## 📡 API Endpoints

### Users

- `GET /users` – Get all users
- `GET /users/:userId` – Get user by ID
- `POST /users` – Create a new user

### Clothing Items

- `GET /items` – Get all items
- `GET /items/:itemId` – Get item by ID
- `POST /items` – Create a new item
- `DELETE /items/:itemId` – Delete an item

### Likes

- `PUT /items/:itemId/likes` – Like an item
- `DELETE /items/:itemId/likes` – Unlike an item

---

### User

- `name` (string, required)
- `avatar` (string, required, URL)

### ClothingItem

- `name` (string, required)
- `weather` (string, required: hot, warm, cold)
- `imageUrl` (string, required, URL)
- `owner` (ObjectId, reference to user)
- `likes` (array of ObjectIds)
- `createdAt` (date)

---

## 🛠️ Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running locally on:

```
mongodb://127.0.0.1:27017/wtwr_db
```

### 3. Run the server

```bash
npm start
```

The prokject uses nodemon:

```bash
npm run dev
```

---

## Server

The server runs on:

```
http://localhost:3001
```

## 📂 Project Structure

```
controllers/
models/
routes/
utils/
app.js
```

---

## 📎 Notes

- A temporary middleware is used to simulate the current user (`req.user`)
- Error status codes are centralized in `utils/errors.js`
- All routes are handled through `routes/index.js`
- A fallback 404 handler is implemented for unknown routes

---

## Mardochee Ambroise

Developed as part of a backend project using Node.js and Express.
