import React from 'react';

function Comment({ comment }) {
  return (
    <div className="comment">
      <p>{comment.text}</p>
    </div>
  );
}

export default Comment;