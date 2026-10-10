// routes/index.js
const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const NotFoundError = require("../middlewares/errors/NotFoundError");
const { createUser, login } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateUserInfoBody,
  validateAuthentication,
} = require("../middlewares/validation");

router.post("/signup", validateUserInfoBody, createUser);
router.post("/signin", validateAuthentication, login);
router.get("/items", getClothingItems);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
