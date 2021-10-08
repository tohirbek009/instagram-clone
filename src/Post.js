import React, {useState, useEffect} from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from 'firebase';


function Post({ postId, user, username, caption, imageUrl }) {   
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState()
    const [isImage, setIsImage] = useState(true)
    
    useEffect(()=>{
        
        if(postId){
            var unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
            })
        }

        return () => {
            unsubscribe();
        };
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()

        });
        setComment('');
    }
    
    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar 
                    className="post__avatar"
                    alt="TaveQazi"
                    src="https://icon-library.com/images/user-icon-jpg/user-icon-jpg-2.jpg"
                />

                <h3>{username}</h3> 
            </div>
           

            <img className="post__image" src={imageUrl} alt="" />
            <vide control src={imageUrl} alt="" />
            

            <h4 className='post__text'><strong>{username}</strong> {caption}</h4>
            {/* username + caption */}

            <div className='post__comments'>
                {
                    comments.map((comment) =>
                        <p>
                            <b>{comment.username}</b> {comment.text}
                        </p>
                    )
                }
            </div>
            

            {user && (
                <form className='post__commentBox'>
                <input
                  className='post__input'
                  type='text'
                  placeholder='Add a comment...'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />  
                <button
                    className='post__button'
                    disabled={!comment}
                    type='submit'
                    onClick={postComment}
                >
                    Post
                </button>
            </form>
            )}
        </div>
    )
}

export default Post
