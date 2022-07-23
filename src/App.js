import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBG9FoO9Tzf2UQVWE17BmbAxHZ1VtVoYcA",
  authDomain: "superchat-deb53.firebaseapp.com",
  projectId: "superchat-deb53",
  storageBucket: "superchat-deb53.appspot.com",
  messagingSenderId: "737080204178",
  appId: "1:737080204178:web:64fb1edc9a5702b6be3f4b",
  measurementId: "G-PBRPCGQDKE"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1><i>SpeedoCHAT💬</i></h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}
function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}><i>Sign in with Google !</i></button>
      <p id='note'>Welcome! Sign In To Join The Chat !</p>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out !</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type Something ....." />
      <button type="submit" disabled={!formValue}>Send !</button>
    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (<>
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  </>)
} 

export default App;