"use babel"


/* ********** ********** Imports ********** ********** */

/* ***** Node.js (built-in) ***** */
import fs from "fs"
import path from "path"

/* ***** Package ***** */
import {
    ADD_ACTION, CHANGE_ACTION, REMOVE_ACTION, ALL_ACTIONS,
    CORE_PACKAGE_NAME,
    NOTIFICATION_SIGNATURE
  } from "./constants"
import { KeyBindingQueryError, KeyBindingNotFoundError, KeyBindingNotUniqueError } from "./errors"
import { _modVal } from "./helpers"


/* ********** ********** Functions ********** ********** */

// TODO is needed? - an package activation likely causes _multiple_ binding changes!!!
// eslint-disable-next-line no-unused-vars
function _applyModification(mod) {
  // create map of current key bindings indexed by command
  let binding = atom.keymaps.keyBindings.filter(e =>
        e.selector === mod.selector &&
        e.command === mod.command &&
        e.keystrokes === mod.keystrokes &&
        (mod.package === CORE_PACKAGE_NAME ?
            e.source.startsWith(mod.source) :
            fs.realpathSync(e.source).startsWith(mod.source))
      )

  /* *** process change action *** */
  if (mod.action === CHANGE_ACTION) {
    // check if there are any matching bindings
    if (!binding.length)
      throw new KeyBindingNotFoundError(mod)
    // check if there are multiple matching bindings
    if (binding.length > 1)
      throw new KeyBindingNotUniqueError(mod, binding)
    // change binding
    ;["selector", "command", "keystrokes", "source"].forEach(property => {
      if (Array.isArray(mod[property]))
        binding[property] = mod[property][1]
    })
    console.debug("*** CHANGED", mod, binding[0])
  } // eslint-disable-line brace-style

  /* *** process remove action *** */
  else if (mod.action === REMOVE_ACTION) {
    // check if there are any matching bindings
    if (!binding.length)
      throw new KeyBindingNotFoundError(mod)
    // check if there are multiple matching bindings
    if (binding.length > 1)
      throw new KeyBindingNotUniqueError(mod, binding)
    // remove binding
    atom.keymaps.keyBindings.splice(binding[0].index - 1, 1)
    console.debug("--- REMOVED", binding[0])
  } // eslint-disable-line brace-style

  /* *** process add action *** */
  else if (mod.action === ADD_ACTION) {
    // check if there already are any matching bindings
    if (binding.length)
      throw new KeyBindingNotUniqueError(mod, binding)
    // add binding
    atom.keymaps.add(
        // TODO mod.source is path to package not to a keymap file
        path.join(mod.source, (mod.source === CORE_PACKAGE_NAME ? "keymaps/base.cson" : "keymaps/xxx.xxx")))
    console.debug("+++ ADDED", mod)
  } // eslint-disable-line brace-style

  // notify about keymap change
  atom.keymaps.emitter.emit("did-reload-keymap")
}


export function applyAllModifications(allModifications) {
  // create map of current key bindings indexed by command
  let currentBindings = new Map()
  atom.keymaps.keyBindings.forEach(e => {
    let arr = currentBindings.get(e.command)
    if (!arr) {
      arr = []
      // find keybinding by modification
      arr.findByModification = function(mod) {
        return this.filter(e =>
            e.selector === _modVal(mod.selector) &&
            e.command === _modVal(mod.command) &&
            e.keystrokes === _modVal(mod.keystrokes) &&
            (_modVal(mod.package) === CORE_PACKAGE_NAME ?
                e.source.startsWith(_modVal(mod.source)) :
                fs.realpathSync(e.source).startsWith(_modVal(mod.source))))
      }
      currentBindings.set(e.command, arr)
    }
    arr.push(e)
  })

  // create object of modifications indexed by action
  let modifications = {}
  ALL_ACTIONS.forEach(action => {
    let arr = []
    // TODO modifications[ACTION].filterByPackage needed?
    // arr.filterByPackage = function(packageName) { return this.filter(e => e.package === packageName) }
    modifications[action] = arr
  })
  allModifications.forEach(e => e.valid && modifications[e.action].push(e))

  let catchedErrors = []

  /* *** process change actions *** */
  modifications[CHANGE_ACTION].forEach(mod => {
    try {
      // get all bindings with the same command
      let binding = currentBindings.get(mod.command)
      // check if there are any matching bindings
      if (!binding || !binding.length || !(binding = binding.findByModification(mod)).length)
        throw new KeyBindingNotFoundError(mod)
      // check if there are multiple matching bindings
      if (binding.length > 1)
        throw new KeyBindingNotUniqueError(mod, binding)
      // change binding
      ;["selector", "command", "keystrokes", "source"].forEach(property => {
        if (Array.isArray(mod[property]))
          binding[0][property] = mod[property][1]
      })
      console.debug("*** CHANGED", mod, binding[0])
    } catch (error) {
      if (error instanceof KeyBindingQueryError)
        catchedErrors.push(error)
      else throw error
    }
  })

  /* *** process remove actions *** */
  modifications[REMOVE_ACTION].forEach(mod => {
    try {
      // get all bindings with the same command
      let binding = currentBindings.get(mod.command)
      // check if there are any matching bindings
      if (!binding || !binding.length || !(binding = binding.findByModification(mod)).length)
        throw new KeyBindingNotFoundError(mod)
      // check if there are multiple matching bindings
      if (binding.length > 1)
        throw new KeyBindingNotUniqueError(mod, binding)
      // remove binding (set entry to null)
      atom.keymaps.keyBindings[binding[0].index - 1] = null
      console.debug("--- REMOVED", binding[0])
    } catch (error) {
      if (error instanceof KeyBindingQueryError)
        catchedErrors.push(error)
      else throw error
    }
  })
  // remove null entries (removed entries) if any items may have been removed
  if (modifications[REMOVE_ACTION].length)
    atom.keymaps.keyBindings = atom.keymaps.keyBindings.filter(e => e)

  /* *** process add actions *** */
  modifications[ADD_ACTION].forEach(mod => {
    try {
      // get all bindings with the same command
      let binding = currentBindings.get(mod.command)
      // check if there already are any matching bindings
      if (binding && binding.length && (binding = binding.findByModification(mod).length))
        throw new KeyBindingNotUniqueError(mod, binding)
      // add binding
      atom.keymaps.add(
          // TODO mod.source is path to package not to a keymap file (important???)
          //  path.join(mod.source, `keymaps/${PACKAGE_NAME}`)
          path.join(mod.source, (mod.source === CORE_PACKAGE_NAME ? "keymaps/base.cson" : `keymaps/${mod.package}.json`)))
      console.debug("+++ ADDED", mod)
    } catch (error) {
      if (error instanceof KeyBindingNotUniqueError)
        catchedErrors.push(error)
      else throw error
    }
  })

  // notify about keymap change
  atom.keymaps.emitter.emit("did-reload-keymap")

  // process keybinding errors (if any)
  if (catchedErrors.length)
    atom.notifications.addWarning("Skipped keybinding modifications where applying failed!", {
      detail: (() => {
        let text = ""
        catchedErrors.forEach(err => {
          text += `\n${err.message}\n  ...at entry ${_modVal(err.queryParams.package)}/${_modVal(err.queryParams.command)} using '${_modVal(err.queryParams.keystrokes)}'`
        })
        return text
      })(),
      description: NOTIFICATION_SIGNATURE,
      dismissable: true,
    })
}
