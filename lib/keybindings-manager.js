"use babel"


/* ***** Node.js Imports ***** */
// ...

/* ***** Atom Imports ***** */
import { CompositeDisposable } from "atom"


export default {
  /* ********** ********** Config Settings ********** ********** */
  // Keybinding Modification = { action, package, selector, command, keystrokes, [priority] }
  config: {},


  /* ********** ********** Internal Imports ********** ********** */
  error: require("./error"),
  handleModification: require("./modification-handling"),


  /* ********** ********** Internal Variables ********** ********** */

  subscriptions: null,


  /* ********** ********** Internal Functions ********** ********** */

  loadModifications(filePath) {
    return JSON.parse(require("fs").readFileSync(filePath, { encoding: "utf8" }))
  },

  processModifications(modifications) {
    for (let mod of modifications)
      this.handleModification(mod)
    atom.keymaps.emitter.emit("did-reload-keymap")
  },


  /* ********** ********** Package Functions ********** ********** */

  // NOTE DEBUG testing()
  testing() {
    let allModifications = this.loadModifications("C:/Users/kilia/Documents/GitHub/atom/keybindings-manager/keybindingModifications-remove.json")
    console.log(allModifications.length)
    this.processModifications(allModifications)
    return

    this.processModifications([
      {
        action: "remove",
        package: "keybindings-manager",
        selector: "atom-workspace",
        command: "keybindings-manager:toggle",
        keystrokes: "ctrl-alt-o",
        priority: null,
      },
      {
        action: "add",
        package: "keybindings-manager",
        selector: "atom-workspace",
        command: "keybindings-manager:toggle",
        keystrokes: "ctrl-alt-p",
        priority: null,
      },
    ])
  },

  activate(state) { // eslint-disable-line no-unused-vars
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add("atom-workspace", "keybindings-manager:toggle", () => { console.log("TOGGLE") }))

    this.subscriptions.add(atom.packages.onDidActivateInitialPackages(() => this.testing()))
  },

  deactivate() {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.dispose()
  },
}
