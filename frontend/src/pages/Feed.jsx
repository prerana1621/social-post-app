import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
function Feed() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(false);
  const [likingPost, setLikingPost] = useState(null);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef(null);
  const handleCreatePost = async () => {
    try {
      if (!text.trim() && !image) {
        alert("Please enter text or upload an image.");
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("text", text);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setText("");
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchPosts();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      setLikingPost(postId);

      const token = localStorage.getItem("token");

      await api.post(
        `/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchPosts();
    } catch (error) {
      console.log(error);
    } finally {
      setLikingPost(null);
    }
  };

  const handleComment = async (postId) => {
    try {
      if (!commentText[postId]?.trim()) {
        return;
      }

      const token = localStorage.getItem("token");

      await api.post(
        `/posts/${postId}/comment`,
        {
          text: commentText[postId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCommentText({
        ...commentText,
        [postId]: "",
      });

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      setFetching(true);

      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRemoveImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (fetching) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography>Loading posts...</Typography>
      </Container>
    );
  }
  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 5,
        mb: 5,
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          mb: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
            }}
          >
            Social Feed
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            Share your thoughts with everyone.
          </Typography>
        </Box>

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6">Create Post</Typography>

          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button variant="outlined" component="label" sx={{ mr: 2 }}>
              Upload Image
              <input
                hidden
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Button>

            {image && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#f5f5f5",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontStyle: "italic",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {image.name}
                </Typography>

                <IconButton
                  size="small"
                  color="error"
                  onClick={handleRemoveImage}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleCreatePost}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {posts.map((post) => (
        <Card
          key={post._id}
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: 2,
            overflow: "hidden",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              @{post.username}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.8rem",
                mb: 3,
              }}
            >
              {new Date(post.createdAt).toLocaleString()}
            </Typography>

            <Typography
              sx={{
                mb: 3,
                fontSize: "1.2rem",
                fontWeight: 500,
                lineHeight: 1.7,
              }}
            >
              {post.text}
            </Typography>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={`${post.username}'s post`}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginTop: "15px",
                }}
              />
            )}

            <Box
              sx={{
                display: "flex",
                gap: 4,
                mt: 3,
                mb: 3,
              }}
            >
              <Typography>❤️ {post.likeCount} Likes</Typography>

              <Typography>💬 {post.commentCount} Comments</Typography>
            </Box>
            <div>
              {post.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    p: 1.5,
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>{comment.username}</strong>: {comment.text}
                  </Typography>
                </Box>
              ))}
            </div>

            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              disabled={likingPost === post._id}
              onClick={() => handleLike(post._id)}
            >
              {likingPost === post._id ? "Liking..." : "❤️ Like"}
            </Button>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment"
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [post._id]: e.target.value,
                  })
                }
              />

              <Button
                variant="contained"
                disabled={!commentText[post._id]?.trim()}
                onClick={() => handleComment(post._id)}
              >
                Comment
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default Feed;
