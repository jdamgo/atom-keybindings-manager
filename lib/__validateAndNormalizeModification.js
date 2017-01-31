/* global error, path */

import ExtendableError from "es6-error"

class ModificationParsingError extends ExtendableError {
  constructor(message, modification) {
    super(`${message}  @ ${modification.package}/${modification.command}[${modification.keystrokes}]`)
  }
}

class MissingPropertyError extends ModificationParsingError {
  constructor(modification, property) {
    super(`Property '${property}' is missing!`, modification)
  }
}

class InvalidPropertyValueError extends ModificationParsingError {
  constructor(modification, property, propertyValue) {
    super(`Property '${property}' has invalid value! ('${propertyValue}')`, modification)
  }
}

function validateModification(mod) { // eslint-disable-line no-unused-vars
  // validate action [required]
  if (!mod.action)
    return new MissingPropertyError(mod, "action")
  const VALID_ACTIONS = ["add", "remove", "change"]
  if (VALID_ACTIONS.indexOf(mod.action) < 0)
    return new InvalidPropertyValueError(mod, "action", mod.action)

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
  if (!validateSelector(mod.selector)) {
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
  mod.keystrokes = validateAndNormalizeKeystrokes(mod.keystrokes)
  if (!mod.keystrokes)
    error(new SyntaxError("modification source keystroke string not valid"), mod.keystrokes)

  // validate priority [optional = 0]
  if (mod.priority == null)
    mod.priority = 0
  else if (mod.priority < 0 || mod.priority % 1)
    error(new RangeError("modification source priority not valid"), mod.priority, "integer >= 0")

  return mod
}
