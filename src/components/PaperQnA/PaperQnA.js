// PaperComponent.js
import React from "react";
import "./PaperQnA.css";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import ChatComponent from "./ChatComponent/ChatComponent";
import PDFViewer from "./PDFViewer/PDFViewer";
import { IoChevronBackOutline } from "react-icons/io5";
import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

const PaperQnA = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  var { searchId, pdfUrl } = location.state || {};

  mixpanel.track_pageview({ page: "QnA Page" });
  console.log(searchId);

  // format pdf url
  // pdfUrl = pdfUrl.startsWith("http://")
  //   ? pdfUrl.replace("http://", "https://")
  //   : pdfUrl;
  // pdfUrl = !pdfUrl.endsWith(".pdf") ? `${pdfUrl}.pdf` : pdfUrl;
  pdfUrl = pdfUrl.endsWith(".pdf") ? pdfUrl.slice(0, -4) : pdfUrl;
  const paper_id = pdfUrl.split("/").pop();
  pdfUrl = `https://arxiv.org/pdf/${paper_id}`;
  // const pdfUrl = `https://arxiv.org/pdf/${id}.pdf`;

  const backToDashboard = () => {
    posthog.capture("clicked_back_to_dashboard_from_chat", {
      search_id: searchId,
    });
    mixpanel.track("Clicked on Back to Dashboard");
    navigate(-1);
  };

  return (
    <div>
      <div>
        <div className="d-flex align-items-center back-to-dash">
          <button
            className="d-flex border border-0 bg-transparent back-button"
            onClick={backToDashboard}
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
          <ChatComponent paperId={id} searchId={searchId} />
        </div>
      </div>
    </div>
  );
};

export default PaperQnA;
