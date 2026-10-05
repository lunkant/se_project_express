// routes/clothingItems.js
const router = require("express").Router();
const {
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {
  validateClothingItemBody,
  validateItemId,
} = require("../middlewares/validation");

router.post("/", validateClothingItemBody, createClothingItem);
router.delete("/:itemId", validateItemId, deleteClothingItem);
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);
module.exports = router;
