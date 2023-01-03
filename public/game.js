import * as myNet from './index.js'

//Basic tic-tac-toe game, modular enough to expand to something like connect-4 without too much trouble

//Stores state of marking (x, o, unmarked, or new markings to be added)
//Player is identified by the marking
//Win condition is checked in its own method and not hard coded here
class Tile {
    constructor(x, y, doc, options = {}){
        this.x = x
        this.y = y
        //options has a 'default marking' option. the default is unmarked.
        //create button element and append to DOM in correct location
        const myButton = document.createElement("button");
        let buttonData = JSON.stringify({x:x, y:y})
        myButton.setAttribute('data-game', buttonData)
        this.tileButton = myButton
        options.board.append(myButton)
        this.updateMarking(options?.mark)

    }

    updateMarking(mark){
        this.mark = mark
        if (mark != undefined){
            this.tileButton.innerHTML = mark
        }
    }
}
const clientGameState = {
    currentTurn: null,
    myTurn:() => (this.currentTurn == this.mySelf),
    mySelf: null,
    tiles: [],
    started: false
}

function createBoard(size){
    for (let i = 0; i < size; i++){
        const myDiv = document.createElement("div");
        document.querySelector("#board").append(myDiv)
        clientGameState.tiles[i] = []
        for (let j = 0; j < size; j++){
            let tile = new Tile(i,j, document, {board: myDiv} )
            clientGameState.tiles[i][j] = tile
        }
    }
}

function updatePlayer(character){
    document.querySelector("#player > p").innerHTML = character
    clientGameState.mySelf = character

    myNet.sendPlayerInfo({msgType: 'info', player: character})

}

function updateCurrentTurn(character){
    document.querySelector("#current-turn > p").innerHTML = character

}

function displayWin(winlose){
    document.querySelector("#winloss").innerHTML = winlose

}

function updateBoard(move){
    // console.log(move)
    let x = move.x
    let y = move.y
    let mark = move.mark
    clientGameState.tiles[x][y].updateMarking(mark)
    console.log("Move made with mark ", mark)
}

function main(){
    promptChooseCharacter.then(
        result => {
            // console.log("promise fired!")
            createBoard(result.size)
            updatePlayer(result.playerCharacter)
            if (result.startingTurn == clientGameState.mySelf){
                clientGameState.myTurn = true
            } else {
                clientGameState.myTurn = false
            }
            updateCurrentTurn('o') //TODO make modular
        }
    ).catch(
        e => {
            console.log("ERROR fired: ", e)        
        }
    )

    //event listeners

    document.addEventListener('startgameclient', () => {
        clientGameState.started = true
    })

    //listen for board update event
    document.addEventListener('updategamestate', (e) => { 
        updateBoard(e.detail.move)
        //redraw board with new info, allow or disable player move depending on who's turn it is
        if (e.detail.nextMoveBy == clientGameState.mySelf) {
            clientGameState.myTurn = true
        } else {
            clientGameState.myTurn = false
        }
    });

    //listen for win event
    document.addEventListener('win', (e) => {
        // display win or  message, allow either player to reset game
        if (e.winner == clientGameState.mySelf) {
            displayWin("WON")
        } else {
            displayWin("LOST")
        }

        promptRestart()
    })

    //listen for player-move

    document.addEventListener('playermove', (e) => {
        // console.log(JSON.stringify(e.detail.move))
        myNet.sendMove({msgType: 'move', move: e.detail.move})
    })
}

let promptChooseCharacter = new Promise( function (res) {
    let promptContainer = document.querySelector("#character-selector")
    promptContainer.addEventListener('click', function endListen(e) {
        if (e.target.hasAttribute('character')){
            // console.log(e.target.getAttribute("character"))
            promptContainer.removeEventListener('click', endListen);
            res({size: 3, playerCharacter: e.target.getAttribute("character"), startingTurn: 'o'}) //o always goes first for now
        }
    })
});

let myBoard = document.querySelector("#board")
myBoard.addEventListener('click', function emitMoveEvent(e) {
    if (e.target.hasAttribute('data-game')){
        if (clientGameState.started && clientGameState.myTurn) {
            // console.log(e)
            let myMoveStr = e.target.getAttribute("data-game")
            let myMove = JSON.parse(myMoveStr)
            myMove.mark = clientGameState.mySelf
            myBoard.dispatchEvent(new CustomEvent('playermove', { bubbles: true, detail: { 
                board: "A representation of full board",
                move: myMove
            }}))
        }
    }
})

main()