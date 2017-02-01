"use babel"


/* ********** ********** Imports ********** ********** */

/* ***** Node.js (built-in) ***** */
import path from "path"

/* ***** Package ***** */
import {
    NOTIFICATION_SIGNATURE,
    ADD_ACTION, CHANGE_ACTION, ALL_ACTIONS,
    CORE_PACKAGE_NAME, NATIVE_COMMAND_STRING
  } from "./constants"
import { isSelectorValid } from "./atom/clear-cut"
import { normalizeKeystrokes } from "./atom/keymap-helpers"
import { ModificationParsingError, PackageNotAvailableError } from "./errors"


/* ********** ********** Functions ********** ********** */

function _validateModification(mod) {
  { /* *** validate action (required) *** */
    if (!mod.action)
      throw new ModificationParsingError(mod, "action", ModificationParsingError.ERRCODE_UNDEFINED)
    if (typeof mod.action !== "string")
      throw new ModificationParsingError(mod, "action", ModificationParsingError.ERRCODE_TYPE)

    if (ALL_ACTIONS.indexOf(mod.action) < 0)
      throw new ModificationParsingError(mod, "action", ModificationParsingError.ERRCODE_VALUE)
  }

  { /* *** validate package and set source (required) *** */
    if (!mod.package)
      new ModificationParsingError(mod, "package", ModificationParsingError.ERRCODE_UNDEFINED)

    let hasChangeValue = false
    if (mod.action === CHANGE_ACTION && Array.isArray(mod.package) && mod.package.length === 2) {
      hasChangeValue = true
      mod.source = new Array(2)
    }

    for (let idx = 0; idx <= hasChangeValue; idx++) {
      let _package = hasChangeValue ? mod.package[idx] : mod.package
      if (typeof _package !== "string")
        throw new ModificationParsingError(mod, "package", ModificationParsingError.ERRCODE_TYPE)

      let _source
      if (_package === CORE_PACKAGE_NAME) {
        let regex = path.join(`/atom/app-${atom.getVersion()}/resources/app.asar`)
              .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") // escape regular expression string
        _source = path.join(module.parent.parent.filename.match(new RegExp(`^.*?${regex}`))[0]) // FIXME parent of parent not pretty and error-prone
      } else if (!(_source = atom.packages.resolvePackagePath(_package))) {
        if (_package !== "keybindings-manager") // NOTE DEBUG test case
          throw new PackageNotAvailableError(mod.package)
      }
      hasChangeValue ? (mod.source[idx] = _source) : (mod.source = _source)
    }
  }

  { /* *** validate selector (required) *** */
    if (!mod.selector)
      throw new ModificationParsingError(mod, "selector", ModificationParsingError.ERRCODE_UNDEFINED)

    let hasChangeValue = mod.action === CHANGE_ACTION && Array.isArray(mod.selector) && mod.selector.length === 2
    for (let idx = 0; idx <= hasChangeValue; idx++) {
      let _selector = hasChangeValue ? mod.selector[idx] : mod.selector
      if (typeof _selector !== "string")
        throw new ModificationParsingError(mod, "selector", ModificationParsingError.ERRCODE_TYPE)

      if (!isSelectorValid(_selector))
        throw new ModificationParsingError(mod, "selector", ModificationParsingError.ERRCODE_SYNTAX)
    }
  }

  { /* *** validate command (required) *** */
    if (!mod.command)
      throw new ModificationParsingError(mod, "command", ModificationParsingError.ERRCODE_UNDEFINED)

    let hasChangeValue = mod.action === CHANGE_ACTION && Array.isArray(mod.command) && mod.command.length === 2
    for (let idx = 0; idx <= hasChangeValue; idx++) {
      let _command = hasChangeValue ? mod.command[idx] : mod.command
      if (typeof _command !== "string")
        throw new ModificationParsingError(mod, "command", ModificationParsingError.ERRCODE_TYPE)

      if (!/[a-z-]+:[a-z-]+/.test(_command) && _command !== NATIVE_COMMAND_STRING)
        throw new ModificationParsingError(mod, "command", ModificationParsingError.ERRCODE_SYNTAX)
      else if (_command === NATIVE_COMMAND_STRING && mod.action === ADD_ACTION)
        throw new ModificationParsingError(mod, "command", ModificationParsingError.ERRCODE_ADD_NATIVE)
    }
  }

  { /* *** validate & normalize keystrokes (required) *** */
    if (!mod.keystrokes)
      throw new ModificationParsingError(mod, "keystrokes", ModificationParsingError.ERRCODE_UNDEFINED)

    let hasChangeValue = mod.action === CHANGE_ACTION && Array.isArray(mod.keystrokes) && mod.keystrokes.length === 2
    for (let idx = 0; idx <= hasChangeValue; idx++) {
      let _keystrokes = hasChangeValue ? mod.keystrokes[idx] : mod.keystrokes
      if (typeof _keystrokes !== "string")
        throw new ModificationParsingError(mod, "keystrokes", ModificationParsingError.ERRCODE_TYPE)

      _keystrokes = normalizeKeystrokes(_keystrokes)
      if (!_keystrokes)
        throw new ModificationParsingError(mod, "keystrokes", ModificationParsingError.ERRCODE_SYNTAX)
      hasChangeValue ? (mod.keystrokes[idx] = _keystrokes) : (mod.keystrokes = _keystrokes)
    }
  }
}

export function validateAllModifications(modifications) {
  let catchedErrors = new Map()
  modifications.forEach(mod => {
    try {
      _validateModification(mod)
      mod.valid = true

    } catch (error) {
      if (error instanceof ModificationParsingError)
        if (!catchedErrors.has(ModificationParsingError))
          catchedErrors.set(ModificationParsingError, [error])
        else
          catchedErrors.get(ModificationParsingError).push(error)
      else if (error instanceof PackageNotAvailableError)
        if (!catchedErrors.has(PackageNotAvailableError))
          catchedErrors.set(PackageNotAvailableError, [error])
        else
          catchedErrors.get(PackageNotAvailableError).push(error)
      else throw error
      mod.valid = false
    }
  })

  // process parsing errors (if any)
  /* ESLint Info
   *  curly: [..., "multi"]
   *  The rules autofix removes the curly braces of the if statement which leads
   *  to a syntax error, because `var`, `let`, `const` are not allowed for a
   *  single single-statement 'block'.
   */// eslint-disable-next-line curly
  if (catchedErrors.has(ModificationParsingError)) {
    let notification = atom.notifications.addError("Skipped keybinding modifications where parsing failed!", {
      buttons: [{
        // TODO .onDidClick - redirect to error causing file/settings
        onDidClick() {
          notification.dismiss()
        },
        text: "...",
      }],
      detail: (() => {
        let text = ""
        catchedErrors.get(ModificationParsingError).forEach(err => {
          text += `\n${err.message}\n  ...at entry ${err.modification.package}/${err.modification.command} using '${err.modification.keystrokes}'`
        })
        return text
      })(),
      description: NOTIFICATION_SIGNATURE,
      dismissable: true,
    })
  }

  // process package not available errors (if any)
  /* ESLint Info
   *  curly: [..., "multi"]
   *  The rules autofix removes the curly braces of the if statement which leads
   *  to a syntax error, because `var`, `let`, `const` are not allowed for a
   *  single single-statement 'block'.
   */// eslint-disable-next-line curly
  if (catchedErrors.has(PackageNotAvailableError)) {
    let notification = atom.notifications.addInfo("Skipped keybinding modifications for unavailable packages!", {
      buttons: [{
        text: "Clean",
        // TODO .onDidClick - clean package destritus from modifications
        onDidClick() {
          notification.dismiss()
        },
      }],
      detail: (() => {
        let text = ""
        catchedErrors.get(PackageNotAvailableError).forEach(err => {
          text += `\n${err.packageName}`
        })
        return text
      })(),
      description: NOTIFICATION_SIGNATURE,
      dismissable: true,
    })
  }
}

export const validateModification = modification => validateAllModifications([modification])
