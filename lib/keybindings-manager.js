// TODO make paths environment independant using e.g. 'path' from Node.js

"use babel"

import { CompositeDisposable } from "atom"


export default {
  /* ********** Internal Variables ********** */

  subscriptions: null,


  /* ********** Internal Functions ********** */

  toggle() {
    console.log("KeybindingsManager was toggled!")
  },

  loadBindingConfig(filePath) {
    // TODO load test config file
  },

  manageKeybindingEntry(binding, packageName) {
    // TODO validate selector, command, keystrokes(+normalize)
    // TODO handle command is "native!"
    let currentBindings = atom.keymaps.findKeyBindings({ keystrokes: binding.keystrokes, command: binding.command })
        .filter(e => {
          // TODO change to startsWith
          // TODO use ternary to handle source is "Core"
          e.source.includes(packageName)
        })

    if (binding.action === "add") {
      if (currentBindings.length > 0) this.error(new Error("command with specified binding parameters already exist"), binding, packageName)
      // TODO handle default values???
      // TODO use ternary to handle source is "Core"
      // TODO prefix source with atom package folder
      let source = `${packageName}\\keymaps\\${packageName}.json`
      atom.keymaps.add(source, { [binding.selector]: { [binding.keystrokes]: binding.command } }, binding.priority)

    } else if (binding.action === "remove") {
      if (currentBindings.length !== 1) this.error(new Error("keybinding cannot be uniquely identified"), binding, packageName)
      atom.keymaps.keyBindings.slice(currentBindings[0].index, 1)

    } else { this.error(new Error(`unknown binding action '${binding.action}'`), binding, packageName) }
  },

  manageKeybindings() {
    let bindingConfigs = loadConfig("../config.json")
    for (let packageName of bindingConfigs)
      if (bindingConfigs.hasOwnProperty(packageName))
        for (let binding of bindingConfigs[packageName])
          manageKeybindingEntry(binding, packageName)
  },


  /* ********** Global Functions ********** */


  activate(state) { // eslint-disable-line no-unused-vars
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add("atom-workspace", { "keybindings-manager:toggle": () => this.toggle() }))

    manageKeybindings()
  },

  deactivate() {
    this.subscriptions.dispose()
  },
}
