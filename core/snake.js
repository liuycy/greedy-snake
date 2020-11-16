const screen = require('./screen')

let snake = {
  length: 5,
  head: { x: 0, y: 0 },
  body: [],
  direction: 'right',
}

let wall = {
  width: 0,
  height: 0,
}

const SNAKE_HEAD = '۞'
const SNAKE_BODY = '○'
exports.SNAKE_HEAD = SNAKE_HEAD
exports.SNAKE_BODY = SNAKE_BODY

function initFrame(width, height) {
  wall.width = width
  wall.height = height

  let x = ~~((width - snake.length) * Math.random()) + snake.length
  let y = ~~((height - snake.length) * Math.random()) + snake.length
  let head = { x, y }

  snake.head = head
  snake.body.push(head)

  if (y < height / 2) snake.direction = 'down'
  else if (x < width / 2) snake.direction = 'right'
  else snake.direction = 'up'

  for (let i = 1; i < snake.length; i++) {
    head = tail(head)
    snake.body.push(head)
  }
}

function drawFrame() {
  let dots = []
  for (let col = 0; col < wall.height; col++) {
    dots[col] = new Array(wall.width).fill(' ')
  }

  let nextBody = []
  let head = next(snake.body[0])
  nextBody.push(head)
  dots[head.y][head.x] = SNAKE_HEAD
  for (let i = 1; i < snake.length; i++) {
    let body = snake.body[i - 1]
    dots[body.y][body.x] = SNAKE_BODY
    nextBody.push(body)
  }

  screen.draw(dots)
  snake.body = nextBody
  snake.head = snake.body[0]
}

function tail({ x, y }) {
  if (snake.direction === 'left') return { x: x + 1, y }
  if (snake.direction === 'right') return { x: x - 1, y }
  if (snake.direction === 'up') return { x, y: y + 1 }
  if (snake.direction === 'down') return { x, y: y - 1 }
}

function next({ x, y }) {
  if (snake.direction === 'left') return { x: x - 1, y }
  if (snake.direction === 'right') return { x: x + 1, y }
  if (snake.direction === 'up') return { x, y: y - 1 }
  if (snake.direction === 'down') return { x, y: y + 1 }
}

exports.trunTo = turnTo
function turnTo(direction) {
  snake.direction = direction
}

exports.init = function (width = 50, height = 30) {
  screen.init({ width, height })
  initFrame(width, height)

  drawFrame()
  start()
  process.on('SIGINT', stop)
}

let timer
let interval = 1000
exports.interval = interval

function stop() {
  clearInterval(timer)
}

function start() {
  timer = setInterval(() => {
    drawFrame()
  }, interval)
}
