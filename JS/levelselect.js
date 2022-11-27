const levelContainer = document.querySelector(".level-container")
let scrollAmount = 0
let dayNum = 1
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
const DAYS = [31, 28, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31]
let date = new Date()
const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24

function load() {
    let output = ""
    for (let i = 0; i < 73; i++) {
        output += `<div class="level-row flex-container">`
        for (let j = 0; j < 5; j++) {
            date.setTime(date.getTime() - MILISECONDS_IN_DAY)
            let year = date.getFullYear()
            let month = date.getMonth()
            let day = date.getDate()
            let hue = Math.floor((month - 1) * 30)
            output += `<div class="level" style="background-color: hsl(${hue},50%,50%); color:hsl(${hue},50%,75%)">${MONTHS[month]} ${day}, ${year}</div>`
        }
        output += `</div>`
    }
    levelContainer.innerHTML = output
}

function levelScroll() {
    console.log(levelContainer.scrollTop)
}
