import React from "react";
import { useState, useEffect } from "react";

const FailMessage = (props) => {
  return (
    <div className="fail-message">
      <p>Failed to {props.action}, please try again.</p>
    </div>
  );
};

export default FailMessage;
