// a bunch of constants, many of which I never used
// lots of these constants should actually be variables / parameters
// bad practice but works = good
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



// This class references itself using a global variable instead of this because it wouldn't work without it
// working with this language strongly suggests the absence of one, but
// if there is a god, im not convinced he could even tell you why
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
        // if we are past the last move
        if (intervalNum === NUM_MOVES) {
            canEditMoves = true
            clearInterval(intervalID)
            tryNum++
            if (tryNum > NUM_TRIES) gameOver(false)
            displayMoves()
            G.reset()
            currentMove = 0
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

// Variables that change

// HTML elements
// the actual board that the puzzle is displayed as
let puzzle = document.getElementById("puzzle")
// I'm pretty sure I mixed up the movelist and moveInput elements at some point and it just stuck
// the list of moves the user has taken/plans to take
let moveInputEl = document.getElementById("movesInput")
// the list of moves the user can
let moveListEl = document.getElementById("movesList")
let goButtonEl = document.getElementById("goButton")
// the game board to be operated on
let G = new GameBoard()
// populate the selectable moves
for (let i = 0; i < MOVES.length; i++) moveListEl.innerHTML += `<div class="move" onclick="addMove(event)">${MOVES[i]}</div>`
// create an array that tracks the moves taken
let moveInput = Array(NUM_TRIES)
for (let i = 0; i < NUM_TRIES; i++) {
    moveInput[i] = Array(NUM_MOVES)
    for (let j = 0; j < NUM_MOVES; j++) moveInput[i][j] = BLANK
}
// variables to track when to stop an interval from running
let intervalID
let intervalNum = 0
// tracks the position in the moveInput element
let tryNum = 0
let currentMove = 0

let canEditMoves = true

G.display()
displayMoves()

// called when the user attempts to add another move to the list
function addMove(event) {
    if (!canEditMoves) return
    // check if the number of moves has been exceeded
    if (currentMove < NUM_MOVES) {
        moveInput[tryNum][currentMove] = event.target.innerHTML
        // set currentMove to the next blank move
        while (moveInput[tryNum][currentMove] != BLANK && currentMove < NUM_MOVES) currentMove++
        // update the go button
        if (currentMove == NUM_MOVES && function () {
            for (let i = 0; i < tryNum; i++) for (let j = 0; j < NUM_MOVES; j++) if (moveInput[i][j] != moveInput[tryNum][j]) return false
            return true
        }) goButtonEl.className = "canGo"
    }
    displayMoves()
}

// deletes the move that was clicked
function removeMove(event) {
    if (!canEditMoves) return
    // find the position that was clicked
    let position = event.target.id.split(":")
    let tryNumber = Number(position[0].substring("input".length))
    let moveNum = Number(position[1])
    if (tryNumber === tryNum) {
        // delete the move at this spot
        moveInput[tryNum][moveNum] = BLANK
        // set the current move to the lowest empty spot (or leave it there)
        currentMove = (currentMove > moveNum)? moveNum : currentMove
        // update the go button
        goButtonEl.className = ""
        // update moves
        displayMoves()
    }
}


// attempts to execute the moves
function tryMoves() {
    if (currentMove === NUM_MOVES) {
        // do the first move immediately
        G.executeMoves(moveInput[tryNum])
        canEditMoves = false
        // do the remaining moves once a second
        intervalID = setInterval(G.executeMoves, 500, moveInput[tryNum])
    } 
    // else invalidInput()
}

// updates the displayed move list
function displayMoves() {
    // display the list of all moves except the empty ones
    // update the last try
    if (tryNum > 0) {
        let usedMoves = moveInputEl.children[tryNum - 1]
        usedMoves.className += " used-try"
    }
    if (G.tiles[G.pos.y][G.pos.x] === '⚫') return
    // the current try
    let moves = moveInputEl.children[tryNum]
    // check if we need to make a new set of moves
    let addDiv = moves == null
    if (addDiv) moveInputEl.innerHTML += `<div class="inputList flex-container">`
    moves = moveInputEl.children[tryNum]
    // generate the list of moves to be displayed
    let output = ""
    for (let j = 0; j < NUM_MOVES; j++) output += `<div ${(moveInput[tryNum][j] != BLANK)? `id="input${tryNum}:${j}" class="input" onclick="removeMove(event)"` : (j === currentMove)? `class="currentInput"` : ""}>${moveInput[tryNum][j]}</div>`
    moves.innerHTML = output
    if (addDiv) moveInputEl.innerHTML += `</div>`
}

let results

// called once the game has ended
// victory = true if the game ended in a win, and false otherwise
function gameOver(victory) {
    G.revealBoard()
    let game = document.getElementById("game")
    // tag the game as being won
    game.className += " gameOver"
    let output = ""
    if (victory) output += "<div>You found the exit!</div>"
    else output += "<div>You didnt escape.</div>"
    const TD = new Date()
    let dd = TD.getDate()
    let mm = TD.getMonth()
    let yyyy = TD.getFullYear()
    let today = `Escaple ${(dd < 10)? '0' + dd : dd}/${(mm < 10)? '0' + mm : mm}/${yyyy}`
    results = today + "\n"
    output += `<div>Your results:</div><div class="results" onclick="getResults()"><div>${today}</div>`
    for (let i = 0; i <= tryNum; i++) {
        output += "<div>"
        for (let j = 0; j < NUM_MOVES; j++) {
            let move = moveInput[i][j]
            let col = function () {
                if (move === SOLUTION[j]) return '🟩'
                else if (SOLUTION.includes(move)) return '🟨'
                return '⬛'
            }
            output += col()
            results += col()
        }
        output += "</div>"
    }
    game.innerHTML += `<div class="endCard flex-container flex-down justify-center">${output}</div></div>`
}

function getResults() {
    navigator.clipboard.writeText(results)
}

// let invalidInputBuffer = 0
// let timeoutID

// // shows that the given input was not valid
// function invalidInput() {
//     let blankMoves = document.querySelectorAll(`.inputList:not(.used-try) div:not(.input)`)
//     if (invalidInputBuffer === 0) {
//         blankMoves.forEach(function (element) {element.className += " invalidInput"})
//     }
//     timeoutID = setTimeout(function () {
//         if (invalidInputBuffer === 1) blankMoves.forEach(function (element) {console.log(element); element.className = (element.className === " invalidInput")? "" : "currentInput"})
//         invalidInputBuffer--
//     }, 1000)
//     if (invalidInputBuffer < 2) invalidInputBuffer++
// }