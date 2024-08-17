import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography, Box } from "@mui/material";

const AdminChat = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server as Admin");
    });

    socket.on("receive-message", ({ message, sender }) => {
      setChat((prevChat) => [...prevChat, { message, sender }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      socket.emit("send-message", { message, sender: "Admin" });
      setMessage("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        Admin Chat Interface
      </Typography>
      <Box mt={4} mb={2}>
        {chat.map((chatMsg, index) => (
          <Typography key={index}>
            <strong>{chatMsg.sender}: </strong> {chatMsg.message}
          </Typography>
        ))}
      </Box>
      <form onSubmit={sendMessage}>
        <TextField
          fullWidth
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Container>
  );
};

export default AdminChat;
