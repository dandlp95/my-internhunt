import React from "react";
import "./failMessage.css"

const FailMessage = (props) => {
  return (
    <div className="fail-message">
      <p>{props.message}</p>
    </div>
  );
};

export default FailMessage;
