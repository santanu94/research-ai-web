import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./ChatComponent.css";
import { IoSend, IoReload, IoThumbsUpOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { LuThumbsUp, LuThumbsDown } from "react-icons/lu";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "react-bootstrap/ProgressBar";
import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

const socket = io(process.env.REACT_APP_CHAT_DOMAIN, {
  path: process.env.REACT_APP_CHAT_PATH,
  autoConnect: false,
  reconnectionDelay: 3000,
  reconnectionAttempts: 5,
});

const ChatComponent = ({
  paperId,
  paperTitle,
  paperPublishedDate,
  paperUrl,
  pageNumber,
  searchId,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPreprocessing, setIsPreprocessing] = useState(true);
  const [preprocessingError, setPreprocessingError] = useState(false);
  const [preprocessingProgress, setPreprocessingProgress] = useState(0);
  const [preprocessingTotal, setPreprocessingTotal] = useState(100);
  const [samplePaperQuestions, setSamplePaperQuestions] = useState([]);
  const [processCompleted, setProcessCompleted] = useState(false);
  const [socketioIsConnected, setSocketioIsConnected] = useState(
    socket.connected
  );
  const [socketioReconnecting, setSocketioReconnecting] = useState(true);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  let inactivityTimer;

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to perprocessing socket instance");
      socket.emit("preprocess", {
        paper_id: paperId,
        paper_title: paperTitle,
        paper_published_date: paperPublishedDate,
        paper_url: paperUrl,
      });
      setIsPreprocessing(true);
    });

    socket.on("preprocessStatus", (data) => {
      console.log("Preprocess Status:", data);
      if (data.status === "complete") {
        console.log("Preprocess completed successfully");
        setProcessCompleted(true);
        // socket.off("preprocessStatus");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("preprocessStatus");
        socket.disconnect();
        // socket.off("preprocessStatus");
        // setIsPreprocessing(false);
        setPreprocessingProgress(data.progress);
        setPreprocessingTotal(data.total);
      } else if (data.status === "error") {
        setIsPreprocessing(false);
        setPreprocessingError(true);
      } else if (data.progress) {
        setPreprocessingProgress(data.progress);
        setPreprocessingTotal(data.total);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from perprocessing socket instance");
      setIsPreprocessing(false);
      socket.disconnect();
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("preprocessStatus");
      socket.disconnect();
    };
  }, [paperId]);

  useEffect(() => {
    if (processCompleted) {
      fetch(
        `${process.env.REACT_APP_CHAT_DOMAIN}${process.env.REACT_APP_PAPER_SAMPLE_QUESTIONS_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paper_id: paperId }),
        }
      )
        .then(async (response) => {
          if (response.status === 200) {
            const responseJson = await response.json();
            setSamplePaperQuestions(responseJson["paper_questions"]);
            setupSocketListeners();
            socket.connect();
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
    }
  }, [processCompleted]);

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
        {/* <div
          className="spinner spinner-grow spinner-dimension"
          role="status"
        ></div> */}
        <div className="loading-text">Loading...</div>
        {/* <div className="fw-lighter desc-text">We're processing the paper</div> */}

        <div className="progress-container">
          <ProgressBar
            now={Math.floor((preprocessingProgress / preprocessingTotal) * 100)}
            active="true"
          />
        </div>
        <div className="fw-lighter desc-text">
          (Papers with more pages can take longer)
        </div>
        {/* <div className="">
          {Math.floor((preprocessingProgress / preprocessingTotal) * 100)} %
        </div>
        <div>
          {preprocessingProgress} / {preprocessingTotal}
        </div> */}
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

  const handleSendMessage = async (message = newMessage) => {
    if (message.trim() !== "") {
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
        message: message.trim(),
        current_page_number: pageNumber,
        paper_id: paperId,
        conversation_id: conversationId,
        search_id: searchId,
      });
      // Assume the message is sent successfully and add it to messages
      setMessages([
        ...messages,
        {
          type: "user-message",
          text: message,
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

  // const parseModelResponse = (modelResponse) => {
  //   // Function to parse and format bold text within a line
  //   const parseBoldText = (text) => {
  //     const regex = /\*\*(.*?)\*\*/g;
  //     const parts = [];
  //     let lastIdx = 0;
  //     text.replace(regex, (match, p1, offset) => {
  //       // Push text before the bold part
  //       parts.push(text.substring(lastIdx, offset));
  //       // Push the bold part, wrapped in a <strong> tag
  //       parts.push(<strong key={offset}>{p1}</strong>);
  //       // Update the last index to the end of the current match
  //       lastIdx = offset + match.length;
  //     });
  //     // Add any remaining text after the last match
  //     parts.push(text.substring(lastIdx));
  //     return parts;
  //   };
  //   return modelResponse.split("\n").map((line, index) => (
  //     <React.Fragment key={index}>
  //       {parseBoldText(line)}
  //       <br />
  //     </React.Fragment>
  //   ));
  // };

  // const prepareForLatex = (content) => {
  //   // const latexCommandRegex = /(?<!\\)\\([a-zA-Z]+)/g;
  //   const latexCommandRegex = /(?<!\\)(\\([a-zA-Z]+|\(|\)|\[|\]))/g;
  //   return content.replace(latexCommandRegex, "\\\\$1");
  // };

  const preprocessLaTeX = (content) => {
    // const latexCommandRegex = /(?<!\\)\\([a-zA-Z]+)/g;

    // // This will replace single backslashes in LaTeX commands with double backslashes.
    // content = content.replace(latexCommandRegex, "\\\\$1");
    // console.log(content);

    // Replace block-level LaTeX delimiters \[ \] with $$ $$

    const blockProcessedContent = content.replace(
      /\\\[(.*?)\\\]/gs,
      (_, equation) => `$$${equation}$$`
    );
    // Replace inline LaTeX delimiters \( \) with $ $
    const inlineProcessedContent = blockProcessedContent.replace(
      /\\\((.*?)\\\)/gs,
      (_, equation) => `$${equation}$`
    );
    return inlineProcessedContent;
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
              <div className={`message ${msg.type}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {preprocessLaTeX(msg.text)}
                </ReactMarkdown>
              </div>
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
      <div className="position-static bottom-0">
        <div className="sample-questions-container">
          <div className="sample-questions">
            {samplePaperQuestions.map((question, index) => (
              <button
                key={index}
                className="sample-question"
                onClick={() => handleSendMessage(question)} // Sets the question into the input field
              >
                {question}
              </button>
            ))}
          </div>
        </div>
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
    </div>
  );
};

export default ChatComponent;
