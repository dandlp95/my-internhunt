import React from "react";
import PasswordInput from "./passwordInput";

const ChangePassword = (props) => {
  return (
    <div className="password-ui-container">
      <div className="password-header">
        <h2>Change Password</h2>
        <hr />
      </div>
      <div className="passwords-inputs">
        <input
          type="text"
          placeholder="Enter your old password"
          onChange={(e) => props.getOldPassword(e.target.value)}
          className="old-password-input"
        />
        <PasswordInput passwordChange={props.sendRequest} />
      </div>
    </div>
  );
};

export default ChangePassword;
