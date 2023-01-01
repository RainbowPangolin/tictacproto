function diagonalsToArrays(matrix){
    //return a list of arrays
    //do this to get top left to bottom right arrays, then rotate 90 deg and repeat algorithm 3x
    let returnMatrix = []
    //rotate and repeat 4 times 
    for (let x = 0; x < 4; x++){
        // get each top left down right diagonal for each item in top row

        //Stole matrix rotation algorithm from https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
        matrix = matrix[0].map((_, index) => matrix.map(row => row[index]).reverse())

        for (let i = 0; i < matrix[0].length; i++){
            let tempArray = []
            for (let j = 0; j < matrix[0].length -i; j++){
                try {
                    // is using try catch here inefficient? guaranteed to catch on every call
                    tempArray.push(matrix[j][i+j])
                } catch (e) {
                    console.log("Skipping error: ", e)
                }
            }
            returnMatrix.push(tempArray)
        }
    }
    return returnMatrix    
}

// console.log(diagonalsToArrays([[1,2,3],[4,5,6],[7,8,9]]))

class GameSession {
    roomID;
    inProgress;
    curNumber;
    numPlayers;
    size;
    winSize;
    players = [];

    constructor(roomID){
        this.roomID = roomID
        this.inProgress = false
        console.log("Game started!")
        this.curNumber = 0
    }
    
    get currentPlayer(){
        this.players[this.curNumber]
    }

    addPlayer(player){
        this.players.push(player)
    }

    //board- a representation of the game board
    //will support multiple characters, arbitrary size
    
    setRules(numPlayers, size, winSize){
        this.numPlayers = numPlayers
        this.size = size
        this.winSize = winSize
    }

    // set players(playerList) {
    //     this._players
    // }

    generateBoard(){
        this.board = []
        if (!this.size){
            //throw error TODO
            console.log("ERROR NO SIZE")
            return
        }
        for (let i = 0; i < this.size; i++){
            this.board[i] = []
            for (let j = 0; j < this.size; j++){
                this.board[i][j] = null
            }
        }
    }

    makeMove(move){
        this.board[move.x][move.y] = move.mark
        this.checkWin(this.board)
        this.curNumber = ((this.curNumber + 1) % this.players.length)
    }

    checkWin(board){
        let diagonals = diagonalsToArrays(this.board)
        let columns = board[0].map((_, index) => board.map(row => row[index]).reverse())
        let checkables = board.concat(columns.concat(diagonals))
        for (let i = 0; i < checkables.length; i++){ //goes over each array
            let curPlayer = undefined
            let tally = 0
            checkables[i].forEach( element => {
                if (curPlayer == element) {
                    tally++ 
                } else {
                    curPlayer = element
                }
                if (tally >= this.winSize) {
                    return curPlayer
                }
            })
            
        }
        return null 
    }

}


module.exports = { GameSession };