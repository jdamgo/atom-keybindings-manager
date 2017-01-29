
// Keybinding Modification = { action, package, selector, command, keystrokes, priority }


const path = require("path")


const PACKAGE_NAME = "keybindings-manager"
const PACKAGE_PATH = atom.packages.resolvePackagePath(PACKAGE_NAME)


const selectorTools = require(path.join(PACKAGE_PATH, "lib/atom/clear-cut"))


module.exports.error = function(err, ...args) {
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
    if (args.length)
      console.error(...args)
    throw err
  }
  console.error(message, ...args.slice(0, argsCount))
  throw err
}

module.exports.validateAndNormalizeModification = function(mod) {
  // validate action [required]
  mod.action || this.error(new Error("modification action required"))
  const VALID_ACTIONS = ["add", "remove", "change"]
  if (VALID_ACTIONS.indexOf(mod.action) < 0)
    this.error(new RangeError("modification action unknown"), mod.action, VALID_ACTIONS)

  // validate & normalize package [required]
  mod.package || this.error(new Error("modification source package required"))
  // TODO skip modification id package is not loaded (eg. return a string "skip/package", because the reason for skipping is the package argument)
  if (mod.package !== PACKAGE_NAME) // NOTE DEBUG (only for testing)
    if (atom.packages.isPackageLoaded(mod.package))
      this.error(new RangeError("modification source package not loaded"), mod.package, "any loaded package")
  mod.package = atom.packages.resolvePackagePath(mod.package)

  // validate selector [required]
  mod.selector || this.error(new Error("modification source selector required"))
  if (!selectorTools.isSelectorValid(mod.selector)) {
    let err = new SyntaxError("modification source selector not valid")
    err.code = "EBADSELECTOR"
    this.error(err, mod.selector, "see documentation")
  }

  // validate command [required]
  mod.command || this.error(new Error("modification source command required"))
  if (!/[a-z-]+:[a-z-]+/.test(mod.command))
    this.error(new SyntaxError("modification source command format not valid"), mod.command, "[scope]:[action] with only lowercase letters and hyphens")

  // validate & normalize keystrokes [required]
  mod.keystrokes || this.error(new Error("modification source keystroke string required"))
  // TODO path
  let keystrokeNormalizerModulePath = `${PACKAGE_PATH}/lib/atom/keymap-helpers`
  mod.keystrokes = require(keystrokeNormalizerModulePath).normalizeKeystrokes(mod.keystrokes)
  if (!mod.keystrokes)
    this.error(new SyntaxError("modification source keystroke string not valid"), mod.keystrokes, "see documentation")

  // validate priority [optional = 0]
  if (mod.priority == null)
    mod.priority = 0
  else if (mod.priority < 0 || mod.priority % 1)
    this.error(new RangeError("modification source priority not valid"), mod.priority, "integer >= 0")

  return mod
}
