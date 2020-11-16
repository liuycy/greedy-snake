const controller = require('./core/controller')
const snake = require('./core/snake')

snake.init()

controller.on((direction) => {
  snake.trunTo(direction)
})