// NOTE BOF

module.exports = function(err, ...args) {
  let argsCount, message
  switch (err.name) {
  case "RangeError":
    // arguments: invalid value, allowed values
    argsCount = 2
    message = `Value '${args[0]}' not in set or range of allowed values! (${args[1]})`
    break
  case "SyntaxError":
    // arguments: invalid value
    argsCount = 1
    message = `Code '${args[0]}' cannot be interpreted!`
    break
  default:
    console.error(err.message, ...args)
    throw err
  }
  console.error(message, ...args.slice(0, argsCount))
  throw err
}
