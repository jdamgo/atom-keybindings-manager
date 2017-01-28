"use babel"

import { CompositeDisposable } from "atom"


export default {

  subscriptions: null,

  activate(state) { // eslint-disable-line no-unused-vars
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add("atom-workspace", { "keybindings-manager:toggle": () => this.toggle() }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  toggle() {
    console.log("KeybindingsManager was toggled!")
  },

}
