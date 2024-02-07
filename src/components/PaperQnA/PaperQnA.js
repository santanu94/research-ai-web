// PaperComponent.js
import React from "react";
import "./PaperQnA.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ChatComponent from "./ChatComponent/ChatComponent";
import PDFViewer from "./PDFViewer/PDFViewer";
import { IoChevronBackOutline } from "react-icons/io5";

const PaperQnA = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pdfUrl = `https://arxiv.org/pdf/${id}.pdf`;

  return (
    <div>
      <div>
        <div className="d-flex align-items-center back-to-dash">
          <button
            className="d-flex border border-0 bg-transparent back-button"
            onClick={() => navigate(-1)}
          >
            <IoChevronBackOutline />
            <span className="text">Back to Dashboard</span>
          </button>{" "}
        </div>
      </div>
      <div className="paper-layout">
        <div className="pdf-view">
          <PDFViewer url={pdfUrl} />
        </div>
        <div className="chatroom">
          <ChatComponent paper_id={id} />
        </div>
      </div>
    </div>
  );
};

export default PaperQnA;
