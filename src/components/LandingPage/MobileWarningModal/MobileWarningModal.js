import React from "react";
import "./MobileWarningModal.css";

const MobileWarningModal = ({ setDisplayModal }) => {
  return (
    <div class="modal-dialog modal-dialog-centered mobile-warning-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Device Not Compatible</h5>
        </div>
        <div class="modal-body">
          <p>
            Currently, our website is not optimized for mobile devices. At this
            time, it functions only on desktops or tablets (in landscape mode).
            We encourage you to visit our site on a supported device for the
            best experience.
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary close-modal-btn"
            onClick={() => setDisplayModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileWarningModal;
