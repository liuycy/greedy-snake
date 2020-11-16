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

const SNAKE_HEAD = '@'
const SNAKE_BODY = '○'
const BIRD_EGG = '●'
exports.SNAKE_HEAD = SNAKE_HEAD
exports.SNAKE_BODY = SNAKE_BODY
exports.BIRD_EGG = BIRD_EGG

let timer
let interval = 500
exports.interval = interval

function stop() {
  clearInterval(timer)
}

function start() {
  timer = setInterval(() => {
    drawFrame()
  }, interval)
}

function gameover() {
  stop()
  screen.clear()
  console.log('GAME OVER !')
  process.exit()
}

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

let prevDots
let egg = null

function drawFrame() {
  let dots = []
  for (let col = 0; col < wall.height; col++) {
    dots[col] = new Array(wall.width).fill(' ')
  }

  let nextBody = []
  let head = next(snake.body[0])
  if (!head) gameover()
  nextBody.push(head)
  if (!dots[head.y]) gameover()
  dots[head.y][head.x] = SNAKE_HEAD
  for (let i = 1; i < snake.length; i++) {
    let body = snake.body[i - 1]
    dots[body.y][body.x] = SNAKE_BODY
    nextBody.push(body)
  }

  if (head.y < 0 || head.y >= wall.height) gameover()
  if (head.x < 0 || head.x >= wall.width) gameover()
  if (dots[head.y][head.x] === SNAKE_BODY) gameover()

  if (prevDots && prevDots[head.y][head.x] === BIRD_EGG) {
    let body = snake.body[snake.length - 1]
    dots[body.y][body.x] = SNAKE_BODY
    nextBody.push(body)
    snake.length += 1
    interval =
      interval > 150
        ? interval - 50
        : interval > 50
        ? interval - 10
        : interval > 50
        ? interval - 5
        : 50
    egg = null
    prevDots = null
  }

  if (!egg) {
    egg = layAEgg()
    while (dots[egg.y][egg.x] !== ' ') {
      egg = layAEgg()
    }
  }
  dots[egg.y][egg.x] = BIRD_EGG

  screen.draw(dots)
  prevDots = dots
  snake.body = nextBody
  snake.head = snake.body[0]
}

function layAEgg() {
  let x = ~~(wall.width * Math.random())
  let y = ~~(wall.height * Math.random())
  return { x, y }
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
  stop()
  snake.direction = direction
  drawFrame()
  start()
}

exports.init = function (width = 50, height = 30) {
  screen.init({ width, height })
  initFrame(width, height)

  drawFrame()
  start()
  process.on('SIGINT', stop)
}
