import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import MessageList from "../utils/MessageList";
import { useWebSocket } from "../../context/WebSocketContext"; // Import the hook here
import { WebSocketProvider } from "../../context/WebSocketContext"; // Import the WebSocketProvider
import { useAuth } from "../../context/AuthContext";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const { token, subscriptionRef } = useWebSocket(); // Use the hook here to access the WebSocket context
  const { user } = useAuth()


    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/messages", { withCredentials: true });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

  const sendMessage = (message) => {
    if (subscriptionRef.current) {
      console.log("Sending message:", message);
      subscriptionRef.current.perform("speak", { content: message, manager_id: user?.user.id, created_at: new Date()  });
      fetchMessages()
    } else {
      console.error("WebSocket is not connected or subscription is invalid. Unable to send message.");
    }
  };


  useEffect(() => {
    // Optional: log something or perform actions when the component mounts or updates
    console.log("Messages component mounted");
    fetchMessages()

    return () => {
      // Optional: cleanup logic when Messages component unmounts
      console.log("Messages component unmounted");
    };
  }, []);

  return (
    <Box>
      {/* Wrap WebSocketProvider and pass setMessages to it */}
      <WebSocketProvider setMessages={setMessages}>
        <MessageList messages={messages} onSend={sendMessage} />
      </WebSocketProvider>
    </Box>
  );
};

export default Messages;
