import React, { createContext, useContext, useRef, useEffect } from 'react';
import consumer from '../components/utils/Cable'; // Adjust path as needed
import { useAuth } from './AuthContext';
import axios from 'axios';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children, setMessages }) => {
  const subscriptionRef = useRef(null);
  const { token } = useAuth();

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/messages", { withCredentials: true });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  useEffect(() => {
    if (!token) return;

    const createSubscription = () => {
      if (!subscriptionRef.current) {
        console.log("Creating persistent subscription...");
        subscriptionRef.current = consumer.subscriptions.create(
          { channel: "ChatChannel", token },
          {
            connected() {
              console.log("Connected to ChatChannel");
            },
            disconnected() {
              console.log("Disconnected from ChatChannel");
            },
            received(data) {
              console.log("Received data:", data);
              // Here we update the messages state in the parent (Messages component)
              if (setMessages) {
                fetchMessages()
                setMessages(prevMessages => [...prevMessages, data]);
              }
            },
          }
        );
      }
    };

    // Create the subscription when token changes
    createSubscription();

    return () => {
      if (subscriptionRef.current) {
        console.log("Cleaning up subscription...");
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [token, setMessages]);

  return (
    <WebSocketContext.Provider value={{ token, subscriptionRef }}>
      {children}
    </WebSocketContext.Provider>
  );
};
