const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res) => {
  try {
    const text = req.body?.text || "";
      
      let imageUrl = "";

    
      if (req.file) {
          imageUrl = `/uploads/${req.file.filename}`;
      }
      
      if (text.trim() === "" && !req.file) {
        return res.status(400).json({
          message: "Text or image is required",
        });
      }

    const user = await User.findById(req.user.userId);

    const newPost = new Post({
      userId: user._id,
      username: user.username,
      text,
      imageUrl,
    });
      
    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      username: post.username,
      text: post.text,
      imageUrl: post.imageUrl,
      likes: post.likes,
      comments: post.comments,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      createdAt: post.createdAt,
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user.userId);

    const alreadyLiked = post.likes.find(
      (like) => like.userId.toString() === req.user.userId,
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.userId.toString() !== req.user.userId,
      );

      await post.save();

      return res.status(200).json({
        message: "Post unliked",
        totalLikes: post.likes.length,
      });
    }

    post.likes.push({
      userId: user._id,
      username: user.username,
    });

    await post.save();

    res.status(200).json({
      message: "Post liked",
      totalLikes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user.userId);

    post.comments.push({
      userId: user._id,
      username: user.username,
      text,
    });

    await post.save();

    res.status(200).json({
      message: "Comment added",
      totalComments: post.comments.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
    likePost,
  addComment,
};
