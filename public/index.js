const url = "ws://localhost:3000/"
const protocols = ["json"]
let webSocket
let user
let room


function clickPos(event) {
  webSocket.send(JSON.stringify({"mouseX": event.clientX, "mouseY": event.clientY}));

}


function connectToSocket(usr, rm){
  webSocket = new WebSocket(url + rm, protocols);
  user = usr
  room = rm

  webSocket.onopen = (event) => {
    // webSocket.send(JSON.stringify({user: room}));
    sendBtn.onclick = clickPos;
  };

  webSocket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
  
    console.log("Received: ",msg)
  };

}



const sendBtn = document.querySelector("#send")
const roomABtn = document.querySelector("#roomA")
const roomBBtn = document.querySelector("#roomB")

roomABtn.onclick = () => {
  connectToSocket("userA", "A")
}
roomBBtn.onclick = () => {
  connectToSocket("userB", "B")
}




console.log("Loaded js")



//Send keypress via socket
//Receive keypress and display