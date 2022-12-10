import React from "react";
import "./empty.css";
import { GiSittingDog } from "react-icons/gi";

const Empty = (props) => {
  return (
    <div
      className="empty-main"
      id={props.size === "small" ? "small-size" : " "}
    >
      <div>
        <GiSittingDog className="dog-icon" />
        <div className="empty-message">
          <div>Wow, it's really empty here!</div>
        </div>
      </div>
    </div>
  );
};

export default Empty;
