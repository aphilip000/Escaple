// Fake enums that i probably wont actually use
const TILES = ['⬜', '🟦', '🟢', '⚫']
const UNKNOWN = '❔'
const PLAYER = '🙂'
const MOVES = ['⬜', '🔼', '⏫', '⬅️', '➡️', '🔄']
// probably terrible practice but having 25 falses takes a lot of space
const f = false
const t = true


let puzzle = document.getElementById("puzzle")
class GameBoard {
    constructor() {
        this.known = [ // keeps track of known tiles
            [f, f, f, f, f],
            [f, f, f, f, f],
            [f, f, f, f, f],
            [f, f, f, f, f],
            [f, f, f, f, f]
        ]
        this.tiles = [ // tracks the actual board
            ['⬜','⬜','⬜','⬜','⬜'],
            ['⬜','🟦','⬜','⬜','⬜'],
            ['⬜','🟦','⚫','⬜','⬜'],
            ['⬜','🟦','🟦','🟦','⬜'],
            ['🟢','⬜','⬜','⬜','⬜'] 
        ]
        this.x = 0
        this.y = 4
        this.dir = 0 // direction character is facing
        this.revealADJ(this.x, this.y)
    }
    // TODO: 
    // GameBoard(filename) { 

    // }
    display() {
        let output = ""
        for (let y = 0; y < 5; y++) {
            output += `<tr class="puzzle-row flex-container">`
            for (let x = 0; x < 5; x++) output += `<td class="puzzle-data${(this.x == x && this.y == y)? " player direction=" + this.dir : ""}">${(this.x == x && this.y == y) ? PLAYER : (this.known[y][x] === true) ? this.tiles[y][x] : UNKNOWN}</td>`
            output += `</tr>`
        }
        // this.tiles.forEach(element => {output += `<div>${element}</div>`})
        puzzle.innerHTML = output
    }
    revealBoard() {
        this.known = [ // keeps track of known tiles
            [t, t, t, t, t],
            [t, t, t, t, t],
            [t, t, t, t, t],
            [t, t, t, t, t],
            [t, t, t, t, t]
        ]
        this.display()
    }
    // reveal a single tile
    reveal(x, y) {
        this.known[y][x] = t
    }
    // reveal a horizontal line of tiles
    // assumes points share a coordinate
    revealLine(x1, y1, x2, y2) {
        if (x1 === x2) {
            for (let y = y1; y <= y2; y++) {
                this.revealADJ(x1, y)
            }
        } else {
            for (let x = x1; x <= x2; x++) {
                this.revealADJ(x, y1)
            }
        }
    }
    // reveal all 5 tiles on and adjacent to this
    revealADJ(x, y) {
        for (let i = y-1; i < y+2; i++) {
            if (i >= 0 && i <= 4) { // check if within bounds
                for (let j = x-1; j < x+2; j++) {
                    if (j >= 0 && j <= 4)
                        this.known[i][j] = t
                }
            }
        }
    }
    executeMoves(moves) {
        const MOVES_FUNC = [ , this.revealADJ, ]
        for (let i = 0; i < moves.length; i++) {

        }
    }
    mONE() {
        
    }
}


// class Moves {
//     constructor(numSteps) {
//         this.A = Array(numSteps)
//     }
// }

let G = new GameBoard()
G.display()











