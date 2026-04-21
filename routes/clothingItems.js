// routes/clothingItems.js
const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItemById,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.get("/:itemId", getClothingItemById);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
module.exports = router;
