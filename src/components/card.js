import React, { useState, useEffect } from "react";
import "./card.css";
import placeholderImg from "../assets/placeholder_image.jpg";
import FetchCalls from "../utils/fetchCalls";

const Card = (props) => {
  const [majorImg, setMajorImg] = useState();

  const fetchMajorImg = async () => {
    console.log(props.major._id)
    const apiCaller = new FetchCalls(
      `/majorimages/getbymajor/${props.major._id}`,
      "GET"
    );
    const response = await apiCaller.publicGet();
    if (response.ok) {
      const data = await response.json();
      console.log("fetchedimg: ", data)
      setMajorImg(data);
    } else {
      console.log(response);
    }
  };

  useEffect(() => {
    fetchMajorImg();
  }, []);

  return (
    <div className="card-main">
      <div className="content-container">
        <div className="img-title-container">
          <div className="img-container">
            <img
              alt={majorImg ? majorImg.alt : "loading img"}
              src={majorImg ? majorImg.img : placeholderImg}
              width="100%"
            />
          </div>
          <div className="title-container">
            <h2>{props.major.name}</h2>
          </div>
        </div>
        <div className="major-description">
          <p>{props.major.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
