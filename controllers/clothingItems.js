// controllers/clothingItems.js
const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../middlewares/errors/BadRequestError");
const NotFoundError = require("../middlewares/errors/NotFoundError");
const ForbiddenError = require("../middlewares/errors/ForbiddenError");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data."));
      }
      return next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return next(
          new ForbiddenError("You are not allowed to delete this item")
        );
      }
      return item.deleteOne().then(() => res.status(200).send(item));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
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
        return next(new BadRequestError("Invalid item ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
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
        return next(new BadRequestError("Invalid item ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found"));
      }
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
