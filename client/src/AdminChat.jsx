import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  styled,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MessageContainer = styled(Paper)(({ theme }) => ({
  height: "60vh",
  overflowY: "auto",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const MessageBubble = styled(Paper)(({ theme, isAdmin }) => ({
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  maxWidth: "70%",
  alignSelf: isAdmin ? "flex-end" : "flex-start",
  backgroundColor: isAdmin
    ? theme.palette.primary.light
    : theme.palette.secondary.light,
  color: isAdmin
    ? theme.palette.primary.contrastText
    : theme.palette.secondary.contrastText,
  borderRadius: isAdmin ? "20px 20px 0 20px" : "20px 20px 20px 0",
}));

const AdminChat = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server as Admin");
    });

    socket.on("receive-message", ({ message, sender, timestamp }) => {
      setChat((prevChat) => [...prevChat, { message, sender, timestamp }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const timestamp = new Date().toISOString();
      socket.emit("send-message", { message, sender: "Admin", timestamp });
      setMessage("");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="div" gutterBottom align="center">
        Admin Chat Interface
      </Typography>
      <MessageContainer elevation={3}>
        <List>
          {chat.map((chatMsg, index) => (
            <React.Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  flexDirection:
                    chatMsg.sender === "Admin" ? "row-reverse" : "row",
                }}
              >
                <MessageBubble
                  isAdmin={chatMsg.sender === "Admin"}
                  elevation={1}
                >
                  <ListItemText
                    primary={`${chatMsg.sender}: ${chatMsg.message}`}
                    secondary={new Date(chatMsg.timestamp).toLocaleTimeString()}
                  />
                </MessageBubble>
              </ListItem>
              {index < chat.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </MessageContainer>
      <Box
        component="form"
        onSubmit={sendMessage}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <TextField
          fullWidth
          label="Type a message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
          sx={{ mr: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default AdminChat;
