//Basic tic-tac-toe game, modular enough to expand to something like connect-4 without too much trouble

//Stores state of marking (x, o, unmarked, or new markings to be added)
//Player is identified by the marking
//Win condition is checked in its own method and not hard coded here
class Tile {
    constructor(x, y, doc, options = {}){
        this.x = x
        this.y = y
        //options has a 'default marking' option. the default is unmarked.
        this.updateMarking(options?.mark)
        const myButton = document.createElement("button");

        this.tileButton = myButton
        //create button element and append to DOM in correct location
        
        options.board.append(myButton)
    }

    updateMarking(mark){
        this.mark = mark
    }
}

const clientGameState = {
    currentTurn: null,
    myTurn: this.currentTurn == this.mySelf,
    mySelf: null
}

function createBoard(size){
    for (let i = 0; i < size; i++){
        const myDiv = document.createElement("div");
        document.querySelector("#board").append(myDiv)
        for (let j = 0; j < size; j++){
            let tile = new Tile(i,j, document, {board: myDiv} )
        }
    }
}

//tester buttons for no-server-testing
let stateBtn = document.querySelector("#update-state-event-btn")
let playerWinBtn = document.querySelector("#player-win-event-btn")
stateBtn.addEventListener('click', (e) => {
    stateBtn.dispatchEvent(new CustomEvent('gameStateChange', { bubbles: true, detail: { board: "A representation of full board" } })) //it would be more efficient to have this be simply the change that occurred
})

function updatePlayer(character){
    document.querySelector("#player > p").innerHTML = character
    clientGameState.mySelf = character
}

function updateCurrentTurn(character){
    document.querySelector("#current-turn > p").innerHTML = character

}

function displayWin(winlose){

}

function updateBoard(board){
    console.log(board)
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

    //listen for board update event, same as playerclick
    document.addEventListener('gameStateChange', (e) => { 
        updateBoard(e.detail.board)
        //redraw board with new info, allow or disable player move depending on who's turn it is
        if (e.turn == clientGameState.mySelf) {
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

main()