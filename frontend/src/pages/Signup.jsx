import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import api from "../services/api";
function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        password,
      });
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    }
  };
  return (
    <Container maxWidth="sm">
      <Paper
        elevation={4}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Create Account
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Join the social platform
        </Typography>

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        <Box
          sx={{
            mt: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">Already have an account?</Typography>

          <Button onClick={() => navigate("/")}>Login</Button>
        </Box>
      </Paper>
    </Container>
  );
}
export default Signup;
