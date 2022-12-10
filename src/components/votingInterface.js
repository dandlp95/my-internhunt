import React from "react";
import { useState, useEffect } from "react";
// import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import {BiDownvote, BiUpvote} from "react-icons/bi"
import FetchCalls from "../utils/fetchCalls";

const VotingInterface = (props) => {
  const [isUpDisabled, setIsUpDisabled] = useState();
  const [isDownDisabled, setIsDownDisabled] = useState();
  const [vote, setVote] = useState(props.voteCount);
  const [post, setPost] = useState(props.postInfo);
  const [value, setValue] = useState(props.reRenderPost);

  useEffect(() => {
    setValue(props.reRenderPost);
  }, [props.reRenderPost]);

  useEffect(() => {
    const getVotingHistory = async () => {
      const userData = localStorage.getItem("userData");
      const userJWT = JSON.parse(userData).jwt;
      var endpoint;
      if (props.type === "post") {
        endpoint = `/votingHistory/getById/${post._id}`;
      } else if (props.type === "comment") {
        endpoint = `/votingHistory/getById/comment/${post._id}`;
      }

      const caller = new FetchCalls(endpoint, "GET", userJWT);
      const response = await caller.protectedNoBody();
      var lastVote;

      if (response.ok) {
        const votingHistory = await response.json();

        if (votingHistory.lastVote) {
          lastVote = votingHistory.lastVote;
        } else {
          lastVote = 0;
        }
      } else {
        lastVote = 0;
      }

      if (lastVote == 1) {
        setIsUpDisabled(true);
        setIsDownDisabled(false);
      } else if (lastVote == -1) {
        setIsDownDisabled(true);
        setIsUpDisabled(false);
      } else {
        setIsDownDisabled(false);
        setIsUpDisabled(false);
      }
    };

    getVotingHistory();
  }, [post]);

  const handleVote = (userVote) => {
    props.addVoteHandler(userVote);
  };
  return (
    <div className="voting-interface">
      <button
        className="vote-up"
        onClick={(e) => handleVote(1)}
        disabled={isUpDisabled}
      >
        <BiUpvote className="arrow-icon" />
      </button>
      <span className="vote-number">{vote}</span>
      <button
        className="vote-down"
        onClick={(e) => handleVote(-1)}
        disabled={isDownDisabled}
      >
        <BiDownvote className="arrow-icon" />
      </button>
    </div>
  );
};

export default VotingInterface;
