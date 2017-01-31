"use babel"


/* ********** ********** Imports ********** ********** */

/* *** Node.js (built-in) *** */
import path from "path"

/* *** Project *** */
import { isSelectorValid } from "./atom/clear-cut"
import { normalizeKeystrokes } from "./atom/keymap-helpers"
import { ModificationParsingError, ModificationPackageNotAvailableError } from "./errors"


/* ********** ********** Variables ********** ********** */

const ADD_ACTION = "add"
const CHANGE_ACTION = "change"
const REMOVE_ACTION = "remove"
const ALL_ACTIONS = [ADD_ACTION, CHANGE_ACTION, REMOVE_ACTION]

const CORE_PACKAGE_NAME = "core"
const NATIVE_COMMAND_STRING = "native!"

const ERRCODE = ModificationParsingError.ERRCODE


/* ********** ********** Functions ********** ********** */

function checkModificationProperties(mod) {
  /* *** validate action *** */
  // action property: required
  if (!mod.action) throw new ModificationParsingError(ERRCODE.UNDEFINED, mod, "action")
  if (typeof mod.action !== "string") throw new ModificationParsingError(ERRCODE.TYPE, mod, "action", mod.action)
  // check if known action
  if (ALL_ACTIONS.indexOf(mod.action) < 0)
    throw new ModificationParsingError(ERRCODE.VALUE, mod, "action", mod.action)

  /* *** validate package and set source *** */
  // package property: required
  if (!mod.package) throw new ModificationParsingError(ERRCODE.UNDEFINED, mod, "package")
  if (typeof mod.package !== "string" && !(Array.isArray(mod.package) && mod.package.length === 2))
    throw new ModificationParsingError(ERRCODE.TYPE, mod, "package", mod.package)
  // validate query and change value (if available)
  for (let mpackage of (typeof mod.package !== "string" ? [mod.package] : mod.package)) {
    if (typeof mpackage !== "string") throw new ModificationParsingError(ERRCODE.TYPE, mod, "package", mpackage)
    // check if package is available and set source
    if (mpackage === CORE_PACKAGE_NAME) {
      // core package (special source)
      let regex = path.join(`/atom/app-${atom.getVersion()}/resources/app.asar`)
          // escape regular expression string
          .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      // FIXME parent of parent not pretty and error-prone
      mod.source = path.join(module.parent.parent.filename.match(new RegExp(`^.*?${regex}`))[0])
    } else if (mpackage === "keybindings-manager") {
      // NOTE DEBUG test case
      mod.source = atom.packages.resolvePackagePath(mpackage)
    } else if (!(mod.source = atom.packages.resolvePackagePath(mpackage))) {
      // package not available (might be uninstalled)
      throw new ModificationPackageNotAvailableError(mpackage)
    }
  }

  /* *** validate selector *** */
  // selector property: required
  if (!mod.selector) throw new ModificationParsingError(ERRCODE.UNDEFINED, mod, "selector")
  if (typeof mod.selector !== "string" && !(Array.isArray(mod.selector) && mod.selector.length === 2))
    throw new ModificationParsingError(ERRCODE.TYPE, mod, "selector", mod.selector)
  // validate query and change value (if available)
  for (let selector of (typeof mod.selector !== "string" ? [mod.selector] : mod.selector)) {
    if (typeof selector !== "string") throw new ModificationParsingError(ERRCODE.TYPE, mod, "selector", selector)
    // check if selector string has valid format
    if (!isSelectorValid(selector))
      throw new ModificationParsingError(ERRCODE.SYNTAX, mod, "selector", selector)
  }

  /* *** validate command *** */
  // command property: require
  if (!mod.command) throw new ModificationParsingError(ERRCODE.UNDEFINED, mod, "command")
  if (typeof mod.command !== "string" && !(Array.isArray(mod.command) && mod.command.length === 2))
    throw new ModificationParsingError(ERRCODE.TYPE, mod, "command", mod.command)
  // validate query and change value (if available)
  for (let command of (typeof mod.command !== "string" ? [mod.command] : mod.command)) {
    if (typeof command !== "string") throw new ModificationParsingError(ERRCODE.TYPE, mod, "command", command)
    // check if command string has right format and id trying to add a native command
    if (!/[a-z-]+:[a-z-]+/.test(command) && command !== NATIVE_COMMAND_STRING)
      throw new ModificationParsingError(ERRCODE.SYNTAX, mod, "command", command)
    else if (command === NATIVE_COMMAND_STRING && mod.action === ADD_ACTION)
      throw new ModificationParsingError(ERRCODE.ADD_NATIVE, mod, "command", command) // TODO error type?
  }

  /* *** validate & normalize keystrokes *** */
  // keystrokes property: required
  if (!mod.keystrokes) throw new ModificationParsingError(ERRCODE.UNDEFINED, mod, "keystrokes")
  if (typeof mod.keystrokes !== "string" && !(Array.isArray(mod.keystrokes) && mod.keystrokes.length === 2))
    throw new ModificationParsingError(ERRCODE.TYPE, mod, "keystrokes", mod.keystrokes)
  // validate query and change value (if available)
  for (let keystrokes of (typeof mod.keystrokes !== "string" ? [mod.keystrokes] : mod.keystrokes)) {
    if (typeof keystrokes !== "string") throw new ModificationParsingError(ERRCODE.TYPE, mod, "keystrokes", keystrokes)
    // check if normalization was successful
    keystrokes = normalizeKeystrokes(keystrokes)
    if (!keystrokes)
      throw new ModificationParsingError(ERRCODE.SYNTAX, mod, "keystrokes", keystrokes)
  }

  /* *** validate priority *** */
  // priority property: optional = 0
  mod.priority = mod.priority || 0
  if (typeof mod.priority !== "number" && !(Array.isArray(mod.priority) && mod.priority.length === 2))
    throw new ModificationParsingError(ERRCODE.TYPE, mod, "priority", mod.priority)
  // validate add/change value (if available)
  if (typeof mod.priority !== "number") throw new ModificationParsingError(ERRCODE.TYPE, mod, "priority", mod.priority)
  // check if priority is a positive integer or zero
  if (mod.priority < 0 || mod.priority % 1)
    throw new ModificationParsingError(ERRCODE.VALUE, mod, "priority", mod.priority)
}

export function validateAllModifications(
      // BUG eslint issue
      /* eslint-disable no-unused-vars */
      modifications
      /* eslint-enable no-unused-vars */ // eslint-disable-line lines-around-comment
    ) {
  let catchedErrors = new Map()
  modifications = modifications.filter(mod => {
    try {
      checkModificationProperties(mod)
    } catch (error) {
      if (error instanceof ModificationParsingError)
        if (!catchedErrors.has(ModificationParsingError))
          catchedErrors.set(ModificationParsingError, [error])
        else
          catchedErrors.set(ModificationParsingError).push(error)
      if (error instanceof ModificationPackageNotAvailableError)
        if (!catchedErrors.has(ModificationPackageNotAvailableError))
          catchedErrors.set(ModificationPackageNotAvailableError, [error])
        else
          catchedErrors.set(ModificationPackageNotAvailableError).push(error)
      else throw error
      return false
    }
    return true
  })

  // process parsing errors (if any)
  if (catchedErrors.has(ModificationParsingError)) {
    atom.notifications.addError(ModificationParsingError.getGenericMessage(false), {
      buttons: [{
        className: "btn dtn-default",
        onDidClick: () => {
            // TODO redirect to error causing file/settings
          console.log("go to problem file/config")
        },
        text: "Go to...",
      }],
      // TODO description: "",
      detail: () => {
        let messages = ""
        catchedErrors.get(ModificationParsingError).forEach(err => {
          messages += `<br />${err.message}`
        })
        return messages
      },
      dismissable: true,
    })
    catchedErrors.delete(ModificationParsingError)
  }

  // process package not available errors (if any)
  if (catchedErrors.has(ModificationPackageNotAvailableError)) {
    atom.notifications.addWarning(ModificationPackageNotAvailableError.getGenericMessage(false), {
      buttons: [{
        className: "btn dtn-default",
        onDidClick: () => {
          // TODO clean package destritus from modifications
          console.log("cleaned package destritus from modifications")
        },
        text: "Clean",
      }],
      // TODO description: "",
      detail: () => {
        let messages = ""
        catchedErrors.get(ModificationPackageNotAvailableError).forEach(err => {
          messages += `<br />${err.message}`
        })
        return messages
      },
      dismissable: true,
    })
    catchedErrors.delete(ModificationParsingError)
  }
}

export let validateModification = modification => validateAllModifications([modification])
