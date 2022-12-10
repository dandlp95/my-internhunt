import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchCalls from "../utils/fetchCalls";
import Header from "../components/header";
import "./forgotPassword.css";
import { Navigate } from "react-router-dom";

const InstructionsSuccess = (props) => {
  return <div className="resetPasswordInstructions">{props.message}</div>;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [displayInstructions, setDisplayInstructions] = useState(false);
  const [instructionsMessage, setInstructionsMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestPasswordReset = async () => {
    const backendCaller = new FetchCalls(
      "/users/request-password-reset",
      "PATCH",
      null,
      { email: email }
    );
    try {
      const response = await backendCaller.publicBody();
      if (response.ok) {
        setInstructionsMessage(
          `An email with instructions on how to reset your password has been sent.
        If you don't receive it within 5 minutes, please submit the request again.`
        );
      } else if (response.status === 404) {
        setInstructionsMessage("Email not found.");
      } else {
        const backendErr = await response.json();
        setInstructionsMessage(backendErr.message);
      }
      setDisplayInstructions(true);
    } catch (err) {
      alert("Error processing your request. Please try again later.");
      navigate("/");
    }
  };

  return (
    <div className="password-reset-main">
      <Header />
      <div class="spacer">&nbsp;</div>
      <div className="password-reset-container">
        <div>
          <h2>Reset Password</h2>
          <hr />
        </div>
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              required
              placeholder="Enter your email account"
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <button onClick={(e) => handleRequestPasswordReset()}>
                Send Code
              </button>
            </div>
          </form>
        </div>
        <div>
          {displayInstructions && (
            <InstructionsSuccess message={instructionsMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
