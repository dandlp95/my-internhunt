import React from "react";
import { FaRegSadTear } from "react-icons/fa";
import "./serverDown.css";

const ServerDown = () => {
  return (
    <div className="server-down">
      <section>
        <div className="server-down-text">
          <FaRegSadTear className="sad-face" />
          <h2>Our servers are currently down</h2>
          <p>We are working to fix things. Thank you for your patience.</p>
        </div>
      </section>
    </div>
  );
};

export default ServerDown;
