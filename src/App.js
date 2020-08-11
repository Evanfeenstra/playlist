import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import ReactAudioPlayer from 'react-audio-player'
import {useDropzone} from 'react-dropzone'
import {initialize, useDatu} from 'datu'
import 'firebase/storage'
import * as firebase from "firebase/app"

const songs = [
  {name:'Lemon', file:'/music/LEMON.wav'},
  {name:'Random song', file:'/music/sixer.wav'},
  {name:'Ukelele', file:'/music/uke.mp3'}
]

function App(){
  const {messages, send} = useDatu()
  console.log(messages)
  const allSongs = [...songs, ...messages]
  const [selected,setSelected] = useState('')
  return <div className="App">
    {allSongs.map((s,i)=>{
      return <Song key={i} song={s} 
        selected={selected===s.name}
        onSelect={()=> {
          setSelected(s.name)
        }}
      />
    })}
    <div className="upload">
      <MyDropzone send={send} />
    </div>
  </div>
}

function MyDropzone({send}) {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const file = acceptedFiles[0]
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(file.name);
    ref.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
      send({
        name: file.name,
        file: `https://firebasestorage.googleapis.com/v0/b/playlist-2020.appspot.com/o/${file.name}?alt=media`
      })
    });
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return (
    <div {...getRootProps()} style={{
        fontSize:11, padding:30, width:300, textAlign:'center',
        color:isDragActive?'white':'grey',
        border:isDragActive?'2px dashed white':'2px dashed grey'
      }}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

function Song(props){
  const {song, selected, onSelect} = props
  return <div className="song" style={{background:selected?'navy':'black'}}>
    <div onClick={onSelect} className="song-name">
      {song.name}
    </div>
    {selected && <ReactAudioPlayer
      src={song.file}
      controls
      autoPlay
    />}
  </div>
}

export default App;

const firebaseConfig = {
  apiKey: "AIzaSyDoA5XjQ6RtLEKNtXnqINNytOI4n0K0F2o",
  authDomain: "playlist-2020.firebaseapp.com",
  databaseURL: "https://playlist-2020.firebaseio.com",
  projectId: "playlist-2020",
  storageBucket: "playlist-2020.appspot.com",
  messagingSenderId: "1061038916785",
  appId: "1:1061038916785:web:54a3e57bc758c540b24e90"
};
initialize(firebaseConfig)