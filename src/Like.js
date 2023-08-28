// Like.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
function Like({ likes, toggleLike }) {
  return (
    <div className="like">
    <button onClick ={toggleLike} >
  <FontAwesomeIcon icon={faThumbsUp} /> Like
</button>
      {likes} Likes
    </div>
  );
}

export default Like;
