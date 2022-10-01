
const hammer = document.querySelector(".hammer")



let time = 0;

setInterval(move, 16) // call move ~60 times a second

function move() {
    let angle = f(time)
    hammer.style.transform = `rotate(${angle}deg)`
    time++
    if (time >= 90)
        time = 0
}

function f(x) {
    let t
    const DUR = 60
    if (x < DUR) {
        t = smooth(x / DUR)
        y = l(t, 0, 120)
        return y
    } else {
        t = smoothstart((x - DUR) / (90 - DUR))
        y = l(t, 120, 0)
        return y
    }
}

function smooth(x) {
    return x * x * (3 - 2 * x)
}

function smoothstart(x) {
    return x * x
}

function smoothend(x) {
    return 1 - ((1 - x) * (1 - x))
}

function l(t, start, end) {
    return start + t * (end - start)
}