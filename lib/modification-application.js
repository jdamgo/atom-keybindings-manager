"use babel"


/* ********** ********** Imports ********** ********** */

/* *** Node.js (built-in) *** */
import fs from "fs"
import path from "path"


/* ********** ********** Variables ********** ********** */

const ADD_ACTION = "add"
const CHANGE_ACTION = "change"
const REMOVE_ACTION = "remove"
const ALL_ACTIONS = [ADD_ACTION, CHANGE_ACTION, REMOVE_ACTION]

const CORE_PACKAGE_NAME = "core"


/* ********** ********** Functions ********** ********** */
// TODO common code of applyAllModifications and applyModification

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
            e.selector === mod.selector &&
            e.command === mod.command &&
            e.keystrokes === mod.keystrokes &&
            (mod.package === CORE_PACKAGE_NAME ?
                e.source.startsWith(mod.source) :
                fs.realpathSync(e.source).startsWith(mod.source)))
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
  allModifications.forEach(e => modifications[e.action].push(e))

  /* TODO ***** process change actions ***** */
  // ...

  /* ***** process remove actions ***** */
  modifications[REMOVE_ACTION].forEach(mod => {
    // get all bindings with the same command
    let binding = currentBindings.get(mod.command)
    // check if there are any matching bindings
    if (!binding || !binding.length || !(binding = binding.findByModification(mod)).length)
      throw new Error(/* TODO [error/remove] binding not existing */)
    // check if there are multiple matching bindings
    if (binding.length > 1)
      throw new Error(/* TODO [error/remove] multiple bindings match */)
    // remove binding (set entry to null)
    // XXX remove disabled for debug purpose
    // atom.keymaps.keyBindings[binding[0].index - 1] = null
    console.debug("--- REMOVED", binding[0])
  })
  // remove null entries (removed entries) if any items may have been removed
  if (modifications[REMOVE_ACTION].length)
    atom.keymaps.keyBindings = atom.keymaps.keyBindings.filter(e => e)

  /* ***** process add actions ***** */
  modifications[ADD_ACTION].forEach(mod => {
    // get all bindings with the same command
    let binding = currentBindings.get(mod.command)
    // check if there already are any matching bindings
    if (binding && binding.length && binding.findByModification(mod).length)
      throw new Error(/* TODO [error/add] binding(s) already existing */)
    // add binding
    // XXX add disabled for debug purpose
    /*
    atom.keymaps.add(
        // TODO mod.source is path to package not to a keymap file
        path.join(mod.source, (mod.source === CORE_PACKAGE_NAME ? "keymaps/base.cson" : "keymaps/xxx.xxx")),
        mod.priority)
    */
    console.debug("+++ ADDED", mod)
  })

  // notify about keymap change
  atom.keymaps.emitter.emit("did-reload-keymap")
}

export function applyModification(mod) {
  // create map of current key bindings indexed by command
  let binding = atom.keymaps.keyBindings.filter(e =>
        e.selector === mod.selector &&
        e.command === mod.command &&
        e.keystrokes === mod.keystrokes &&
        (mod.package === CORE_PACKAGE_NAME ?
            e.source.startsWith(mod.source) :
            fs.realpathSync(e.source).startsWith(mod.source))
      )

  /* TODO ***** process change actions ***** */
  if (mod.action === CHANGE_ACTION) {
    // ...
  } // eslint-disable-line brace-style

  /* ***** process remove actions ***** */
  else if (mod.action === REMOVE_ACTION) {
    // check if there are any matching bindings
    if (!binding.length)
      throw new Error(/* TODO [error/remove] binding not existing */)
    // check if there are multiple matching bindings
    if (binding.length > 1)
      throw new Error(/* TODO [error/remove] multiple bindings match */)
    // remove binding (set entry to null)
    atom.keymaps.keyBindings[binding[0].index - 1] = null
    console.debug("--- REMOVED", binding[0])
  } // eslint-disable-line brace-style

  /* ***** process add actions ***** */
  else if (mod.action === ADD_ACTION) {
    // check if there already are any matching bindings
    if (binding.length)
      throw new Error(/* TODO [error/add] binding(s) already existing */)
    // add binding
    atom.keymaps.add(
        // TODO mod.source is path to package not to a keymap file
        path.join(mod.source, (mod.source === CORE_PACKAGE_NAME ? "keymaps/base.cson" : "keymaps/xxx.xxx")),
        mod.priority)
    console.debug("+++ ADDED", mod)
  } // eslint-disable-line brace-style

  // notify about keymap change
  atom.keymaps.emitter.emit("did-reload-keymap")
}