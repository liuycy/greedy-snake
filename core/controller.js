const readline = require('readline')

// 方案一
// const MuteStream = require('mute-stream')

// const output = new MuteStream()
// output.pipe(process.stdout)
// output.mute()

// const rl = readline.createInterface({
//   input: process.stdin,
//   output,
// })

// exports.on = function (handler) {
//   rl.input.on('keypress', (_, event) => {
//     handler(event.name)
//   })
// }

// 方案二
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
exports.on = function (handler) {
  process.stdin.on('keypress', (_, event) => {
    handler(event.name)
  })
}
