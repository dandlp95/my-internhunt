import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import FetchCalls from "../utils/fetchCalls";
import getLocalStorage from "../utils/getLocalStorage";
import VotingInterface from "./votingInterface";
import { timeDifference } from "../utils/timeDifference";

const Comment = (props) => {
  const [commentUser, setCommentUser] = useState("");
  const [isCommentCreator, setIsCommentCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [commentEdit, setCommentEdit] = useState(props.comment.content);
  const [comment, setComment] = useState(props.comment);
  const [voteCount, setVoteCount] = useState(props.comment.rating);
  const [rerenderChild, setRerenderChild] = useState(true);
  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const timeDiff = timeDifference(new Date(), new Date(props.comment.date));

  const route = "comments";

  useEffect(() => {
    const isCommentCreator = async () => {
      const response = await isAuth();
      if (response.ok) {
        const user = await response.json();
        if (comment.owner) {
          if (user._id === comment.owner._id) {
            setIsCommentCreator(true);
          } else {
            setIsCommentCreator(false);
          }
          if (user.accessLevel === 1) {
            setIsAdmin(true);
          }
        } else {
          setIsCommentCreator(false);
        }
      }
    };
    isCommentCreator();

    if (comment.owner) {
      setCommentUser(`${comment.owner.firstName} ${comment.owner.lastName}`);
    } else {
      setCommentUser("[Deleted user]");
      setIsUserDeleted(true);
    }
  }, []);

  const handleEditClick = async () => {
    setEditMode(false);
    const body = {
      content: commentEdit,
    };
    let userData = localStorage.getItem("userData");
    userData = JSON.parse(userData);
    const fetchCall = new FetchCalls(
      `/comments/edit/${comment._id}`,
      "PATCH",
      userData.jwt,
      body
    );
    const response = await fetchCall.protectedBody();
    if (response.ok) {
      const responseJson = await response.json();
      setComment(responseJson);
    } else {
      const backendError = await response.json();
      alert(backendError.message);
    }
  };

  const addVotePost = async (userVote) => {
    var voteReq;
    if (userVote === 1) {
      voteReq = "upvote";
    } else if (userVote === -1) {
      voteReq = "downvote";
    }

    const data = getLocalStorage("userData");
    if (!data) {
      console.log("no local storage data :(");
    } else {
      const caller = new FetchCalls(
        `/comments/vote/${voteReq}/${comment._id}`,
        "PATCH",
        data.jwt,
        { rating: userVote }
      );
      const response = await caller.protectedBody();
      if (response.ok) {
        setVoteCount(voteCount + userVote);
      } else {
        const backendError = await response.json();
        alert(backendError.message);
      }
    }
    setRerenderChild(!rerenderChild);
  };

  const handleDeleteClick = () => {
    props.deleteAction(route, comment._id);
  };

  if (comment) {
    if (!editMode) {
      return (
        <div className="comment-main">
          <div className="flexbox-1">
            <VotingInterface
              voteCount={voteCount}
              addVoteHandler={addVotePost}
              postInfo={comment}
              key={rerenderChild}
              type="comment"
            />
          </div>
          <div className="flexbox-2">
            <div>
              <div className="comment-owner-data">
                {!isUserDeleted ? (
                  <Link to={`/account-portal/${comment.owner._id}`}>
                    {commentUser}
                  </Link>
                ) : (
                  <div>{commentUser}</div>
                )}{" "}
                <span>{timeDiff}</span>
              </div>
              <div className="comment-content-div">
                <p>{comment.content}</p>
              </div>
            </div>

            <div className="comment-edit-delete-div">
              {isCommentCreator && (
                <div className="button-flexbox">
                  <button onClick={() => setEditMode(true)}>Edit</button>
                  <button onClick={() => handleDeleteClick()}>Delete</button>
                </div>
              )}
              {!isCommentCreator && isAdmin && (
                <div className="button-flexbox">
                  <button onClick={(e) => handleDeleteClick()}>Delete</button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="comment-main">
          <div className="flexbox-1">
            <VotingInterface
              voteCount={voteCount}
              addVoteHandler={addVotePost}
              postInfo={comment}
              key={rerenderChild}
            />
          </div>
          <div className="flexbox-2">
            <div className="comment-owner-data">
              {!isUserDeleted ? (
                <Link to={`/account-portal/${comment.owner._id}`}>
                  {commentUser}
                </Link>
              ) : (
                <div>{commentUser}</div>
              )}
            </div>
            <div className="comment-input-div">
              <textarea
                type="text"
                value={commentEdit}
                onChange={(e) => setCommentEdit(e.target.value)}
              />
            </div>
            <div className="comment-save-div">
              {isCommentCreator && (
                <div>
                  <button onClick={(e) => handleEditClick()}>Save</button>
                  <button onClick={(e) => setEditMode(false)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
};

export default Comment;
