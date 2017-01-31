"use babel"

/* TODO unrelated ToDo-List
 *  - handle package de-/activation (on-the-fly)
 *  - handle config change (on-the-fly)
 *  - add config settings
 *  - implement es6-error ('import ExtendableError from "es6-error"' and then 'class MYERROR extends ExtendableError')
 * - auto clean unavailable packages from file
 */


/* ********** ********** Imports ********** ********** */
/* eslint-disable sort-imports */

/* ***** Node.js Imports ***** */
import fs from "fs"
import path from "path"

/* ***** Atom Imports ***** */
import { CompositeDisposable } from "atom"

/* ***** Internal ****** */
import config from "./config" // eslint-disable-line no-unused-vars
import error from "./error"
import { isSelectorValid as validateSelector } from "./atom/clear-cut"
import { normalizeKeystrokes as validateAndNormalizeKeystrokes } from "./atom/keymap-helpers"


/* ********** ********** Internal Variables ********** ********** */

const ADD_ACTION = "add"
const CHANGE_ACTION = "change"
const REMOVE_ACTION = "remove"
const ALL_ACTIONS = [ADD_ACTION, CHANGE_ACTION, REMOVE_ACTION]

const CORE_PACKAGE_NAME = "core"

let subscriptions = null


/* ********** ********** Internal Functions ********** ********** */

function loadModifications() {
  // TODO DEBUG test data
  if (true) // eslint-disable-line no-constant-condition
    return [
      {
        action: "remove",
        package: "keybindings-manager",
        selector: "atom-workspace",
        command: "keybindings-manager:toggle",
        keystrokes: "ctrl-alt-o",
        priority: null,
      },
      /*{
        action: "add",
        package: "keybindings-manager",
        selector: "atom-workspace",
        command: "keybindings-manager:toggle",
        keystrokes: "ctrl-alt-p",
        priority: null,
      },*/
    ]

  // TODO load modifications
  // return JSON.parse(require("fs").readFileSync(filePath, { encoding: "utf8" }))
  return undefined
}

// TODO rework validateAndNormalizeModification
function validateAndNormalizeModification(mod) {
  let retret
  try {
    retret = require("./modification-validation")(mod)
  } catch (err) {
    atom.notifications.addError(err.message, { dismissable: true })
    return undefined
  }
  if (retret && retret.skip) {
    atom.notifications.addWarning(retret.message, { dismissable: true })
    console.warn(mod)
  } else {
    atom.notifications.addSuccess(mod)
  }

  /* eslint-disable no-unreachable */
  return undefined

  /*
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
    */

  return mod
}

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
            // TODO path resolution for non-core sources
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


/* ********** ********** Event Functions ********** ********** */

function onInitialActivation() {
  let modifications = loadModifications()
  for (let mod of modifications)
    validateAndNormalizeModification(mod)
  // TODO initialApplyModifications(modifications)
}


/* ********** ********** Package Definition ********** ********** */

export default {
  config,

  activate(state) { // eslint-disable-line no-unused-vars
    // create subscription collection
    subscriptions = new CompositeDisposable()

    // command subscriptions
    subscriptions.add(atom.commands.add("atom-workspace", "keybindings-manager:toggle", () => { console.log("TOGGLE") }))

    // package events subscriptions
    subscriptions.add(atom.packages.onDidActivateInitialPackages(onInitialActivation))
  },

  deactivate() {
    // dispose all subscriptions
    subscriptions.dispose()

    // TODO revert modifications
  },
}
