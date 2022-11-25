// Fake enums that i probably wont actually use
const TILES = ['⬜', '🟦', '🟢', '⚫']
const UNKNOWN = '❔'
const PLAYER = '🙂'
const MOVES = ['🔼', '⬅️', '➡️', '🔄'] // '⏫', 
const ROWS = 5
const COLS = 5

const NUM_MOVES = 6




class GameBoard {
    known
    tiles
    pos
    dir
    constructor() {
        // tracks the tiles the player has revealed
        this.known = Array(ROWS)
        for (let y = 0; y < ROWS; y++) {
            this.known[y] = Array(COLS)
            for (let x = 0; x < COLS; x++) this.known[y][x] = false
        }
        // tracks the actual board
        this.tiles = [ 
            ['🟢','⬜','⬜','⬜','⬜'],
            ['⬜','🟦','⬜','⬜','⬜'],
            ['⬜','🟦','⚫','⬜','⬜'],
            ['⬜','🟦','🟦','🟦','⬜'],
            ['⬜','⬜','⬜','⬜','⬜'] 
        ]
        // the character's position
        this.pos = {x:0, y:0}
        // direction character is facing
        // 0 is north, 1 is east, etc.
        this.dir = 0 
        this.revealADJ(this.pos)
        this.revealLine(this.pos, GameBoard.add(2, this.dir, this.pos))
    }
    // TODO: 
    // GameBoard(filename) { 

    // }
    display() {
        let output = ""
        for (let y = 0; y < ROWS; y++) {
            output += `<tr class="puzzle-row flex-container">`
            // checks if the player is on this tile and adds classes so the browser displays the character
            for (let x = 0; x < COLS; x++) output += `<td class="puzzle-data${(this.pos.x == x && this.pos.y == y)? " charLocation rotate" + this.dir : ""}">${(this.known[y][x] === true) ? this.tiles[y][x] : UNKNOWN}</td>`
            output += `</tr>`
        }
        // this.tiles.forEach(element => {output += `<div>${element}</div>`})
        puzzle.innerHTML = output
    }
    revealBoard() {
        for (let y = 0; y < COLS; y++) {
            for (let x = 0; x < ROWS; x++) this.known[y][x] = true
        }
        this.display()
    }
    hideBoard() {
        for (let y = 0; y < COLS; y++) {
            for (let x = 0; x < ROWS; x++) this.known[y][x] = false
        }
        this.display()
    }
    // reveal a single tile
    reveal(pos) {
        if (pos.x >= 0 && pos.x < COLS && pos.y < ROWS && pos.y >= 0)
            this.known[pos.y][pos.x] = true
    }
    // reveal a horizontal line of tiles
    // assumes points share a coordinate
    revealLine(pos1, pos2) {
        this.hideBoard()
        // x is same
        if (pos1.x === pos2.x) {
            for (let y = pos1.y; y <= pos2.y; y++) {
                this.reveal({x:pos1.x, y:y})
            }
        } 
        // y is same
        else {
            for (let x = pos1.x; x <= pos2.x; x++) {
                this.reveal({x:x, y:pos1.y})
            }
        }
    }
    // reveal all 5 tiles on and adjacent to this
    revealADJ(pos) {
        let x = pos.x
        let y = pos.y
        this.reveal({x:x, y:y})
        this.reveal({x:x+1, y:y})
        this.reveal({x:x-1, y:y})
        this.reveal({x:x, y:y+1})
        this.reveal({x:x, y:y-1})
    }
    executeMoves(moves) {
        for (let i = 0; i < moves.length; i++) {
            switch (moves[i]) {
                case MOVES[0]: this.advance(); break
                case MOVES[1]: this.turn(-1); break
                case MOVES[2]: this.turn(1); break
                case MOVES[3]: this.turn(2); break
            }
        }
    }


    // add magnitude m in direction dir to position
    // add(m:number, dir:number, pos:{x, y}): {x, y}
    static add(m, dir, pos) {
        console.log(m, dir, pos)
        switch (dir) {
            case 0: return {x:pos.x, y:pos.y - m}
            case 1: return {x:pos.x + m, y:pos.y}
            case 2: return {x:pos.x, y:pos.y + m}
            case 3: return {x:pos.x - m, y:pos.y}
        }
    }
    // check if this position is within the bounds of the board
    inBounds(pos) {
        return pos.x >= 0 && pos.x < COLS && pos.y >= 0 && pos.y < ROWS
    }
    // advance the character's position by 1
    advance() {
        let newPos = GameBoard.add(1, this.dir, this.pos)
        // move the character if possible
        if (this.inBounds(newPos) && this.tiles[newPos.y][newPos.x] != '🟦') this.pos = newPos
        // reveal 2 tiles ahead
        this.reveal(GameBoard.add(2, this.dir, {x:this.pos.x, y:this.pos.y}))
        this.display()
    }
    debug() {
        console.log(`pos: ${this.pos}\ndir: ${this.dir}`)
    }
    // turns
    turn(direction) {
        this.dir = (this.dir + direction) % 4
        // this.debug()
        this.revealLine(this.pos, GameBoard.add(2, this.dir, this.pos))
        this.display()
    }
}




let puzzle = document.getElementById("puzzle")
let moveListEl = document.querySelector("#movesList")

let G = new GameBoard()
for (let i = 0; i < MOVES.length; i++) moveListEl.innerHTML += `<div class="move" onclick="clickEvent(event)">${MOVES[i]}</div>`
G.display()


function clickEvent(event) {
    G.executeMoves([event.target.innerHTML])
}
// G.revealBoard()











