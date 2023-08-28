import React, { useState, useEffect } from 'react';
import { getDocs, collection, doc, deleteDoc, updateDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { auth } from '../firebase-config';

import Comment from '../Comment'; // Create a Comment component
import Like from '../Like'; // Create a Like component

function Home(props) {
  const [postList, setPostList] = useState([]);
  const [updatedPost, setUpdatedPost] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
  const [currentPostId, setCurrentPostId] = useState(null); // Track the post being edited
  const postCollectionRef = collection(db, "posts");

  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});


  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })));
    }
    getPosts();
  }, []);


  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id)
    await deleteDoc(postDoc);
  }

  const startEditing = (id) => {
    setIsEditing(true);
    setCurrentPostId(id);
  }

  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentPostId(null);
  }

  const updatePost = async (id, post) => {
    const postDoc = doc(db, "posts", id);
    const newData = {
      title: updatedPost.title || post.title,
      postText: updatedPost.postText || post.postText,
    };
    await updateDoc(postDoc, newData);
    setIsEditing(false);
    setCurrentPostId(null);
  }



  const addComment = async (postId, commentText) => {
    const user = auth.currentUser;
    if (!user) {
      // Display an error message or prompt the user to log in
      window.alert('Please log in to comment on this post.');
      return;
    }
    try {
      const newComment = {
        text: commentText,
        postId,
        userId: auth.currentUser.uid,
      };
      const docRef = await addDoc(collection(db, 'comments'), newComment);
      const commentId = docRef.id;
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: [
          ...(prevComments[postId] ?? []),
          { id: commentId, ...newComment },
        ],
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };



  
  const toggleLike = async (postId) => {
    const user = auth.currentUser;
    if (!user) {
      // Display an error message or prompt the user to log in
      window.alert('Please log in to Like this post.');
      return;
    }
    try {
      const userId = auth.currentUser.uid;
      const likesQuery = query(
        collection(db, 'likes'),
        where('postId', '==', postId),
        where('userId', '==', userId)
      );
      const likesSnapshot = await getDocs(likesQuery);
      const hasLiked = !likesSnapshot.empty;

      if (hasLiked) {
        // User has already liked the post, so unlike it
        likesSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: (prevLikes[postId] ?? 0) - 1,
        }));
      } else {
        // User hasn't liked the post, so like it
        const newLike = {
          postId,
          userId,
          createdAt: new Date(),
        };
        await addDoc(collection(db, 'likes'), newLike);
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: (prevLikes[postId] ?? 0) + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };




  return (
    <div className='homePage'>
      {postList.map(((post) => {
        return (
          <div className='post' key={post.id}>
            <div className='postHeader'>
              <div className="title">
                {isEditing && currentPostId === post.id ? (
                  <>
                    <input
                      type="text"
                      value={updatedPost.title}
                      onChange={(e) => setUpdatedPost({ ...updatedPost, title: e.target.value })}
                    />
                    <textarea
                      value={updatedPost.postText}
                      onChange={(e) => setUpdatedPost({ ...updatedPost, postText: e.target.value })}
                    />
                    <button onClick={() => updatePost(post.id, post)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <h1>{post.title}</h1>
                )}
              </div>
              <div className="deletePost">
                {props.isAuth && post.author.id === auth.currentUser.uid && !isEditing && (
                  <>
                    <button onClick={() => { deletePost(post.id) }}>&#128465;</button>
                    <button className='emoji-icon' role="img" aria-label="Edit" onClick={() => startEditing(post.id)}>&#9998;</button>
                  </>
                )}
              </div>
            </div>
            <div className="postTextContainer">{post.postText}</div>
            <h3>@{post.author?.name}</h3>


            {/* //COMMENTS &  LIKES */}
            {/* Display comments */}
            <div className='comments'>
              {comments[post.id]?.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>

            {/* Comment input */}
            <div className='comment-input'>
              <input
                type='text'
                placeholder='Add a comment'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addComment(post.id, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            {/* Display likes */}
            <Like
              likes={likes[post.id] || 0}
              toggleLike={() => toggleLike(post.id)}
            />
            {/* </div> */}


          </div>
        )
      }))}
    </div>
  )
}

export default Home;