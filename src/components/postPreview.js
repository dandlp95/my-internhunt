import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import VotingInterface from "./votingInterface";
import getLocalStorage from "../utils/getLocalStorage";
import FetchCalls from "../utils/fetchCalls";
import { timeDifference } from "../utils/timeDifference";

const PostPreview = (props) => {
  const [post, setPost] = useState(props.post);
  const [postContent, setPostContent] = useState(props.post.content)
  const [postOwner, setPostOwner] = useState(props.post.owner);
  const [voteCount, setVoteCount] = useState(props.post.rating);
  const timeDiff = timeDifference(new Date(), new Date(post.date));

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
        `/posts/vote/${voteReq}/${post._id}`,
        "PATCH",
        data.jwt,
        { rating: userVote }
      );
      const response = await caller.protectedBody();
      if (response.ok) {
        setVoteCount(voteCount + userVote);
      } else {
        console.log();
      }
    }
  };

  useEffect(() => {
    if (!postOwner) {
      setPostOwner({ firstName: "[Deleted ", lastName: "User]" });
    }
    if(postContent.length > 350){
      setPostContent(post.content.substring(0, 350) + "..."
)    }
  }, []);

  if (postOwner) {
    return (
      <div className="postpreview">
        <VotingInterface
          voteCount={voteCount}
          addVoteHandler={addVotePost}
          postInfo={post}
          key={voteCount}
          type="post"
        />
        <div className="post-content">
          <div className="post-metadata">
            Posted by{" "}
            {postOwner._id ? (
              <Link to={`/account-portal/${postOwner._id}`}>
                {postOwner.firstName} {postOwner.lastName}
              </Link>
            ) : (
              <span>
                {postOwner.firstName} {postOwner.lastName}
              </span>
            )}{" "}
            {timeDiff}
          </div>
          <Link to={`/post?postId=${post._id}`} className="post-link">
            <section>
              <div>
                <h3>{post.title}</h3>
              </div>
              <p>{postContent}</p>
            </section>
          </Link>
        </div>
      </div>
    );
  }
};

export default PostPreview;
