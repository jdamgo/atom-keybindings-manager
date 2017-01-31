"use babel"


/* ********** ********** Imports ********** ********** */

/* *** Node.js (built-in) *** */
import fs from "fs"

/* *** Node.js *** */
// ...

/* *** Atom *** */
// ...

/* *** Project *** */
import validateModification from "./modification-validation"
import { ModificationParsingError, FatalError } from "./errors"


/* ********** ********** Variables ********** ********** */

const ADD_ACTION = "add"
const CHANGE_ACTION = "change"
const REMOVE_ACTION = "remove"
const ALL_ACTIONS = [ADD_ACTION, CHANGE_ACTION, REMOVE_ACTION]

const CORE_PACKAGE_NAME = "core"


/* ********** ********** Classes ********** ********** */

// ...


/* ********** ********** Functions ********** ********** */

/* TODO
 *  - move notifications, etc. one level up and show a collection of warnings
 */
function processModification(mod) {
  // try validation of modification
  try {
    let instr = validateModification(mod)

    // check if modification should be skipped
    if (instr.skip) {
      // warning notification options
      let options = {
        buttons: [],
        // description: instr.getDescription && instr.getDescription(),
        // detail: instr.getDetail && instr.getDetail(),
      }
      // check if detritus from older packages was found in modification
      if (instr.packageDetritus)
        // add button to notification for auto-clean modifications
        options.buttons.push({
          className: "btn btn-default",
          onDidClick: () => {
            // TODO clean package destritus from modifications
            console.log("cleaned package destritus from modifications")
          },
          text: "Clean",
        })
      atom.notifications.addWarning(instr.message, options)
      console.warn(instr.message, instr)
    }

  } catch (error) {
    // check if error was a parsing error
    if (error instanceof ModificationParsingError) {
      // error notification options
      let options = {
        buttons: [{
          className: "",
          onDidClick: () => {
            // TODO redirect to error causing file/settings
            console.log("go to problem file/config")
          },
          text: "Go to...",
        }],
        // description: error.getDescription && error.getDescription(),
        // detail: error.getDetail && error.getDetail(),
        dismissable: true,
        stack: error.stack,
      }
      atom.notifications.addError(error.message, options)
      console.error(error.message, error)

    } else if (error instanceof FatalError) {
      // a fatal error occured (invalid state of package!!!)
      // propagate error up
      throw error

    } else {
      // TODO throw a fatal error!!!
      console.error(`Uncaught ${error.name}!`, error)
      throw new FatalError(`Uncaught ${error.name}!`)
    }
  }

  // ...
}

// TODO CURR lightweight reworck (check and comment)
function initialApplyModifications(initialModifications) {
  // create map of current key bindings indexed by command
  let currentBindings = new Map()
  atom.keymaps.keyBindings.forEach(e => {
    let arr = currentBindings.get(e.command)
    if (!arr) {
      arr = []
      arr.find_mod = function(mod) {
        return this.filter(e =>
            e.command === mod.command &&
            e.keystrokes === mod.keystrokes &&
            e.selector === mod.selector &&
            (mod.package === CORE_PACKAGE_NAME ?
                e.source.startsWith(mod.source) :
                fs.realpathSync(e.source).startsWith(mod.source)))
      }
      currentBindings.set(e.command, arr)
    }
    arr.push(e)
  })
  console.info("currentBindings", currentBindings)

  // create object of modifications indexed by action
  let modifications = {}
  ALL_ACTIONS.forEach(action => {
    let arr = []
    // TODO modifications[ACTION].filterByPackage needed?
    arr.filterByPackage = function(packageName) { return this.filter(e => e.package === packageName) }
    modifications[action] = arr
  })
  initialModifications.forEach(e => modifications[e.action].push(e))
  console.log("modifications", modifications)

  /* TODO ***** process change actions ***** */
  // ...

  /* ***** process remove actions ***** */
  modifications[REMOVE_ACTION].forEach(mod => {
    // get all bindings with the same command
    let binding = currentBindings.get(mod.command)
    // check if there are any matching bindings
    if (!binding || !binding.length || !(binding = binding.find_mod(mod)).length)
      error(new Error("$1"), mod, binding) /* TODO [remove] binding not existing */
    // check if there are multiple matching bindings
    if (binding.length > 1)
      error(new Error("$1"), mod, binding) /* TODO [remove] multiple bindings match */
    // remove binding (set entry to null)
    atom.keymaps.keyBindings[binding[0].index - 1] = null
    console.log("--- REMOVED", binding[0])
  })
  // remove null entries (removed entries) if any items may have been removed
  if (modifications[REMOVE_ACTION].length)
    atom.keymaps.keyBindings = atom.keymaps.keyBindings.filter(e => e)

  /* ***** process add actions ***** */
  modifications[ADD_ACTION].forEach(mod => {
    // get all bindings with the same command
    let binding = currentBindings.get(mod.command)
    // check if there already are any matching bindings
    if (binding && binding.length && binding.find_mod(mod).length)
      error(new Error("[add] binding(s) already existing"), mod, binding) /* TODO [add] binding(s) already existing */
    // add binding
    atom.keymaps.add(
        // TODO mod.source is path to package not to a keymap file
        (mod.source === CORE_PACKAGE_NAME ? path.join(mod.source, "keymaps/base.cson") : mod.source),
        { [mod.selector]: { [mod.keystrokes]: mod.command } },
        mod.priority)
    console.log("+++ ADDED", mod)
  })
  // remove null entries (removed entries) if any items may have been removed
  if (modifications[REMOVE_ACTION].length)
    atom.keymaps.keyBindings = atom.keymaps.keyBindings.filter(e => e)

  // notify about keymap change
  atom.keymaps.emitter.emit("did-reload-keymap")
}
