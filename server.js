const express = require('express')
const app = express()
const port = 3001
const ws = require('ws');

app.use(express.static('public'))

let ClientSocketMap = new Map()
let RoomList = new Map() //probably better to do as a class

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.WebSocketServer({ noServer: true });
wsServer.on('connection', (socket, request) => {
  let requestedRoom =  request.url.substring(1)
  // console.log("request:", request)
  ClientSocketMap[socket] = requestedRoom

  if (RoomList[requestedRoom]) {
    RoomList[requestedRoom].push(socket)
  } else {
    RoomList[requestedRoom] = [socket]
  }
  
  socket.on('message', message => {
    const obj = JSON.parse(message)
    console.log(obj.x)
    // console.log(obj)
    // console.log({x:1,y:444})
    // console.log(RoomList[ClientSocketMap[socket]])

    //each client has a Room property
    //broadcasting to Room broadcasts to all members of that room


    RoomList[ClientSocketMap[socket]].forEach(element => {
      element.send(JSON.stringify(JSON.parse(message)));

    });
  });
});

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
  let z = "Asdf"

})