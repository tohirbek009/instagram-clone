import React, {useState, useEffect} from 'react'
import './App.css';
import Post from './Post';
import { db, auth } from './firebase'
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed'


function getModalStyled() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyled)

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null)

  useEffect(() => {
    const onsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        // user has logged in...
        console.log("this is current usr" + authUser)
        setUser(authUser)
      }
      else{
        // user has logged out...
        setUser(null)
      }
    })

    return () => {
      //perform some cleanup actions
      onsubscribe();
    }
  },);


  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })

  }, [])

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user?.updateProfile({
          displayName: username
        })
      }) 
      .catch(error => alert(error.message))
      // console.log(user.displayName);
      setOpen(false);
  }


  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }


  return (
    <div className="app">
     
      <Modal 
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
                />
            </center>
            <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            <Input 
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal 
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
                />
            </center>
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            <Input 
              placeholder="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt=''
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ):(
          <div className='app__loginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className='app__posts'>
        <div className='app__postleft'>
          {
            posts.map(({id, post}) => 
              <Post 
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            )
          }
        </div>
        <div className='app__postright'>
          <InstagramEmbed 
            url='https://www.instagram.com/p/CUj1k4ljkuF/'
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
        {user ? (
          <ImageUpload username={username} />
        ):(
          <div className='container_'>
            <div className='login__for__uploading'>
              Sorry, now you can't upload posts.<br /> 
              <span className="span">If you want add your posts</span> you have to <Button onClick={() => setOpen(true)}>Resigtor</Button>
            </div>
          </div>
        )
      }
        
      </div>

    </div>
  );
}

export default App;
