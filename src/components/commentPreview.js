import React from "react";
import { useState, useEffect } from "react";
import { BsChatRightText } from "react-icons/bs";
import { Link } from "react-router-dom";

const CommentPreview = (props) => {
  const [commentUser, setCommentUser] = useState(
    props.comment.owner.firstName + " " + props.comment.owner.lastName
  );
  const [postTitle, setPostTitle] = useState("");
  const [titleLink, setTitleLink] = useState(false);

  useEffect(() => {
    if (props.comment.post) {
      setPostTitle(props.comment.post.title);
      setTitleLink(true);
    } else {
      setPostTitle("[Deleted Post]");
    }
  }, []);

  return (
    <div className="comment-main">
      <div>
        <div className="comment-info-container">
          <BsChatRightText />
          <div className="comment-info">
            {commentUser} commented on{" "}
            {titleLink ? (
              <Link to={`/post?postId=${props.comment.post._id}`}>
                {postTitle}
              </Link>
            ) : (
              <span>{postTitle}</span>
            )}
          </div>
        </div>
        <div className="comment-content">
          <p className="content">{props.comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentPreview;
//<Link to={`/post`}>{postTitle}</Link>
