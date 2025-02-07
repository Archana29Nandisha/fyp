import React from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const LandingPage = () => {
  return (
    <>
      {/* Header Section */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Review Analyser
          </Typography>
          <Button color="inherit" href="/login">
            Login
          </Button>
          <Button color="inherit" href="/register">
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #2196f3, #21cbf3)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome to Review Analyser
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Simplifying workflows and enhancing productivity for a better future.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ px: 4, py: 2 }}
          href="/register"
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} id="features">
        <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x140"
                alt="Feature 1"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  Feature 1
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Brief description of Feature 1. Explain its benefits and how
                  it adds value.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x140"
                alt="Feature 2"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  Feature 2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Brief description of Feature 2. Explain its benefits and how
                  it adds value.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x140"
                alt="Feature 3"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  Feature 3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Brief description of Feature 3. Explain its benefits and how
                  it adds value.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          py: 4,
          backgroundColor: "#1976d2",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Archana All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default LandingPage;
