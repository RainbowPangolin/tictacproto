const express = require('express')
const app = express()
const port = 3001
const ws = require('ws');


const myGame = require('./servergame');
const RoomManager = require('./roommanager'); //TODO probably a better way to construct this
app.use(express.static('public'))

let ClientSocketMap = new Map()
let RoomList = new Map() //probably better to do as a singleton

const rm = RoomManager.RoomManager
// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.WebSocketServer({ noServer: true });
wsServer.on('connection', (socket, request) => {

  //room is identified by A or B for now
  let requestedRoomID =  request.url.substring(1)


  // ClientSocketMap[socket] = requestedRoomID

  let gameSess = new myGame.GameSession(socket)
  gameSess.setRules(2, 3, 3)
  gameSess.generateBoard()

  rm.joinRoom(requestedRoomID, gameSess, socket) //should be an idempotent operation
  //TODO do a check for if this user is making the room and thus should be host
  // rm.getRoomByID(requestedRoomID).addSocket(socket)

  // if (RoomList[requestedRoom]) {
  //   RoomList[requestedRoom].push({clientSocket: socket, gameSess: gameSess})
  // } else {
  //   RoomList[requestedRoom] = [{clientSocket: socket, gameSess: gameSess}]
  // }



  
  
  socket.on('message', message => {
    // const obj = JSON.parse(message)
    // console.log(obj.x)
    //each client has a Room property
    //broadcasting to Room broadcasts to all members of that room
    let parsed = JSON.parse(message)
    if (parsed.msgType == "move"){

      let move = parsed.move

      let currentRoom = rm.getRoomBySocket(socket)
  
      handleMove(currentRoom.gameSession, move)
  
      let clientUpdate = nextTurnFrom(currentRoom.gameSession, move)
  
      currentRoom.connectedSockets.forEach(element => {
        // console.log(element)
        element.send(JSON.stringify(clientUpdate));
      });
    } else if (parsed.msgType == "info") {
      rm.getRoomBySocket(socket).addPlayer(parsed.player)
    } else {
      console.log("ERROR: Unexpected message type")
    }


    // RoomList[ClientSocketMap[socket]].forEach(element => {
    //   element.clientSocket.send(JSON.stringify(JSON.parse(message)));
    // });



  });
});


function handleMove(gameSession, move){
  // let move = JSON.parse(message)
  if (!moveIsValid(move)){
    return
  }
  
  gameSession.makeMove(move)
  
  //update game state on server

}

function nextTurnFrom(gameSession, lastMove){

  return {lastTurn: lastMove, nextMoveBy: gameSession.currentPlayer}

  // {lastTurn: [1,1,'x'], nextMoveBy: 'o'}

}

function moveIsValid(move){
  return true
}

const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});



app.get('/', (req, res) => {
  res.sendFile('/index.html', {root: path.join(__dirname, 'public')})
})

app.get('/poo', (req, res) => {
  // let socketKey = req.get("sec-websocket-key")
  // res.set({
  //   'Upgrade': 'websocket',
  //   'Connection': 'Upgrade',
  //   'sec-websocket-accept': socketKey
  // })

  // res.status(101).send('Switching Protocols')
  // // res.sendStatus(101)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})