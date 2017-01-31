"use babel"


/* ********** ********** Imports ********** ********** */

/* *** Node.js (built-in) *** */
import path from "path"

/* *** Node.js *** */
import ExtendableError from "es6-error"

/* *** Project *** */
import { isSelectorValid } from "./atom/clear-cut"
import { normalizeKeystrokes } from "./atom/keymap-helpers"
import { FatalError } from "./error"


/* ********** ********** Variables ********** ********** */

const ADD_ACTION = "add"
const CHANGE_ACTION = "change"
const REMOVE_ACTION = "remove"
const ALL_ACTIONS = [ADD_ACTION, CHANGE_ACTION, REMOVE_ACTION]

const CORE_PACKAGE_NAME = "core"
const NATIVE_COMMAND_STRING = "native!"

const ERRCODE_UNDEFINED = Symbol("ERRCODE_UNDEFINED")
const ERRCODE_TYPE = Symbol("ERRCODE_TYPE")
const ERRCODE_VALUE = Symbol("ERRCODE_VALUE")
const ERRCODE_SYNTAX = Symbol("ERRCODE_SYNTAX")
const ERRCODE_ADD_NATIVE = Symbol("ERRCODE_ADD_NATIVE")


/* ********** ********** Classes ********** ********** */

class ModificationParsingError extends ExtendableError {
  constructor(errcode, modification, property, propertyValue) {
    super()

    let message
    switch (errcode) {
    case ERRCODE_UNDEFINED:
      message = `Property '${property}' missing!`
      break
    case ERRCODE_ADD_NATIVE:
      message = "Cannot add native commands!"
      break
    case ERRCODE_TYPE: message = "Type"; break
    case ERRCODE_SYNTAX: message = "Syntax"; break
    case ERRCODE_VALUE: message = "Value"; break
    default: throw new FatalError(`Unknown error code in '${this.name}'!${errcode ? ` (${errcode})` : ""}`)
    }
    if (errcode !== ERRCODE_UNDEFINED && errcode !== ERRCODE_ADD_NATIVE)
      message = `${message} of property '${property}' not valid! ('${propertyValue}')`

    this.message = `${this.name}: ${message} @ ${`${modification.package}/${modification.command}[${modification.keystrokes}]`}`
  }
}


/* ********** ********** Functions ********** ********** */

export default function(mod) {
  /* *** validate action *** */
  // action property: required
  if (!mod.action) throw new ModificationParsingError(ERRCODE_UNDEFINED, mod, "action")
  if (typeof mod.action !== "string") throw new ModificationParsingError(ERRCODE_TYPE, mod, "action", mod.action)
  // check if known action
  if (ALL_ACTIONS.indexOf(mod.action) < 0)
    throw new ModificationParsingError(ERRCODE_VALUE, mod, "action", mod.action)

  /* *** validate package and set source *** */
  // package property: required
  if (!mod.package) throw new ModificationParsingError(ERRCODE_UNDEFINED, mod, "package")
  if (typeof mod.package !== "string" && !(Array.isArray(mod.package) && mod.package.length === 2))
    throw new ModificationParsingError(ERRCODE_TYPE, mod, "package", mod.package)
  // validate query and change value (if available)
  for (let mpackage of (typeof mod.package !== "string" ? [mod.package] : mod.package)) {
    if (typeof mpackage !== "string") throw new ModificationParsingError(ERRCODE_TYPE, mod, "package", mpackage)
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
      // skip modification
      return { skip: true, message: `Package '${mpackage}' not available!` }
    }
  }

  /* *** validate selector *** */
  // selector property: required
  if (!mod.selector) throw new ModificationParsingError(ERRCODE_UNDEFINED, mod, "selector")
  if (typeof mod.selector !== "string" && !(Array.isArray(mod.selector) && mod.selector.length === 2))
    throw new ModificationParsingError(ERRCODE_TYPE, mod, "selector", mod.selector)
  // validate query and change value (if available)
  for (let selector of (typeof mod.selector !== "string" ? [mod.selector] : mod.selector)) {
    if (typeof selector !== "string") throw new ModificationParsingError(ERRCODE_TYPE, mod, "selector", selector)
    // check if selector string has valid format
    if (!isSelectorValid(selector))
      throw new ModificationParsingError(ERRCODE_SYNTAX, mod, "selector", selector)
  }

  /* *** validate command *** */
  // command property: require
  if (!mod.command) throw new ModificationParsingError(ERRCODE_UNDEFINED, mod, "command")
  if (typeof mod.command !== "string" && !(Array.isArray(mod.command) && mod.command.length === 2))
    throw new ModificationParsingError(ERRCODE_TYPE, mod, "command", mod.command)
  // validate query and change value (if available)
  for (let command of (typeof mod.command !== "string" ? [mod.command] : mod.command)) {
    if (typeof command !== "string") throw new ModificationParsingError(ERRCODE_TYPE, mod, "command", command)
    // check if command string has right format and id trying to add a native command
    if (!/[a-z-]+:[a-z-]+/.test(command) && command !== NATIVE_COMMAND_STRING)
      throw new ModificationParsingError(ERRCODE_SYNTAX, mod, "command", command)
    else if (command === NATIVE_COMMAND_STRING && mod.action === ADD_ACTION)
      throw new ModificationParsingError(ERRCODE_ADD_NATIVE, mod, "command", command) // TODO error type?
  }

  /* *** validate & normalize keystrokes *** */
  // keystrokes property: required
  if (!mod.keystrokes) throw new ModificationParsingError(ERRCODE_UNDEFINED, mod, "keystrokes")
  if (typeof mod.keystrokes !== "string" && !(Array.isArray(mod.keystrokes) && mod.keystrokes.length === 2))
    throw new ModificationParsingError(ERRCODE_TYPE, mod, "keystrokes", mod.keystrokes)
  // validate query and change value (if available)
  for (let keystrokes of (typeof mod.keystrokes !== "string" ? [mod.keystrokes] : mod.keystrokes)) {
    if (typeof keystrokes !== "string") throw new ModificationParsingError(ERRCODE_TYPE, mod, "keystrokes", keystrokes)
    // check if normalization was successful
    keystrokes = normalizeKeystrokes(keystrokes)
    if (!keystrokes)
      throw new ModificationParsingError(ERRCODE_SYNTAX, mod, "keystrokes", keystrokes)
  }

  /* *** validate priority *** */
  // priority property: optional = 0
  mod.priority = mod.priority || 0
  if (typeof mod.priority !== "number" && !(Array.isArray(mod.priority) && mod.priority.length === 2))
    throw new ModificationParsingError(ERRCODE_TYPE, mod, "priority", mod.priority)
  // validate query and change value (if available)
  for (let priority of (typeof mod.priority !== "number" ? [mod.priority] : mod.priority)) {
    if (typeof priority !== "number") throw new ModificationParsingError(ERRCODE_TYPE, mod, "priority", priority)
    // check if priority is a positive integer or zero
    if (priority < 0 || priority % 1)
      throw new ModificationParsingError(ERRCODE_VALUE, mod, "priority", priority)
  }

  return { skip: false }
}
