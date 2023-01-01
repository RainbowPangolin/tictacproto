const url = "ws://localhost:3000/"
const protocols = ["json"]
let webSocket
let user
let room


function clickPos(event) {
  webSocket.send(JSON.stringify({"mouseX": event.clientX, "mouseY": event.clientY}));
}

export function poo(pie){
  console.log(pie)
}

export function sendMove(moveObj){
  // console.log(moveObj)
  webSocket.send(JSON.stringify(moveObj));
}

export function sendPlayerInfo(playerObj){
  // console.log(moveObj)
  webSocket.send(JSON.stringify(playerObj));
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
  
    console.log("Received: ", msg)
    
    if (true){ //check if valid move/message is a move?
      //emit event to trigger game board update
      document.dispatchEvent(new CustomEvent('updategamestate', {detail: {
        move: msg.lastTurn
      }}))
    }
  };

}



const sendBtn = document.querySelector("#send")
const roomABtn = document.querySelector("#roomA")
const roomBBtn = document.querySelector("#roomB")

roomABtn.onclick = () => {
  connectToSocket("userA", "A")
  roomABtn.remove()
  roomBBtn.remove()

}
roomBBtn.onclick = () => {
  connectToSocket("userB", "B")
  roomBBtn.remove()
  roomABtn.remove()

}




console.log("Loaded js")



//Send keypress via socket
//Receive keypress and display