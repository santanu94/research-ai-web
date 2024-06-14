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

const ChatComponent = ({ paperId, searchId }) => {
  // const [messages, setMessages] = useState([
  //   {
  //     type: "assistant-message",
  //     // text: "The block size for computation is set as ($ B_c = leftlfloor \frac{M}{4d} \right\rfloor $) and ( B_r = minleft(leftlfloor \frac{M}{4d} \right\rfloor, d\right) ).",
  //     text: `The lift coefficient ($C_L$) is a dimensionless coefficient.`,
  //     // text: `The algorithm described on page 5 is FlashAttention, which is designed to compute the attention mechanism in a memory-efficient and fast manner by leveraging on-chip SRAM and reducing the number of accesses to high bandwidth memory (HBM). Here is a step-by-step explanation of the algorithm: 1. **Initialization**: - Set block sizes for computation: ($B_c = left\lfloor frac{M}{4d} right\rfloor$) and \( B_r = \min\left(\left\lfloor \frac{M}{4d} \right\rfloor, d\right) \). - Initialize matrices \( O \), \( \ell \), and \( m \) in HBM. 2. **Divide Matrices into Blocks**: - Divide \( Q \) into \( T_r = \left\lceil \frac{N}{B_r} \right\rceil \) blocks \( Q_1, \ldots, Q_{T_r} \) of size \( B_r \times d \). - Divide \( K \) and \( V \) into \( T_c = \left\lceil \frac{N}{B_c} \right\rceil \) blocks \( K_1, \ldots, K_{T_c} \) and \( V_1, \ldots, V_{T_c} \) of size \( B_c \times d \). - Similarly, divide \( O \), \( \ell \), and \( m \) into \( T_r \) blocks. 3. **Main Computation Loop**: - For each block \( K_j \) and \( V_j \): - Load \( K_j \) and \( V_j \) from HBM to on-chip SRAM. - For each block \( Q_i \): - Load \( Q_i \), \( O_i \), \( \ell_i \), and \( m_i \) from HBM to on-chip SRAM. - Compute the intermediate matrix \( S_{ij} = Q_i K_j^T \) on-chip. - Compute row-wise maximum \( \tilde{m}_{ij} = \text{rowmax}(S_{ij}) \) and exponentiated matrix \( \tilde{P}_{ij} = \exp(S_{ij} - \tilde{m}_{ij}) \). - Compute row-wise sum \( \tilde{\ell}_{ij} = \text{rowsum}(\tilde{P}_{ij}) \). - Update \( m_i \) and \( \ell_i \) with new values \( m_{\text{new}} \) and \( \ell_{\text{new}} \). - Write the updated \( O_i \) back to HBM. - Write the updated \( \ell_i \) and \( m_i \) back to HBM. 4. **Return the Result**: - Return the final output matrix \( O \). Key Points: - The algorithm uses tiling to handle large matrices by breaking them into smaller blocks that fit into on-chip SRAM. - It keeps track of extra statistics (\( m \) and \( \ell \)) to compute the softmax in a block-wise manner. - The approach reduces the number of HBM accesses, making the computation more efficient. Source: Page 5 of the document.`,
  //     conversationId: "123",
  //   },
  // ]);
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
      socket.emit("preprocess", { paper_id: paperId });
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

  const parseModelResponse = (modelResponse) => {
    // Function to parse and format bold text within a line
    const parseBoldText = (text) => {
      const regex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIdx = 0;
      text.replace(regex, (match, p1, offset) => {
        // Push text before the bold part
        parts.push(text.substring(lastIdx, offset));
        // Push the bold part, wrapped in a <strong> tag
        parts.push(<strong key={offset}>{p1}</strong>);
        // Update the last index to the end of the current match
        lastIdx = offset + match.length;
      });
      // Add any remaining text after the last match
      parts.push(text.substring(lastIdx));
      return parts;
    };
    return modelResponse.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {parseBoldText(line)}
        <br />
      </React.Fragment>
    ));
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
                  {msg.text}
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
