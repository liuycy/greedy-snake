const readline = require('readline')
const MuteStream = require('mute-stream')

const output = new MuteStream()
output.pipe(process.stdout)
output.mute()

const rl = readline.createInterface({
  input: process.stdin,
  output,
})

exports.on = function (handler) {
  rl.input.on('keypress', (_, event) => {
    handler(event.name)
  })
}
