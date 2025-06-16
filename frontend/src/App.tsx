import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import NflPassingLeaders from "./components/NflPassingLeaders";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              StatScout
            </Typography>
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "20px",
              }}>
              Home
            </Link>
            <Link
              to="/nfl/passing-leaders"
              style={{ color: "white", textDecoration: "none" }}>
              NFL Passing Leaders
            </Link>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/" element={<div>Welcome to StatScout</div>} />
            <Route
              path="/nfl/passing-leaders"
              element={<NflPassingLeaders />}
            />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
