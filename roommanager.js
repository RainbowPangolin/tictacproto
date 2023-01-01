class Room {
    constructor(id, gameSession){
        this.id = id
        this.gameSession = gameSession
        this.connectedSockets = []
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
    }

    //callback for broadcast to all?

}

let rooms = new Set()

let roomsByID = new Map()
let roomsBySocket = new Map()

const RoomManager = {
    joinRoom(id, gameSession, socket) {
        if (roomsByID[id]) {
            console.log("Room already created, joining existing")
            roomsByID[id].connectedSockets.push(socket)
            roomsBySocket[socket] = roomsByID[id]
            return
        } //prevents adding room or changing room info when it already exists
        let newRoom = new Room(id, gameSession) 
        newRoom.addSocket(socket)
        newRoom.setHost(socket)
        rooms.add(newRoom)
        roomsByID[id] = newRoom
        roomsBySocket[socket] = newRoom
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