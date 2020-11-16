const ansiEscapes = require('ansi-escapes')

let defaultScreen = process.stdout
exports.defaultScreen = defaultScreen

const config = {
  width: 0,
  height: 0,
  lines: 0,
  withBorder: true,
}

exports.clear = clear
function clear() {
  const { lines } = config

  defaultScreen.write(ansiEscapes.eraseLines(lines))
}

exports.draw = draw
function draw(dots) {
  clear()

  if (config.withBorder)
    defaultScreen.write(`╭${'─'.repeat(config.width).split('').join(' ')}╮\n`)

  let content
  for (let col = 0; col < dots.length; col++) {
    content = dots[col].join(' ')
    if (config.withBorder) content = `│${content}│`
    content += '\n'
    defaultScreen.write(content)
  }

  if (config.withBorder)
    defaultScreen.write(`╰${'─'.repeat(config.width).split('').join(' ')}╯`)
}

exports.init = function ({ width, height, withBorder = true } = {}) {
  config.width = width
  config.height = height
  config.withBorder = withBorder
  config.lines = withBorder ? height + 2 : height
}
