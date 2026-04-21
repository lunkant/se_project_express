// routes/clothingItems.js
const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItemById,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.get("/:itemId", getClothingItemById);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem);

module.exports = router;
