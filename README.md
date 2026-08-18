# WTWR (What To Wear?) — Backend API

A RESTful API for **WTWR (What to Wear)**, a weather-based clothing recommendation app. Handles user authentication, clothing item management, and a per-item likes system, backed by MongoDB.

**Frontend repository:** https://github.com/lunkant/se_project_react

**Project pitch:** [Loom video](https://www.loom.com/share/796ac444a66a47aaaa9980af8778e6a0)

---

## Features

- **Authentication** — user registration and login with hashed passwords ([bcrypt](https://www.npmjs.com/package/bcryptjs)) and stateless session management via [JWT](https://jwt.io/)
- **Route-level authorization** — custom middleware verifies the bearer token on every protected route and attaches the authenticated user to the request; public routes (`/signup`, `/signin`, `GET /items`) are explicitly exempted
- **User profiles** — fetch and update the authenticated user's own name and avatar
- **Clothing items** — create, list, and delete clothing items, each tied to an `owner`; deletion is restricted to the item's owner (`403 Forbidden` otherwise)
- **Likes** — any authenticated user can like or unlike any item; likes are stored as an array of user references directly on the item
- **Centralized, consistent error handling** — validation, authorization, not-found, and server errors all return a predictable `{ message }` shape with the appropriate HTTP status code
- **Schema-level validation** — Mongoose schemas enforce required fields, string length limits, a fixed `weather` enum (`hot` / `warm` / `cold`), and real URL format for avatar/image fields ([validator.js](https://www.npmjs.com/package/validator))

## Tech Stack

| | |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express 5 |
| **Database** | MongoDB via Mongoose |
| **Auth** | jsonwebtoken, bcryptjs |
| **Validation** | Mongoose schema validators, validator.js |
| **Tooling** | ESLint (Airbnb config), Prettier, Nodemon |

## API Reference

### Public routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Register a new user — `{ name, avatar, email, password }` |
| `POST` | `/signin` | Log in — `{ email, password }` → `{ token }` |
| `GET` | `/items` | List all clothing items |

### Protected routes

*Every route below requires an `Authorization: Bearer <token>` header.*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users/me` | Get the current authenticated user |
| `PATCH` | `/users/me` | Update the current user's `name` / `avatar` |
| `POST` | `/items` | Create a new clothing item |
| `DELETE` | `/items/:itemId` | Delete an item (owner only) |
| `PUT` | `/items/:itemId/likes` | Like an item |
| `DELETE` | `/items/:itemId/likes` | Unlike an item |

### Error format

All error responses share one shape:

```json
{ "message": "Human-readable description of what went wrong" }
```

| Status | Meaning |
|---|---|
| `400` | Malformed request / failed validation |
| `401` | Missing, invalid, or expired token; incorrect credentials |
| `403` | Authenticated, but not permitted (e.g. deleting someone else's item) |
| `404` | Resource not found |
| `409` | Conflict (e.g. registering with an email already in use) |
| `500` | Unexpected server error |

## Data Models

**User**
- `name` — string, required, 2–30 characters
- `avatar` — string, required, must be a valid URL
- `email` — string, required, unique, must be a valid email
- `password` — string, required, hashed before storage, never returned in API responses

**ClothingItem**
- `name` — string, required, 2–30 characters
- `weather` — string, required, one of `hot` / `warm` / `cold`
- `imageUrl` — string, required, must be a valid URL
- `owner` — ObjectId reference to the creating user
- `likes` — array of ObjectId references to users who've liked the item
- `createdAt` — date, defaults to creation time

## Getting Started

### Prerequisites

- Node.js
- MongoDB installed and runnable locally

### Installation

```bash
git clone https://github.com/lunkant/se_project_express.git
cd se_project_express
npm install
```

### Running locally

Start MongoDB in one terminal:

```bash
mongod
```

Then, in a second terminal, start the API server:

```bash
npm run dev    # nodemon, auto-restarts on file changes
# or
npm start      # plain node
```

By default the server connects to `mongodb://127.0.0.1:27017/wtwr_db` and listens on `http://localhost:3001`.

### Linting

```bash
npm run lint
```

## Project Structure

```
controllers/    # request handlers (business logic)
middlewares/    # auth middleware
models/         # Mongoose schemas
routes/         # route definitions, mapped to controllers
utils/          # shared config and error-code constants
app.js          # entry point — DB connection, middleware, route mounting
```

## Author

**Mardochee Ambroise**
Built as part of the TripleTen Software Engineering program.
