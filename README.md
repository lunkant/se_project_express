# WTWR (What To Wear?) — Backend API

A RESTful API for **WTWR (What to Wear)**, a weather-based clothing recommendation app. It handles user authentication, clothing item management, and a per-item likes system, backed by MongoDB. The API is deployed on Google Cloud behind nginx with HTTPS.

## Deployed project

- **Frontend:** https://weather-clothes.ftp.sh
- **API (backend):** https://api.weather-clothes.ftp.sh — for example, `GET https://api.weather-clothes.ftp.sh/items`
- **Frontend repository:** https://github.com/lunkant/se_project_react

## Project Pitch Videos

Check out these videos, where I describe my project and some challenges I faced while building it:

- [Full-stack project pitch (frontend, backend, and deployment)](https://www.loom.com/share/2a01aa51ee844bbfa6216df5afe3a5b4)
- [Backend project pitch (earlier sprint)](https://www.loom.com/share/796ac444a66a47aaaa9980af8778e6a0)

---

## Features

- **Authentication** — user registration and login with hashed passwords ([bcrypt](https://www.npmjs.com/package/bcryptjs)) and stateless sessions via [JWT](https://jwt.io/) (tokens expire after 7 days)
- **Route-level authorization** — custom middleware verifies the bearer token on every protected route and attaches the authenticated user to the request; `/signup`, `/signin`, and `GET /items` are public
- **User profiles** — fetch and update the authenticated user's own name and avatar
- **Clothing items** — create, list, and delete clothing items, each tied to an `owner`; deletion is restricted to the item's owner (`403 Forbidden` otherwise)
- **Likes** — any authenticated user can like or unlike any item; likes are stored as an array of user references on the item
- **Request validation** — incoming bodies and route parameters are validated with Joi (via celebrate) before any controller runs
- **Centralized error handling** — every error flows through one middleware and returns a predictable `{ message }` with the right HTTP status code
- **Request and error logging** — every request/response and every error is written to log files

## Technologies and techniques

| Layer          | Technology                                                 |
| -------------- | ---------------------------------------------------------- |
| **Runtime**    | Node.js                                                    |
| **Framework**  | Express 5                                                  |
| **Database**   | MongoDB with Mongoose                                      |
| **Auth**       | jsonwebtoken, bcryptjs                                     |
| **Validation** | celebrate / Joi, validator.js, Mongoose schema validators  |
| **Logging**    | winston, express-winston                                   |
| **Config**     | dotenv (environment variables)                             |
| **Tooling**    | ESLint (Airbnb config), Prettier, Nodemon                  |
| **Deployment** | Google Compute Engine, PM2, nginx, Certbot (Let's Encrypt) |

**Techniques used**

- **Custom error constructors** (`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`) that carry their own HTTP status code, so controllers only call `next(err)`.
- **A single centralized error-handling middleware** that logs the error and sends the response. Unexpected errors return a generic `500` message so internals are never leaked.
- **Request validation as middleware**, with a custom URL rule built on `validator.isURL()` and 24-character hexadecimal checks for IDs.
- **Request and error loggers** that write to the console and to `request.log` / `error.log`. Log files are excluded from git.
- **Secrets in environment variables.** The JWT signing secret is read from a `.env` file on the server and is never committed.
- **Reverse proxy and HTTPS.** nginx forwards the `api` subdomain to the Node process, serves the built React app for the main domain, and terminates HTTPS using a free Let's Encrypt certificate.
- **Process management.** PM2 runs the API in the background, restarts it after a crash, and starts it again when the server reboots.

## API Reference

### Public routes

| Method | Endpoint  | Description                                               |
| ------ | --------- | --------------------------------------------------------- |
| `POST` | `/signup` | Register a new user — `{ name, avatar, email, password }` |
| `POST` | `/signin` | Log in — `{ email, password }` → `{ token }`              |
| `GET`  | `/items`  | List all clothing items                                   |

### Protected routes

_Every route below requires an `Authorization: Bearer <token>` header._

| Method   | Endpoint               | Description                                 |
| -------- | ---------------------- | ------------------------------------------- |
| `GET`    | `/users/me`            | Get the current authenticated user          |
| `PATCH`  | `/users/me`            | Update the current user's `name` / `avatar` |
| `POST`   | `/items`               | Create a new clothing item                  |
| `DELETE` | `/items/:itemId`       | Delete an item (owner only)                 |
| `PUT`    | `/items/:itemId/likes` | Like an item                                |
| `DELETE` | `/items/:itemId/likes` | Unlike an item                              |

### Validation rules

| Request              | Rules                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `POST /signup`       | `name` 2–30 characters (optional), `avatar` valid URL, `email` valid, `password` required |
| `POST /signin`       | `email` valid and required, `password` required                                           |
| `POST /items`        | `name` 2–30 characters, `imageUrl` valid URL                                              |
| `/items/:itemId/...` | `itemId` must be a 24-character hexadecimal string                                        |

### Error format

All error responses share one shape:

```json
{ "message": "Human-readable description of what went wrong" }
```

| Status | Meaning                                                              |
| ------ | -------------------------------------------------------------------- |
| `400`  | Invalid data or an invalid ID                                        |
| `401`  | Missing, invalid, or expired token; incorrect credentials            |
| `403`  | Authenticated, but not permitted (e.g. deleting someone else's item) |
| `404`  | Resource or route not found                                          |
| `409`  | Conflict (e.g. registering with an email already in use)             |
| `500`  | Unexpected server error — "An error has occurred on the server"      |

## Data Models

**User**

- `name` — string, required, 2–30 characters
- `avatar` — string, required, must be a valid URL
- `email` — string, required, unique, must be a valid email
- `password` — string, required, hashed before storage, `select: false` so it is never returned

**ClothingItem**

- `name` — string, required, 2–30 characters
- `weather` — string, required, one of `hot` / `warm` / `cold`
- `imageUrl` — string, required, must be a valid URL
- `owner` — ObjectId reference to the creating user, required
- `likes` — array of ObjectId references to users who liked the item, required
- `createdAt` — date, required, defaults to creation time

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

The server connects to a local MongoDB database named `wtwr_db` on port 27017 and listens on `http://localhost:3001`.

### Environment variables

In development no configuration is needed. In production, create a `.env` file (it is listed in `.gitignore` and must never be committed):

```
NODE_ENV=production
JWT_SECRET=your-long-random-secret
```

| Variable     | Purpose                                                                        |
| ------------ | ------------------------------------------------------------------------------ |
| `JWT_SECRET` | Secret used to sign and verify tokens. A development default is used if unset. |
| `NODE_ENV`   | Set to `production` on the server.                                             |

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Linting and formatting

```bash
npm run lint
npx prettier --check .
```

## Deployment

The backend runs on a Google Compute Engine virtual machine (Ubuntu):

1. **Server setup:** Node.js, MongoDB, and Git installed on the VM; the repository is cloned and `npm install` is run.
2. **PM2** starts the API (`pm2 start app.js`), restarts it after crashes, and relaunches it on reboot (`pm2 startup` and `pm2 save`).
3. **DNS:** three subdomains point to the VM — the main domain and `www` for the frontend, and `api` for the backend.
4. **nginx** acts as a reverse proxy: requests to the `api` subdomain are forwarded to the Node process on port 3001, and requests to the main domain serve the built React app from a static folder.
5. **HTTPS:** a Let's Encrypt certificate issued with Certbot covers all three names, and nginx redirects HTTP to HTTPS.
6. **Secrets:** the JWT secret lives in a `.env` file on the server only.

To deploy an update:

```bash
ssh <user>@<server>
cd se_project_express
git pull origin main
npm install
pm2 restart app
```

## Project Structure

```
controllers/        # request handlers (users, clothing items)
middlewares/
  errors/           # custom error constructors
  auth.js           # JWT authorization
  error-handler.js  # centralized error handling
  logger.js         # winston request and error loggers
  validation.js     # Joi / celebrate request validation
models/             # Mongoose schemas (user, clothingItem)
routes/             # route definitions mapped to controllers
utils/              # shared config and error-code constants
app.js              # entry point: DB connection, middleware, routes
```

## Author

**Mardochee Ambroise**
Built as part of the TripleTen Software Engineering program.
