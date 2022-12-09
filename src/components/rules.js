import React from "react";
import { Link } from "react-router-dom";
import i from "../assets/i.png"
import "./rules.css"

const Rules = () => {
    return (
      <div className="rules">
        <section>
          <div className="section-header">
            <div>
              <img src={i} alt="logo" width="25px" />
            </div>
            <div>
              <h3>Posting to Internhunt</h3>
            </div>
          </div>
          <p>1. Questions must be clear and open ended</p>
          <hr className="line" />
  
          <p>2. Behave like you would in real life</p>
          <hr className="line" />
  
          <p>3. Search if your question has already been asked</p>
          <hr className="line" />
  
          <p>4. Keep your reviews as objective and specific as possible</p>
          <hr className="line" />
  
          <p>5. No sales or self-promotion</p>
          <hr className="line" />
        </section>
        <div className="guidelines-reference">
          <p>
            Please be mindful of Internhunt's{" "}
            <Link to="/guidelines">Community Guidelines</Link>
          </p>
        </div>
      </div>
    );
  };

  export default Rules;