import React, { useState } from "react";
import "./passwordInput.css"

const PasswordInput = (props) => {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  return (
    <div className="password-input-main">
      <div className="new-password-container">
        <input
          type="password"
          placeholder="Enter your new password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your new password again"
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
        />
      </div>
      <div className="buttons">
        <button
          onClick={(e) => props.passwordChange(newPassword, newPasswordConfirm)}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
