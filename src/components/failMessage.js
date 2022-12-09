import React from "react";
import "./failMessage.css"

const FailMessage = (props) => {
  return (
    <div className="fail-message">
      <p>{props.message}, please try again.</p>
    </div>
  );
};

export default FailMessage;
