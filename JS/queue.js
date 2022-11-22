class Queue {
    Queue() {
        this.nodes = new Array()
        this.front = 0
        this.back = 0
    }
    enqueue(x) {
        this.nodes[this.back] = x
        this.back++
    }
    dequeue() {
        data = this.peek()
        delete this.nodes[this.front]
        this.front++
        return data
    }
    peek() {
        return this.nodes[this.front]
    }
    length() {
        return this.back - this.front
    }
    isEmpty() {
        return this.length === 0
    }
}