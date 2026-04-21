//models/user.js
const moongoose = require("mongoose");
const validator = require("validator");

const userSchema = new moongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "The Avatar URL is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

const User = moongoose.model("user", userSchema);
module.exports = User;
