const canvas = document.querySelector(".myCanvas");
const width = canvas.width = window.innerWidth = 250;
const height = canvas.height = window.innerHeight = 250;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const tileSize = 25

ctx.fillStyle = "rgb(120, 120, 120)";
ctx.fillRect(0, 0, width, height);

/**
 * 2d array (grid)
 * each tile is an object
 * player position is stored in its own object
 *  
 * 
 */

//tile class
class Tile {
    constructor(x, y, canvas){
        this.x = x;
        this.y = y;
        this.coordinates = [x * tileSize, y * tileSize, tileSize, tileSize]
        this.canvas = canvas
    }

    containsPlayer = false
    containsFlag = false
    base = null

    draw(){
        let drawCoord = this.coordinates
        this.canvas.fillStyle = "rgb(255, 0, 0)";
        this.canvas.fillRect.apply(this.canvas, drawCoord);
        drawCoord[2] = tileSize - 1
        drawCoord[3] = tileSize - 1

        this.canvas.fillStyle = "rgb(0, 0, 0)";
        this.canvas.fillRect.apply(this.canvas, drawCoord);

        // console.log(this.coordinates)
    }

    highlight(){
        this.base = this.canvas.getImageData.apply(this.canvas, this.coordinates);
        this.canvas.fillStyle = "rgb(100, 100, 100)";
        this.canvas.fillRect.apply(this.canvas, this.coordinates);

    }
    unhighlight(){
        ctx.putImageData(this.base, this.x * tileSize, this.y * tileSize);
    }

}

//player class

class Player {
    constructor(name){
        this.name = name;
    }

    score = 0

    gainPoint() {
        this.score += 1;
    }


}

//game board class??
class GameBoard {
    constructor(roomName, p1, p2, size, canvas){
        this.canvas = canvas
        let c = canvas.getContext("2d", { willReadFrequently: true })
        console.log(c)
        this.roomName = roomName
        this.Player1 = new Player(p1)
        this.Player2 = new Player(p2)
        this.Tiles = []
        for (let i = 0; i < size; i++){
            this.Tiles[i] = []
            for (let j = 0; j < size; j++){
                this.Tiles[i][j] = new Tile(i, j, c)
                this.Tiles[i][j].draw()
                // if (i ==1 && j == 2) {
                //     this.Tiles[i][j].highlight()
                //     this.Tiles[i][j].unhighlight()
                // }

                // ctx.fillStyle = "rgb(255, 0, 0)";

                // ctx.fillRect(0, 0, 50, height);

                // console.log(i,j)
            }
        }

        //inefficient, checks every tile on every mouse move
        canvas.addEventListener("mousemove", (e) => {
            this.getTileByPos(e.clientX,  e.clientY)?.highlight()

            //unhighlight all others 
        })
    }

    gainPoint(p) {
        if (p == this.Player1.name){
            this.Player1.gainPoint()
            console.log("p1 score:", this.Player1.score)
        }
        else {
            this.Player2.gainPoint()
            console.log("p2 score:", this.Player2.score)
        }

    }

    getTileByPos(x, y){
        let rect = this.canvas.getBoundingClientRect();
        let tX = Math.trunc((x - rect.left)/ 25 )
        let tY = Math.trunc((y - rect.top) / 25)

        // console.log(tX, tY)
        return this.Tiles[tX ][tY ]
    }
}

let curX;
let curY;

// document.addEventListener('click', e => {
//     curX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
//     curY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
//   });

  
let myBoard = new GameBoard("room", "poo44", "poo24", 4, canvas)

myBoard.gainPoint("poo44")

myBoard.gainPoint("poo44")

console.log(myBoard.Tiles)

// let newTile = new Tile(1,1)
// newTile.draw(ctx)
// console.log(newTile.draw(ctx))


// ctx.fillStyle = "rgb(255, 0, 0)";
// ctx.fillRect.apply(ctx, [0, 0, 100, 100]);

// console.log(ctx)