import { useState } from "react";
import React from "react";

const InputInterface = (props) => {
  const [input, setInput] = useState("");

  const sendData = () => {
    if (input) {
      const data = input;
      setInput("");
      props.action(data);
    }
  };

  return (
    <div className="input-interface-main">
      <div className="comment-input">
        <textarea
          placeholder={props.placeholder}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button disabled={!input} onClick={(e) => sendData()}>
        {props.buttonText}
      </button>
    </div>
  );
};

export default InputInterface;
