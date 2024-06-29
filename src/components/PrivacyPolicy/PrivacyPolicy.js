import React from "react";
import "./PrivacyPolicy.css";
import Navbar from "../Navbar/Navbar";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="privacy-policy-container">
        <div className="privacy-policy-heading">Privacy Policy</div>
        <div className="tou-content">
          At The Research AI, we are committed to protecting the privacy and
          security of our users' personal information. This privacy policy
          outlines how we collect, use, share, and protect the information
          collected from users when they use our service. By using our service,
          you consent to the collection and use of your information as described
          in this policy.
          <p>
            <b>Information Collected:</b> We collect the following types of
            information from users: Name Email address Search queries Questions
            asked during interactive question and answer sessions Answers
            provided during interactive question and answer sessions
            Additionally, please note that when users authenticate through our
            third-party authentication service, Kinde authenticator, they may
            also collect certain information during the login process. We
            encourage users to review the privacy policy of Kinde authenticator
            for more information about their data collection practices. This
            information is collected directly from users when they interact with
            our service.
          </p>
          <p>
            <b>Use of Information:</b> The personal information collected,
            including name and email address, is used to maintain a record of
            our user base and to communicate with users regarding updates, news,
            and important information related to the service. Search queries,
            questions, and answers provided during interactive question and
            answer sessions are used to improve the functionality and user
            experience of the platform. We do not associate specific queries or
            questions with individual users, as our focus is on enhancing the
            overall service rather than tracking individual user activities.
          </p>
          <p>
            <b>Data Sharing:</b> We do not share any user information collected
            by our platform with third parties, except for the third-party
            authentication service used for user login purposes. All data
            generated and collected by our platform belongs solely to us, and we
            do not intend to share it with any other third party.
          </p>
          <p>
            <b>Data Security:</b> We take reasonable measures to protect user
            information from unauthorized access or disclosure. Access to our
            database is restricted to authorized personnel who are directly
            involved in the operation and maintenance of the platform. While we
            do not implement additional security measures at this time, we
            continuously monitor our systems and processes to ensure the
            security of user data.
          </p>
          <p>
            <b>User Choices and Controls:</b> Users have the option to request
            the removal of their personal information, including their name and
            email address, from our records. However, please note that search
            queries, questions asked, and answers received during interactive
            question and answer sessions are considered the property of the
            company and cannot be removed upon user request. To request the
            removal of personal information, users may email us at{" "}
            <u>support@theresearchai.in</u>. We will make reasonable efforts to
            fulfill such requests in a timely manner.
          </p>
          <p>
            <b>Cookies and Tracking Technologies:</b> We use cookies to enhance
            the user experience and provide convenience by keeping users logged
            in to our platform. This eliminates the need for users to log in
            every time they access the platform. Additionally, we use anonymous
            identifiers to track user activity within the platform. This helps
            us understand user behavior and improve the functionality and
            usability of the platform. Users can manage their cookie preferences
            through their web browser settings. However, please note that
            disabling cookies may affect certain features and functionality of
            the platform.
          </p>
          <p>
            <b>Changes to the Privacy Policy:</b> We reserve the right to update
            or modify this privacy policy at any time without prior notice.
            Users are encouraged to review this privacy policy periodically for
            any changes. Continued use of the platform constitutes acceptance of
            the updated privacy policy.
          </p>
          <p>
            <b>Contact Information:</b> If you have any questions or concerns
            about our privacy policy, please feel free to contact us via email
            at <u>support@theresearchai.in</u>.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
