const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    likes: [
      {
        userId: String,
        username: String,
      },
    ],

    comments: [
      {
        userId: String,
        username: String,
        text: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Post", postSchema);
