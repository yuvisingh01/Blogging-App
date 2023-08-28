// CreatePost.js
import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from "../firebase-config";
import { useNavigate } from 'react-router-dom';

function CreatePost(props) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  const postCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const createPost = async () => {
    try {
      await addDoc(postCollectionRef, {
        title,
        postText,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Please Login first");
    }
  }

  useEffect(() => {
    if (!props.isAuth) {
      navigate("/login");
    }
  }, [])

  return (
    <div className='createPostPage'>
      <div className="cpContainer">
        <h1>Create a post</h1>
        <div className="inputGp">
          <label>Title: </label>
          <input type="text" placeholder='Title'
            value={title}
            onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div className="inputGp">
          <label htmlFor="">Post: </label>
          <textarea placeholder="Your Content" name="" id="" cols="30" rows="10"
            value={postText}
            onChange={(event) => setPostText(event.target.value)}></textarea>
        </div>
        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  )
}

export default CreatePost;























// import React, { useState, useEffect } from 'react';
// import { addDoc, collection } from 'firebase/firestore';
// import { db,auth } from "../firebase-config";
// import { useNavigate } from 'react-router-dom';

// function CreatePost(props) {

//   const [title,setTitle]=useState("");
//   const [postText,setPostText]=useState("");

//   const postCollectionRef=collection(db,"posts");
//   let  navigate=useNavigate();

//   const createPost=async ()=>{
//     try{await addDoc(postCollectionRef,{
//       title, 
//       postText,
//       author:{
//         name: auth.currentUser.displayName,
//         id:auth.currentUser.uid,
//       }});
//       navigate('/');
//     }
//     catch(err)
//     {
//       console.error(err);
//       alert("Please Login first");
//     }
//   }

//   useEffect(()=>{
//     if(!props.isAuth){
//       navigate("/login");
//     }
//   },[])

//   return (
//     <div className='createPostPage'>
//       <div className="cpContainer">
//         <h1>Create a post</h1>
//         <div className="inputGp">
//           <label>Title: </label>
//           <input type="text" placeholder='Title' 
//             onChange={(event)=>setTitle(event.target.value)}/>
//         </div>
//         <div className="inputGp">
//           <label htmlFor="">Post: </label>
//           <textarea placeholder="Your Content" name="" id="" cols="30" rows="10" onChange={(event)=>setPostText(event.target.value)}></textarea>
//         </div>
//         <button onClick={createPost}>Submit Post</button>
//       </div>
//     </div>
//   )
// }

// export default CreatePost
