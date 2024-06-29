import React from "react";
import "./TermsOfUsage.css";
import Navbar from "../Navbar/Navbar";

const TermsOfUsage = () => {
  return (
    <>
      <Navbar />
      <div className="tou-container">
        <div className="tou-heading">Terms of Usage</div>
        <div className="tou-content">
          Welcome to The Research AI ("the Platform"). These terms of usage
          govern your use of the Platform. By accessing or using the Platform,
          you agree to abide by these terms. If you do not agree to these terms,
          please refrain from using the Platform.
          <p>
            <b>Acceptance of Terms:</b> By using the Platform, you agree to be
            bound by these terms of usage, as well as any additional terms and
            conditions that may apply to specific features or services offered
            by the Platform.
          </p>
          <p>
            <b>Description of Service:</b> The Platform provides users with the
            ability to search for relevant AI research papers from arXiv by
            keywords, topics, or paper descriptions. Users can then engage in
            interactive question and answer sessions to obtain information from
            the papers.
          </p>
          <p>
            <b>User Accounts:</b> Users may access the Platform directly through
            the URL or via links shared on social media platforms. The Platform
            collects users' names and email addresses for authentication
            purposes. There are no age restrictions for using the Platform.
          </p>
          <p>
            <b>User Conduct:</b> Users are expected to use the Platform solely
            for educational and research purposes. Any misuse of the Platform,
            including submitting irrelevant queries or disrupting the service's
            functionality, is prohibited.
          </p>
          <p>
            <b>Intellectual Property Rights:</b> Users acknowledge and agree
            that any search queries and questions submitted to the Platform
            become the property of the Platform. The Platform reserves the right
            to use such content for improving the service and developing new
            features.
          </p>
          <p>
            <b>Privacy Policy:</b> Users are encouraged to review the Platform's
            privacy policy, which governs the collection, use, and protection of
            user data.
          </p>
          <p>
            <b>Termination:</b> The Platform reserves the right to suspend or
            terminate user accounts for violation of the terms of usage or
            misuse of the service.
          </p>
          <p>
            <b>Disclaimer of Warranties:</b> The Platform provides the service
            "as is" and does not guarantee the accuracy or reliability of the
            information provided. Users use the Platform at their own risk.
          </p>
          <p>
            <b>Limitation of Liability:</b> To the maximum extent permitted by
            law, the Platform shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from the use of
            the service.
          </p>
          <p>
            <b>Indemnity:</b> Users agree to indemnify and hold harmless the
            Platform and its affiliates from any claims or liabilities arising
            from their use of the service.
          </p>
          <p>
            <b>Governing Law and Jurisdiction:</b>
            These terms of usage are governed by the laws of the India. Any
            disputes arising under these terms shall be subject to the exclusive
            jurisdiction of the courts in India.
          </p>
          <p>
            <b>Changes to Terms:</b> The Platform reserves the right to update
            these terms of usage periodically without direct notification to
            users. Continued use of the service constitutes acceptance of the
            updated terms.
          </p>
          <p>
            <b>Contact Information:</b> If you have any questions or concerns
            about these terms of usage, please contact us at{" "}
            <u>support@theresearchai.in</u>.
          </p>
        </div>
        {/* Add more content here as needed */}
      </div>
    </>
  );
};

export default TermsOfUsage;
