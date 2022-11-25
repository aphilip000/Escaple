// Fake enums that i probably wont actually use
const TILES = [ 
    ['❎','⬜','⬜','⬜','⬜'],
    ['⬜','🟦','⬜','⬜','⬜'],
    ['⬜','🟦','⚫','⬜','⬜'],
    ['⬜','🟦','🟦','🟦','⬜'],
    ['⬜','⬜','⬜','⬜','⬜'] 
]
const SOLUTION = ['➡️', '🔼', '🔼', '➡️', '🔼', '🔼']
const BLANK = "⬜"
const UNKNOWN = '❔'
const PLAYER = '🧙🏼'
const MOVES = ['🔼', '⬅️', '➡️', '🔄'] // '⏫', 
const ROWS = 5
const COLS = 5
const NUM_TRIES = 6
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
        this.tiles = TILES
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
        if (pos.x >= 0 && pos.x < COLS && pos.y < ROWS && pos.y >= 0) this.known[pos.y][pos.x] = true
    }
    // reveal a horizontal line of tiles
    // assumes points share a coordinate
    revealLine(pos1, pos2) {
        // this.hideBoard()
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
        if (intervalNum === NUM_MOVES) {
            clearInterval(intervalID)
            G.reset()
            // check if the player won
            if (G.tiles[G.pos.y][G.pos.x] != '⚫') tryNum++
            currentMove = 0
            displayMoves()
            intervalNum = 0
        }
        else {
            let move = moves[intervalNum]
            // colour the used moves accordingly
            let element = document.getElementById(`input${tryNum}:${intervalNum}`)
            if (move === SOLUTION[intervalNum]) element.className += " green"
            else if (SOLUTION.includes(move)) element.className += " yellow"
            else element.className += " gray"
            switch (move) {
                case MOVES[0]: G.advance(); break
                case MOVES[1]: G.turn(3); break
                case MOVES[2]: G.turn(1); break
                case MOVES[3]: G.turn(2); break
            }
            intervalNum++ 
        }  
    }


    // add magnitude m in direction dir to position
    // add(m:number, dir:number, pos:{x, y}): {x, y}
    static add(m, dir, pos) {
        // console.log(m, dir, pos)
        switch (dir) {
            default: return {x:pos.x, y:pos.y - m}
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
        if (this.inBounds(newPos)) {
            if (this.tiles[newPos.y][newPos.x] != '🟦') this.pos = newPos
            if (this.tiles[this.pos.y][this.pos.x] == '⚫') gameOver(true)
        } 
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
        this.revealLine(this.pos, GameBoard.add(2, this.dir, this.pos))
        this.display()
    }
    reset() {
        this.pos = {x:0, y:0}
        this.dir = 0
    }
}




let puzzle = document.getElementById("puzzle")
let moveListEl = document.getElementById("movesList")
let moveInputEl = document.getElementById("movesInput")
let intervalID
let intervalNum = 0

let G = new GameBoard()
// populate the selectable moves
for (let i = 0; i < MOVES.length; i++) moveListEl.innerHTML += `<div class="move" onclick="addMove(event)">${MOVES[i]}</div>`
// create an array that tracks the moves taken
let moveInput = Array(NUM_TRIES)
for (let i = 0; i < NUM_TRIES; i++) {
    moveInput[i] = Array(NUM_MOVES)
    for (let j = 0; j < NUM_MOVES; j++) moveInput[i][j] = BLANK
}
let tryNum = 0
let currentMove = 0

G.display()
displayMoves()

// called when the user attempts to add another move to the list
function addMove(event) {
    // check if the number of moves has been exceeded
    if (currentMove < NUM_MOVES) {
        moveInput[tryNum][currentMove] = event.target.innerHTML
        // set currentMove to the next blank move
        while (moveInput[tryNum][currentMove] != BLANK && currentMove < NUM_MOVES) currentMove++
    }
    displayMoves()
}

// deletes the move that was clicked
function removeMove(event) {
    // find the position that was clicked
    let position = event.target.className.substring(11).split(":")
    let tryNum = position[0]
    let moveNum = position[1]
    // delete the move at this spot
    moveInput[tryNum][moveNum] = BLANK
    // set the current move to the lowest empty spot (or leave it there)
    currentMove = (currentMove > moveNum)? moveNum : currentMove
    // update moves
    displayMoves()
}

// attempts to execute the moves
function tryMoves() {
    if (currentMove === NUM_MOVES) {
        // do the first move immediately
        G.executeMoves(moveInput[tryNum])
        // do the remaining moves once a second
        intervalID = setInterval(G.executeMoves, 500, moveInput[tryNum])
    } else invalidInput()
}

// updates the displayed move list
function displayMoves() {
    // display the list of all moves except the empty ones
    // update the last try
    if (tryNum > 0) {
        let usedMoves = moveInputEl.children[tryNum - 1]
        usedMoves.className += " used-try"
    }
    // the current try
    let moves = moveInputEl.children[tryNum]
    let addDiv = moves == null
    if (addDiv) moveInputEl.innerHTML += `<div class="inputList flex-container">`
    moves = moveInputEl.children[tryNum]
    let output = ""
    for (let j = 0; j < NUM_MOVES; j++) output += `<div ${(moveInput[tryNum][j] != BLANK)? `id="input${tryNum}:${j}" class="input" onclick="removeMove(event)"` : ""}>${moveInput[tryNum][j]}</div>`
    moves.innerHTML = output
    if (addDiv) moveInputEl.innerHTML += `</div>`
}

function gameOver(victory) {
    G.revealBoard()
    if (victory) {
        document.getElementById("game").className += " gameOver"
    }
}


// shows that the given input was not valid
function invalidInput() {
    console.error("you didnt implement invalidInput")
}

// G.revealBoard()











