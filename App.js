import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './post';
import {db ,auth} from "./firebase";
import { makeStyles} from "@material-ui/core/styles"

import { Button, Modal, Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

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
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));




function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user , setUser] = useState(null);

  useEffect( ()=> {
    //state is not persisent as on refresing you can lost state data but below function onAuthStateChanges kept you logeed in refresh.
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        console.log(authUser);
        setUser(authUser); 
      } else {
        setUser(null);
        //user has logged out
      }
    })
    return () => {
      //perform some cleanUp actions
      unsubscribe();
    }
  }, [user, username]);

  /*usEffect runs the piece of code on specific condition*/
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
    //every single time the change happen in database it fire this code
    //with using id to render it one add new post on page instead of refreshing whole page.
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      });
    })
    .catch((error) => alert(error.message))
    
    setOpen(false);
  }


  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
    //setting above false help to close the modal after sign up
  }

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="sign_up">
            <center>
            <img className="app__headerImage" 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="instagram logo"> 
            </img>
            </center>
            <input 
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signUp}>Sign Up</Button>
            
          </form>
          
        
        </div>
      </Modal>
      
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="sign_up">
            <center>
            <img className="app__headerImage" 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="instagram logo"> 
            </img>
            </center>
            
            <input 
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signIn}>SignIn</Button>
          </form>
        </div>
      </Modal>

      <div className="App__header">
        <img className="app__headerImage" 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="instagram logo"> 
        </img>
        
        {user ? (<Button onClick={() => auth.signOut()}>logout</Button>) : (
        <div className="app_logincontainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>
        </div>
        )}
      </div>

      
      
      <div className="app_posts">
        <div className="app_postsleft">
          {
            posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption}/>
            ))
          }
        </div>
        <div className="app_postsright">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
        
      </div> 

       {/*below conditioned uploading option if you are not logged in you can't get upload option*/}
       {user?.displayName ? (
         <ImageUpload username={user.displayName}/>
       ) : (
         <h3>Sorry you need to login</h3>
       )}
      

      
      
      

    </div>
  );
}

export default App;
