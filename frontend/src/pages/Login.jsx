import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const navigate = useNavigate();
    
    useEffect(() => {
      const token = localStorage.getItem("token");

      if (token) {
        navigate("/feed");
      }
    }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      alert("Login Successful");

      navigate("/feed");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>

        <TextField
          fullWidth
          label="Email"
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
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography sx={{ mt: 2 }}>Don't have an account?</Typography>

        <Button onClick={() => navigate("/signup")}>Sign Up</Button>
      </Paper>
    </Container>
  );
}

export default Login;
