import React, { useState } from "react";
import ReactDOM from "react-dom";
import UserChat from "./UserChat";
import AdminChat from "./AdminChat";
import { Button, Container, Typography, Box } from "@mui/material";

const App = () => {
  const [role, setRole] = useState(""); // State to track the selected role

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        Select Role
      </Typography>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSelectRole("user")}
          style={{ marginRight: "10px" }}
        >
          User
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSelectRole("admin")}
        >
          Admin
        </Button>
      </Box>
      {role === "user" && <UserChat />}
      {role === "admin" && <AdminChat />}
    </Container>
  );
};

export default App;
