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
// ...
//  import fs from "fs"
// import path from "path"

/* ***** Atom Imports ***** */
import { CompositeDisposable } from "atom"

/* ***** Internal ****** */
import config from "./config"
import { validateAllModifications/* , validateModification */ } from "./modification-validation"
import { applyAllModifications/* , applyModification */ } from "./modification-application"


/* ********** ********** Internal Variables ********** ********** */

let subscriptions = null


/* ********** ********** Internal Functions ********** ********** */

function processAllModifications(modifications) {
  validateAllModifications(modifications)
  applyAllModifications(modifications)
}


/* ********** ********** Package Definition ********** ********** */

export default {
  config,

  activate(state) { // eslint-disable-line no-unused-vars
    // create subscription collection
    subscriptions = new CompositeDisposable()

    // command subscriptions
    // TODO toggle command ???
    subscriptions.add(atom.commands.add("atom-workspace", "keybindings-manager:toggle", () => { console.info("TOGGLE") }))

    // package events subscriptions
    subscriptions.add(atom.packages.onDidActivateInitialPackages(() => {
      let modifications

      // TODO load modifications from file
      // JSON.parse(require("fs").readFileSync(filePath, { encoding: "utf8" }))
      modifications = require("../test/validationTestData")

      modifications = modifications || [
        {
          action: "remove",
          package: "keybindings-manager",
          selector: "atom-workspace",
          command: "keybindings-manager:toggle",
          keystrokes: "ctrl-alt-o",
        },
        {
          action: "add",
          package: "keybindings-manager",
          selector: "atom-workspace",
          command: "keybindings-manager:toggle",
          keystrokes: "ctrl-alt-p",
        },
      ]

      processAllModifications(modifications)
    }))
  },

  deactivate() {
    // dispose all subscriptions
    subscriptions.dispose()

    // TODO revert modifications
  },
}
