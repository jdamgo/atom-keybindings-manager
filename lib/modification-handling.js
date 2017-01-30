// NOTE BOF

/* ********** ********** Imports ********** ********** */

/* ***** Node.js ***** */
const path = require("path")
const fs = require("fs")

/* ***** Internal ***** */
const error = require("./error")
const selectorTools = require("./atom/clear-cut")
const keystrokeTools = require("./atom/keymap-helpers")


/* ********** ********** Internal Functions ********** ********** */

function validateAndNormalizeModification(mod) {
  // validate action [required]
  mod.action || error(new Error("modification action required"))
  const VALID_ACTIONS = ["add", "remove", "change"]
  if (VALID_ACTIONS.indexOf(mod.action) < 0)
    error(new RangeError("modification action unknown"), mod.action, VALID_ACTIONS)

  // validate & normalize package [required]
  mod.package || error(new Error("modification source package required"))
  if (mod.package === "core") {
    let regex = path.join(`/atom/app-${atom.getVersion()}/resources/app.asar/`)
    regex = regex.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
    mod.source = path.join(module.parent.parent.filename.match(new RegExp(`^.*?${regex}`))[0])
  } else {
    if (mod.package !== "keybindings-manager")   // NOTE DEBUG just for testing
      if (!atom.packages.isPackageLoaded(mod.package)) {
        if (!atom.packages.getAvailablePackageNames().indexOf(mod.package))
          error(new RangeError("modification source package not available"), mod.package, "any available package")

        console.warn("modification source package not loaded", mod.package)
        return "skip/package"
      }
    mod.source = atom.packages.resolvePackagePath(mod.package)
  }

  // validate selector [required]
  mod.selector || error(new Error("modification source selector required"))
  if (!selectorTools.isSelectorValid(mod.selector)) {
    let err = new SyntaxError("modification source selector not valid")
    err.code = "EBADSELECTOR"
    error(err, mod.selector)
  }

  // validate command [required]
  mod.command || error(new Error("modification source command required"))
  if ((!/[a-z-]+:[a-z-]+/.test(mod.command) && mod.command !== "native!") || (mod.command === "native!" && mod.action === "add"))
    error(new SyntaxError("modification source command format not valid"), mod.command)

  // validate & normalize keystrokes [required]
  mod.keystrokes || error(new Error("modification source keystroke string required"))
  mod.keystrokes = keystrokeTools.normalizeKeystrokes(mod.keystrokes)
  if (!mod.keystrokes)
    error(new SyntaxError("modification source keystroke string not valid"), mod.keystrokes)

  // validate priority [optional = 0]
  if (mod.priority == null)
    mod.priority = 0
  else if (mod.priority < 0 || mod.priority % 1)
    error(new RangeError("modification source priority not valid"), mod.priority, "integer >= 0")

  return mod
}


/* ********** ********** Module Functions ********** ********** */

function handleModification(modification) {
  modification = validateAndNormalizeModification(modification)
  if (typeof modification === "string")
    if (modification.startsWith("skip"))
      return
    else
      throw `unhandled return '${modification}' from function ${validateAndNormalizeModification.name}`

  // BUG after findKeyBindings the indices do not match any more!!!
  let bindings = atom.keymaps.findKeyBindings({ keystrokes: modification.keystrokes, command: modification.command })
      .map((b, index) => {
        let filterReturn
        // FIXME Error: Uncaught (in promise) Error: ENOENT, keymaps\win32.cson not found in C:\Users\kilia\AppData\Local\atom\app-1.13.1\resources\app.asar
        if (modification.package === "core")
          filterReturn = b.source.startsWith(modification.source)
        else
          filterReturn = fs.realpathSync(b.source).startsWith(modification.source)
        if (filterReturn && modification.selector === b.selector)
          return index
        return null
      }).filter(e => typeof e === "number")

  if (modification.action === "remove") {
    if (bindings.length !== 1)
      error(new Error("keybinding cannot be uniquely identified"), modification, bindings)
      // BUG .index property does not change after slice -> messing up index value
    let removedElement = atom.keymaps.keyBindings.splice(bindings[0], 1)
    console.log("---REMOVED", removedElement) // NOTE DEBUG console.log

  } else if (modification.action === "add") {
    if (bindings.length)
      error(new Error("one or more commands with the specified binding arguments already exist"), bindings)
    atom.keymaps.add(
        modification.source,
        { [modification.selector]: { [modification.keystrokes]: modification.command } },
        modification.priority)
    console.log("+++ADDED", modification) // NOTE DEBUG console.log

  } else {
    // TODO implement change action
    console.error("action not implemented yet")
  }
}

module.exports = handleModification
