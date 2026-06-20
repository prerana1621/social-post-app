const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

const { createPost, getPosts, likePost, addComment } = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getPosts);

router.post("/", authMiddleware, upload.single("image"), createPost);
router.post(
    "/:id/like",
    authMiddleware,
    likePost
);
  
router.post("/:id/comment", authMiddleware, addComment);

module.exports = router;
