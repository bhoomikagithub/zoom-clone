const socket = io('/')
// var socket = io();
const videoGrid = document.querySelector("#video-div")
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  
document.querySelector("#typing-div button")
        .addEventListener("click", function(){
          var data=document.querySelector("textarea").value;
          if(data.trim().length>=1){
            socket.emit("msg",data);
          }
          document.querySelector("textarea").value="";
        })

        socket.on("msg", function(data){
          var div= document.createElement("div");
          div.classList.add("msg");
          div.textContent=data;
          document.querySelector("#chatting").appendChild(div);
        })

})
document.querySelector("#chat-btn").addEventListener("click", function(){
  document.querySelector("#msg-div").style.display="initial";
  document.querySelector("#participants-div").style.display="none";
})
document.querySelector("#msgs").addEventListener("click", function(){
  document.querySelector("#msg-div").style.display="initial";
  document.querySelector("#participants-div").style.display="none";
})
document.querySelector("#prt-btn").addEventListener("click", function(){
  document.querySelector("#msg-div").style.display="none";
  document.querySelector("#participants-div").style.display="initial";
})
document.querySelector("#people-logo").addEventListener("click", function(){
  document.querySelector("#msg-div").style.display="none";
  document.querySelector("#participants-div").style.display="initial";
})
document.querySelector("#ppl").addEventListener("click", function(){
  document.querySelector("#msg-div").style.display="none";
  document.querySelector("#participants-div").style.display="initial";
})
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})
// socket.on('user-disconnected', userId => {
//   document.querySelector("#bgc").addEventListener("click")
// })

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
  `
  document.querySelector('#mic-div').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  `
  document.querySelector('#mic-div').innerHTML = html;
  document.querySelector('#mic-div').innerHTML.style.fontSize = `${15}px`;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
  `
  document.querySelector('#vdo-div').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
  `
  document.querySelector('#vdo-div').innerHTML = html;
}


let username;
document.querySelector('#roomdets').addEventListener('click', function(){
      //  roomname = document.querySelector('#room').value;
      username = document.querySelector('#name').value;
      if(username.trim().length > 2){
        document.querySelector('.nameuser').textContent = username;
        document.querySelector('.overlay').style.display = 'none';
        // document.querySelector('#main').style.display = 'initial';
        socket.emit('name', username);
      }
   })