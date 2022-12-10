import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuth } from "../utils/isLoggedIn";
import VotingInterface from "./votingInterface";
import getLocalStorage from "../utils/getLocalStorage";
import FetchCalls from "../utils/fetchCalls";
import { timeDifference } from "../utils/timeDifference";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsChatRightText } from "react-icons/bs";

const Post = (props) => {
  const [isPostCreator, setIsPostCreator] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [postEdit, setPostEdit] = useState(props.post.content);
  const [voteCount, setVoteCount] = useState(props.post.rating);
  const [rerenderChild, setRerenderChild] = useState(true);
  const [displayOwnerOptions, setDisplayOwnerOptions] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [priviledges, setPriviledges] = useState("user");
  const route = "posts";
  const timeDiff = timeDifference(new Date(), new Date(props.post.date));

  const activateEdit = () => {
    setEditMode(true);
  };

  const handleEditClick = () => {
    setEditMode(false);
    setDisplayOwnerOptions(false);
    props.editAction(route, props.post._id, postEdit);
  };

  const handleDeleteClick = () => {
    props.deleteAction(route, props.post._id, true);
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
        `/posts/vote/${voteReq}/${props.post._id}`,
        "PATCH",
        data.jwt,
        { rating: userVote }
      );
      const response = await caller.protectedBody();
      if (response.ok) {
        setVoteCount(voteCount + userVote);
      } else if (response.status !== 400) {
        const backendError = await response.json();
        alert(backendError.message);
      }
    }
    setRerenderChild(!rerenderChild);
  };

  useEffect(() => {
    const checkIsPostCreator = async () => {
      const response = await isAuth();
      if (response.ok) {
        const user = await response.json();
        if (user._id === props.user._id) {
          setIsPostCreator(true);
        } else {
          setIsPostCreator(false);
        }
        if (user.accessLevel === 1) {
          setIsAdmin(true);
        }
      }
    };
    checkIsPostCreator();
  }, []);

  useEffect(() => {
    if (isPostCreator) {
      setPriviledges("creator");
    } else if (isAdmin) {
      setPriviledges("admin");
    } else if (!isAdmin && !isPostCreator) {
      setPriviledges("user");
    }
  }, [isAdmin, isPostCreator]);
  console.log("priviledges: ", priviledges);
  if (!editMode) {
    return (
      <div className="post-main">
        <div className="flex-box-1">
          <VotingInterface
            voteCount={voteCount}
            addVoteHandler={addVotePost}
            postInfo={props.post}
            key={rerenderChild}
            type="post"
          />
        </div>
        <div className="flex-box-2">
          <p className="posted-by-section">
            Posted by{" "}
            <Link to={`/account-portal/${props.user._id}`}>
              {props.user.firstName}
            </Link>{" "}
            {timeDiff}
          </p>
          <section className="post-section">
            <h2>{props.post.title}</h2>
            <p>{props.post.content}</p>
          </section>
          <div className="post-lower-section">
            <div className="comment-info-section">
              <BsChatRightText />
              {props.commentsNumber === 1 ? (
                <div className="comment-number">{`${props.commentsNumber} Comment`}</div>
              ) : (
                <div className="comment-number">{`${props.commentsNumber} Comments`}</div>
              )}
            </div>
            {isPostCreator && (
              <div className="owner-options-container">
                <div className="owner-options-dots">
                  <BiDotsHorizontalRounded
                    onClick={(e) =>
                      setDisplayOwnerOptions(!displayOwnerOptions)
                    }
                    className="dots"
                  />
                </div>
                {displayOwnerOptions && (
                  <div className="post-owner-options">
                    <div onClick={(e) => activateEdit()}>Edit</div>
                    <hr />
                    <div
                      onClick={(e) => handleDeleteClick()}
                      className="second"
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            )}
            {isAdmin && !isPostCreator && (
              <div className="owner-options-container">
                <div className="owner-options-dots">
                  <BiDotsHorizontalRounded
                    onClick={(e) =>
                      setDisplayOwnerOptions(!displayOwnerOptions)
                    }
                    className="dots"
                  />
                </div>
                {displayOwnerOptions && (
                  <div className="post-owner-options">
                    <div
                      onClick={(e) => handleDeleteClick()}
                      className="second"
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="post-main">
        <div className="flex-box-1">
          <VotingInterface
            voteCount={voteCount}
            addVoteHandler={addVotePost}
            postInfo={props.post}
            key={rerenderChild}
          />
        </div>
        <div className="flex-box-2">
          <p className="posted-by-section">
            Posted by{" "}
            <Link to={`/account-portal/${props.user._id}`}>
              {props.user.firstName}
            </Link>{" "}
            {timeDiff}
          </p>
          <section className="post-section">
            <h2>{props.post.title}</h2>
            <textarea
              type="text"
              value={postEdit}
              onChange={(e) => setPostEdit(e.target.value)}
              className="edit-content-box"
            />
          </section>
          <div>
            {isPostCreator && (
              <div className="edit-cancel-buttons">
                <button
                  className="save-button"
                  onClick={(e) => handleEditClick()}
                >
                  Save
                </button>
                <button
                  className="cancel-button"
                  onClick={(e) => {
                    setEditMode(false);
                    setDisplayOwnerOptions(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="post-lower-section">
              <div className="comment-info-section">
                <BsChatRightText />
                {props.commentsNumber === 1 ? (
                  <div className="comment-number">{`${props.commentsNumber} Comment`}</div>
                ) : (
                  <div className="comment-number">{`${props.commentsNumber} Comments`}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Post;
