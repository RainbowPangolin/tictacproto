const myGame = require('./servergame');


class Room {
    constructor(id, gameSession){
        this.id = id
        this.gameSession = gameSession
        this.connectedSockets = []
        this.numPlayers = 0
        this.maxPlayers = 8 //TODO change
    }

    addSocket(socket){
        this.connectedSockets.push(socket)
    }

    setHost(socket){
        this.host = socket
    }
    getHost(socket){
        return this.host
    }

    addPlayer(player){
        this.gameSession.addPlayer(player)
        this.numPlayers += 1
    }

    //callback for broadcast to all?

}

let rooms = new Set()

let roomsByID = new Map()
let roomsBySocket = new Map()

const RoomManager = {
    joinRoom(id, socket) {
        if (roomsByID[id]) {
            let thisRoom = roomsByID[id]
            console.log("Room already created, joining existing")
            thisRoom.connectedSockets.push(socket)
            roomsBySocket[socket] = thisRoom

           

            return
        } //prevents adding room or changing room info when it already exists

        let gameSess = new myGame.GameSession(socket)
        gameSess.setRules(2, 3, 3)
        gameSess.generateBoard()

        let newRoom = new Room(id, gameSess) 
        newRoom.addSocket(socket)
        newRoom.setHost(socket)
        rooms.add(newRoom)
        roomsByID[id] = newRoom
        roomsBySocket[socket] = newRoom
        console.log("New room created!")

    },

    // cutRoom(id) {
    //     rooms.delete(roomsByID[id]) //wrong
    // },
    
    getRoomByID(id) {
        return roomsByID[id] 
    },

    getRoomBySocket(socket) {
        return roomsBySocket[socket] 
    }
} 

// Object.freeze(RoomManager);
// export { RoomManager };

module.exports = { RoomManager };