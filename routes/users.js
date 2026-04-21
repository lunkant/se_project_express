//routes/users.js
const router = require("express").Router();
const { getUsers, createUser } = require("../controllers/users");
const { getUserById } = require("../controllers/users");

// router.get("/", (req, res) => {
//   res.send("User route is working!");
// });
router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/", createUser);

module.exports = router;
