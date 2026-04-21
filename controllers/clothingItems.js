// controllers/clothingItems.js
const ClothingItem = require("../models/clothingItem");

// Get all clothing items
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error("Error fetching clothing items:", err);
      return res.status(500).send({ message: err.message });
    });
};

// Create a new clothing item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error("Error creating clothing item:", err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

// Delete a clothing item by ID
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error("Error deleting clothing item:", err);

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Clothing item not found" });
      }

      return res.status(500).send({ message: err.message });
    });
};

const getClothingItemById = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error("Error fetching clothing item by ID:", err);

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Clothing item not found" });
      }

      return res.status(500).send({ message: err.message });
    });
};
const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItemById,
  likeItem,
  dislikeItem,
};
