
/*  
    -----------------------------------------------------------
    DATA
    -----------------------------------------------------------
    - Character indicates what the variable is associated with
        - i: Input (parameter)
        - p: Puzzle
        - v: solVe since s usually indicates static
        - e: HTML Element
        - h: helper (since I don't know what else to put)
        - o: output
        - c: constant
        - (none): local variable
*/

/*
    CONSTANTS
*/
// Constants that would be supplied as part of an object
// if this were an actual project
// NOTE: THESE AREN'T ACTUALLY SUPPOSED TO EXIST
const TILES = [ 
    ['❎','⬜','⬜','⬜','⬜'],
    ['⬜','🟦','⬜','⬜','⬜'],
    ['⬜','🟦','⚫','⬜','⬜'],
    ['⬜','🟦','🟦','🟦','⬜'],
    ['⬜','⬜','⬜','⬜','⬜'] 
]
const SOLUTION = ['➡️', '🔼', '🔼', '➡️', '⏫']
const POSITION = {x:0, y:0}
const DIRECTION = 0
const MOVES = ['🔼', '⏫', '⬅️', '➡️', '🔄']

// Constants that are actually constant
const c_Tileset = {BLANK:'⬜', WALL:'🟦', START:'❎', END:'⚫', UNKNOWN:'❔'}
const c_Character = '🧙🏼'
const c_ViewDist = 2

/*
    VARIABLES
*/

// Variables involving the puzzle
// puzzle = p
let p_Known // tracks  tiles the player has revealed
let p_Tiles // actual game board
let p_Sol // simplest solution to the above board
let p_Pos // character's current position
let p_Dir // direction character is facing
let p_Rows
let p_Cols
let p_MaxTries = 6 // number of tries the player gets
let p_MaxMoves = 5 // number of moves per try; no more, no less

// HTML elements to update the page with
// element = e
let e_Puzzle = document.getElementById("puzzle") // actual board that the puzzle is displayed as
let e_MoveInput = document.getElementById("movesInput") // list of moves the user has taken/plans to take
let e_MoveList = document.getElementById("movesList") // list of moves the user can try to make
let e_GoButton = document.getElementById("goButton") // button that makes the character do the moves

// Variables related to solving the puzzle
// solVe = v
let v_MoveInput // array representation of e_MoveInput
let v_TryNum = 0 // the index of v_MoveInput
let v_CurrentMove = 0 // the move being attempted in v_MoveInput[v_TryNum]

// Variables used to stop the program under certain circumstances
// h for help since I don't know what else to put
let h_IntervalID
let h_IntervalNum = 0 // stops the interval after exceeding some value
let h_CanEdit = true // prevents the user from screwing things up when something is happening

// the results that will be copied to clipboard
// output = o
let o_Results

/*  
    ------------------------------------------------------------
    FUNCTIONS
    ------------------------------------------------------------    
*/

/*
    FUNCTIONS THAT OPRATE ON THE PUZZLE
*/

// Initializes the variables that the puzzle directly involves
// Parameters:
//      i_Tiles: the puzzle board
//      i_Sol: the solution to the puzzle
//      i_Pos: the starting position of the character
//      i_Dir: the starting direction of the character
function createBoard(i_Tiles, i_Sol, i_Pos, i_Dir) {
    p_Tiles = i_Tiles
    p_Sol = i_Sol
    p_Pos = i_Pos
    p_Dir = i_Dir
    p_Rows = p_Tiles.length
    p_Cols = p_Tiles[0].length
    // initialize p_Known to be entirely false
    p_Known = Array(p_Rows)
    for (let y = 0; y < p_Rows; y++) {
        p_Known[y] = Array(p_Cols)
        for (let x = 0; x < p_Cols; x++) p_Known[y][x] = false
    }
    // reveal the tiles the character should be able to see
    revealADJ(p_Pos)
    revealLine(p_Pos, add(c_ViewDist, p_Dir, p_Pos))
    // populate the selectable moves
    for (let i = 0; i < MOVES.length; i++) {
        e_MoveList.innerHTML += 
            `<div class="move" onclick="addMove(event)">` +
                MOVES[i] +
            `</div>`
    }
    // create an array that tracks the moves taken
    v_MoveInput = Array(p_MaxTries)
    for (let i = 0; i < p_MaxTries; i++) {
        v_MoveInput[i] = Array(p_MaxMoves)
        for (let j = 0; j < p_MaxMoves; j++) 
            v_MoveInput[i][j] = c_Tileset.BLANK
    }
    displayPuzzle()
    displayMoves()
}

// Called when the page is loaded
// Automatically provides the parameters for createBoard
function createTodaysBoard() {
    createBoard(TILES, SOLUTION, POSITION, DIRECTION)
}

// Reveal the given tile
// Parameters:
//     i_Pos: the position to be revealed
function reveal(i_Pos) {
    if (inBounds(i_Pos)) 
        p_Known[i_Pos.y][i_Pos.x] = true
}

// Reveals all tiles from i_Pos1 to i_Pos2, inclusive
// Precondition:
//      i_Pos1 and i_Pos2 share their x coordinate OR their y coordinate
// Parameters: 
//      i_Pos1: start position
//      i_Pos2: end position
function revealLine(i_Pos1, i_Pos2) {
    // x is same
    if (i_Pos1.x === i_Pos2.x)
        for (let y = i_Pos1.y; y <= i_Pos2.y; y++)
            reveal({x:i_Pos1.x, y:y})
    // y is same
    else
        for (let x = i_Pos1.x; x <= i_Pos2.x; x++)
            reveal({x:x, y:i_Pos1.y})
}

// Reveals the given tile and all tiles directly orthogonally adjacent to it
// Parameters:
//      i_Pos: the position to be revealed
function revealADJ(i_Pos) {
    let x = i_Pos.x
    let y = i_Pos.y
    reveal({x:x, y:y})
    reveal({x:x+1, y:y})
    reveal({x:x-1, y:y})
    reveal({x:x, y:y+1})
    reveal({x:x, y:y-1})
}

// Does all of the moves at the current index (v_TryNum) of movesList
// Precondition:
//      movesList is filled with moves
// Parameters:
//      moves: string[], a list of moves for the character to make
function executeMoves(i_Moves) {
    let move = i_Moves[h_IntervalNum]
    // colour the used moves accordingly
    let element = document.getElementById(`input${v_TryNum}:${h_IntervalNum}`)
    // add a class to the element to colour it properly
    if (move === p_Sol[h_IntervalNum]) 
        element.className += " green"
    else if (p_Sol.includes(move)) 
        element.className += " yellow"
    else 
        element.className += " gray"
    // do the move
    let cont = true
    switch (move) {
        case MOVES[0]: advance(1); break
        case MOVES[1]: while(cont) cont = advance(1); break
        case MOVES[2]: turn(3); break
        case MOVES[3]: turn(1); break
        case MOVES[4]: turn(2); break
    }
    h_IntervalNum++ 
    // If the last move has been done
    if (h_IntervalNum === p_MaxMoves) {
        // stop executing moves
        clearInterval(h_IntervalID)
        v_TryNum++
        // check for win
        if (p_Tiles[p_Pos.y][p_Pos.x] === c_Tileset.END)
            gameOver(true)
        // check for lose
        else if (v_TryNum >= p_MaxTries) 
            gameOver(false)
        else {
            // allow the user to add/delete moves
            h_CanEdit = true
            // Reset everything but v_TryNum and p_Known
            reset()
            h_IntervalNum = 0
            v_CurrentMove = 0
            // Update the whole page
            e_GoButton.className = ""
            displayPuzzle()
            displayMoves()
        }
    }
}

// Vector2 addition
// Parameters: 
//      i_Mag: Number, magnitude
//      i_Dir: Number, direction (0, 1, 2, 3 = N, E, S, W)
//      i_Pos: Object{x, y}, starting position
// Returns: Object{x, y}, i_Mag distance in i_Dir direction from i_Pos position
function add(i_Mag, i_Dir, i_Pos) {
    switch (i_Dir) {
        default: return {x:i_Pos.x, y:i_Pos.y - i_Mag}
        case 1: return {x:i_Pos.x + i_Mag, y:i_Pos.y}
        case 2: return {x:i_Pos.x, y:i_Pos.y + i_Mag}
        case 3: return {x:i_Pos.x - i_Mag, y:i_Pos.y}
    }
}

// Check if this position is within the bounds of the board
// Parameters:
//      i_Pos: Object{x, y}, position
function inBounds(i_Pos) {
    return  (i_Pos.x >= 0 && i_Pos.x < p_Cols) && 
            (i_Pos.y >= 0 && i_Pos.y < p_Rows)
}

// Advance the character's position by distance
// Parameters:
//      i_Distance: Number, the distance to advance
// Returns: boolean, did it succesfully advance
function advance(i_Distance) {
    let newPos = add(i_Distance, p_Dir, p_Pos)
    // move the character if possible
    if (!inBounds(newPos) || p_Tiles[newPos.y][newPos.x] === c_Tileset.WALL) 
        return false
    p_Pos = newPos
    // reveal c_ViewDist tiles ahead
    reveal(add(c_ViewDist, p_Dir, {x:p_Pos.x, y:p_Pos.y}))
    displayPuzzle()
    return true
}
// turns the character
// +1 is clockwise, +3 is counter-clockwise, and 2 is 180deg

function turn(i_Direction) {
    p_Dir = (p_Dir + i_Direction) % 4
    revealLine(p_Pos, add(2, p_Dir, p_Pos))
    displayPuzzle()
}
// return the board to its original state
function reset() {
    p_Pos = POSITION
    p_Dir = DIRECTION
}

/*
    FUNCTIONS THAT INTERACT WITH THE HTML
*/

// called when the user attempts to add another move to the list
function addMove(event) {
    if (!h_CanEdit) return
    // check if the number of moves has been exceeded
    if (v_CurrentMove < p_MaxMoves) {
        v_MoveInput[v_TryNum][v_CurrentMove] = event.target.innerHTML
        // set v_CurrentMove to the next blank move
        while (v_MoveInput[v_TryNum][v_CurrentMove] != c_Tileset.BLANK && v_CurrentMove < p_MaxMoves) 
            v_CurrentMove++
        // update the go button
        // if the correct number of moves are being supplied
        if (v_CurrentMove == p_MaxMoves) 
            e_GoButton.className = "canGo"
    }
    displayMoves()
}

// deletes the move that was clicked
function removeMove(event) {
    if (!h_CanEdit) 
        return
    // find the position that was clicked
    let position = event.target.id.split(":")
    let tryNumber = Number(position[0].substring("input".length))
    let moveNum = Number(position[1])
    if (tryNumber === v_TryNum) {
        // delete the move at this spot
        v_MoveInput[v_TryNum][moveNum] = c_Tileset.BLANK
        // set the current move to the lowest empty spot (or leave it there)
        v_CurrentMove = (v_CurrentMove > moveNum)? moveNum : v_CurrentMove
        // update the go button
        e_GoButton.className = ""
        // update moves
        displayMoves()
    }
}


// attempts to execute the moves
function tryMoves() {
    // if a process is occuring, do nothing
    if (!h_CanEdit)
        return
    // if the requisite number of moves is given
    if (v_CurrentMove === p_MaxMoves) {
        // do the first move immediately
        executeMoves(v_MoveInput[v_TryNum])
        h_CanEdit = false
        // do the remaining moves once a second
        h_IntervalID = setInterval(executeMoves, 500, v_MoveInput[v_TryNum])
    } 
}

// updates the displayed move list
function displayMoves() {
    // displayPuzzle the list of all moves except the empty ones
    // update the last try
    if (v_TryNum > 0) {
        let usedMoves = e_MoveInput.children[v_TryNum - 1]
        usedMoves.className += " used-try"
    }
    if (p_Tiles[p_Pos.y][p_Pos.x] === c_Tileset.END) 
        return
    // the current try
    let moves = e_MoveInput.children[v_TryNum]
    // check if we need to make a new set of moves
    let addDiv = moves == null
    if (addDiv) e_MoveInput.innerHTML += 
        `<div class="inputList flex-container">`
    moves = e_MoveInput.children[v_TryNum]
    // generate the list of moves to be displayed
    let output = ""
    for (let j = 0; j < p_MaxMoves; j++) 
        output += 
            `<div${(v_MoveInput[v_TryNum][j] != c_Tileset.BLANK)? // check if the tile is blank
                ` id="input${v_TryNum}:${j}" class="input" onclick="removeMove(event)"` : 
                (j === v_CurrentMove)? // check if the move is the current move
                    ` class="currentInput"` : ""}>
                ${v_MoveInput[v_TryNum][j]}
            </div>`
    moves.innerHTML = output
    if (addDiv) 
        e_MoveInput.innerHTML += 
        `</div>`
}

// Updates the puzzle HTML with the changed data
function displayPuzzle() {
    let output = ""
    for (let y = 0; y < p_Rows; y++) {
        output += `<tr class="puzzle-row flex-container">`
        // checks if the player is on this tile and adds classes so the browser displays the character
        for (let x = 0; x < p_Cols; x++) 
            output +=   `<td class="puzzle-data
                            ${(p_Pos.x == x && p_Pos.y == y)? " charLocation rotate" + p_Dir : ""}">
                            ${(p_Known[y][x] === true) ? p_Tiles[y][x] : c_Tileset.UNKNOWN}
                        </td>`
        output += `</tr>`
    }
    e_Puzzle.innerHTML = output
}

// Reveals all tiles
function revealBoard() {
    // set everything in p_Known to true
    for (let y = 0; y < p_Cols; y++) 
        for (let x = 0; x < p_Rows; x++) 
            p_Known[y][x] = true
    displayPuzzle()
}

// Prevents the user from further interacting with the puzzle
// Allows the user to see and copy their results (via copyResults)
// Displays
//      You (found the exit! / didn't escape.)
//      Escaple (dd/mm/yy)
//      ⬛🟨⬛🟩🟨🟨 (for example)
//      🟩🟨🟨🟩🟩🟨
//      🟩🟩🟩🟩🟩🟩
// Parameters:
//      victory: boolean, indicates whether the game ended due to a win or a loss
function gameOver(victory) {
    revealBoard()
    let game = document.getElementById("game")
    // tag the game as being won
    game.className += " gameOver"
    let output = `<div class="endCard flex-container flex-down justify-center">`
    // send appropriate message
    if (victory) 
        output +=   "<div>You found the exit!</div>"
    else 
        output +=   "<div>You didn't escape.</div>"
    // get the date as dd/mm/yy
    const TD = new Date()
    let dd = TD.getDate()
    let mm = TD.getMonth()
    let yy = TD.getFullYear() % 100
    let today = `Escaple ${(dd < 10)? '0' + dd : dd}/${(mm < 10)? '0' + mm : mm}/${yy}`
    // add that to results so it can be copied
    o_Results = today + "\n"
    output +=       `<div>Your results:</div>` + 
                    `<div class="results" onclick="copyResults()">` + 
                        `<div>` +
                            today +
                        `</div>`
    // add the colours of your moves (but not the actual moves) so others 
    // can see how you did without getting the answer spoiled
    for (let i = 0; i < v_TryNum; i++) {
        output +=           "<div>"
        for (let j = 0; j < p_MaxMoves; j++) {
            let move = v_MoveInput[i][j]
            // find the colour
            let col = function () {
                if (move === p_Sol[j]) 
                    return '🟩'
                else if (p_Sol.includes(move)) 
                    return '🟨'
                else 
                    return '⬛'
            }
            // add it to the outputs
            output += col()
            o_Results += col()
        }
        output +=           "</div>"
        o_Results += "\n"
    }
    console.log(output)
    game.innerHTML +=       `${output}</div>
                        </div>`
}

// Copies the results of the puzzle to your clipboard
function copyResults() {
    navigator.clipboard.writeText(o_Results)
}