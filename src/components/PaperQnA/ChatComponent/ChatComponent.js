import React, { useState, useEffect } from "react";
import "./ChatComponent.css";
import { IoSend, IoReload, IoThumbsUpOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { LuThumbsUp, LuThumbsDown } from "react-icons/lu";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

const socket = io(process.env.REACT_APP_CHAT_DOMAIN, {
  path: process.env.REACT_APP_CHAT_PATH,
  autoConnect: false,
  reconnectionDelay: 3000,
  reconnectionAttempts: 5,
});

const ChatComponent = ({ paperId, searchId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPreprocessing, setIsPreprocessing] = useState(true);
  const [preprocessingError, setPreprocessingError] = useState(false);
  const [socketioIsConnected, setSocketioIsConnected] = useState(
    socket.connected
  );
  const [socketioReconnecting, setSocketioReconnecting] = useState(true);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  let inactivityTimer;

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_CHAT_DOMAIN}${process.env.REACT_APP_PAPER_PREPROCESS_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paper_id: paperId }),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          socket.connect();
          setupSocketListeners();
          setIsPreprocessing(false);
        } else {
          setIsPreprocessing(false);
          setPreprocessingError(true);
        }
      })
      .catch(() => {
        setIsPreprocessing(false);
        setPreprocessingError(true);
      });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receiveQueryResponse");
      socket.disconnect();
      clearTimeout(inactivityTimer);
    };
  }, []);

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      socket.disconnect();
      setSocketioIsConnected(false);
    }, 1.8e6); // (900000) 15 minutes in milliseconds
  };

  const handleReconnectChat = () => {
    socket.connect();
    // setSocketioIsConnected(true);
    // resetInactivityTimer(); // Reset inactivity timer on reconnect
  };

  const setupSocketListeners = () => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      resetInactivityTimer(); // reset inactivity timer after socketio connection
      setSocketioIsConnected(true);
      setSocketioReconnecting(false);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setSocketioIsConnected(false);
      setSocketioReconnecting(false);
    });

    socket.io.on("reconnect_attempt", () => {
      console.log("reconnecting");
      setSocketioReconnecting(true);
    });

    socket.io.on("reconnect_failed", () => {
      console.log("reconnect failed");
      setSocketioReconnecting(false);
    });

    socket.on("receiveQueryResponse", (incomingMessage) => {
      console.log(typeof incomingMessage);
      if (incomingMessage.status === 200) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "assistant-message",
            text: incomingMessage.response,
            conversationId: incomingMessage.conversation_id,
          },
        ]);
        setIsAssistantTyping(false);
      } else {
        // Display a toast with the error message
        // npm install react-toastify
        // toast.error(incomingMessage.error);
      }
    });
  };

  if (isPreprocessing) {
    return (
      <div class="d-flex h-100 justify-content-center align-items-center flex-column">
        <div
          className="spinner spinner-grow spinner-dimension"
          role="status"
        ></div>
        <div className="loading-text">Loading...</div>
        <div className="fw-lighter desc-text">We're processing the paper</div>
      </div>
    );
  }

  if (preprocessingError) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center flex-column">
        <MdErrorOutline className="error-icon" />
        <div className="error-text">
          There was an error while preparing the paper
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      // Send message to your API
      const conversationId = uuidv4();

      // log activity
      posthog.capture("send_query_to_agent", {
        search_id: searchId,
        conversation_id: conversationId,
      });
      mixpanel.track("Asked question", {
        search_id: searchId,
        conversation_id: conversationId,
      });

      // send message to server
      socket.emit("sendQuery", {
        message: newMessage,
        paper_id: paperId,
        conversation_id: conversationId,
        search_id: searchId,
      });
      // Assume the message is sent successfully and add it to messages
      setMessages([
        ...messages,
        {
          type: "user-message",
          text: newMessage,
          conversationId: conversationId,
        },
      ]);
      setNewMessage("");
      setIsAssistantTyping(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
    resetInactivityTimer();
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleFeedback = (conversationId, feedback) => {
    // Update local state to show selected feedback
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.conversationId === conversationId ? { ...msg, feedback } : msg
      )
    );

    // Send POST request with feedback
    fetch(
      `${process.env.REACT_APP_CHAT_DOMAIN}${process.env.REACT_APP_FEEDBACK_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation_id: conversationId, feedback }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          // Handle response error
          console.error("Feedback submission failed");
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  };

  return (
    <div className="chat-container">
      {/* Messages display */}
      <div className="messages-display">
        {messages.map((msg, index) => (
          <>
            <div
              key={index}
              className={`d-flex flex-column message-box message-box-${msg.type}`}
            >
              <div className={`message ${msg.type}`}>{msg.text}</div>
              {msg.type === "assistant-message" && (
                <div className="feedback-spacer">
                  <div className="feedback-icons">
                    <LuThumbsUp
                      className={`feedback-icon ${
                        msg.feedback === "thumbs-up" ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleFeedback(msg.conversationId, "thumbs-up")
                      }
                    />
                    <LuThumbsDown
                      className={`feedback-icon ${
                        msg.feedback === "thumbs-down" ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleFeedback(msg.conversationId, "thumbs-down")
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            {/* <div key={index} className={`message ${msg.type}`}>
              {msg.text}
            </div>
            <div>
              {msg.type === "assistant-message" && (
                <div className="feedback-spacer">
                  <div className="feedback-icons">
                    <FaThumbsUp
                      className={`feedback-icon ${
                        msg.feedback === "thumbs-up" ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleFeedback(msg.conversationId, "thumbs-up")
                      }
                    />
                    <FaThumbsDown
                      className={`feedback-icon ${
                        msg.feedback === "thumbs-down" ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleFeedback(msg.conversationId, "thumbs-down")
                      }
                    />
                  </div>
                </div>
              )}
            </div> */}
          </>
        ))}

        {isAssistantTyping && (
          <div className="message assistant-message">
            <div className="typing-indicator">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="input-group py-3 message-input-container">
        <div class="form-floating">
          <textarea
            rows={1}
            class="form-control w-100 message-input"
            id="message-input"
            placeholder="Leave a comment here"
            value={newMessage}
            disabled={isAssistantTyping || !socketioIsConnected}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
          ></textarea>
          <label for="message-input">Type your question here...</label>
        </div>
        {/* <button
          className="btn d-flex align-self-center"
          type="button"
          onClick={handleSendMessage}
        >
          <IoSend />
        </button> */}
        {!socketioIsConnected ? (
          <>
            {socketioReconnecting ? (
              <button className="btn d-flex align-self-center pe-none">
                <div
                  className="btn spinner spinner-grow align-self-center socketio-reconnect-indicator"
                  role="status"
                ></div>
              </button>
            ) : (
              <button
                className="btn d-flex align-self-center"
                onClick={handleReconnectChat}
              >
                <IoReload />
              </button>
            )}
          </>
        ) : (
          <button
            className="btn d-flex align-self-center"
            onClick={handleSendMessage}
          >
            <IoSend />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
