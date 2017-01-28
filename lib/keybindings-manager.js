"use babel"

// TODO make paths environment independant using e.g. 'path' from Node.js

import { CompositeDisposable } from "atom"


const packagesBasePath = atom.packages.getPackageDirPaths()[0]
const packagePath = `${packagesBasePath}/keybindings-manager`

const corePackagePathRegExp = /"AppData\\Local\\atom\\app-.*?\\resources\\app\.asar\\keymaps"/


export default {
  /* ********** Internal Variables ********** */

  subscriptions: null,


  /* ********** Internal Functions ********** */

  error(err, ...objs) {
    console.error(...objs)
    throw err
  },

  loadBindingConfig() {
    return JSON.parse(require("fs").readFileSync(`${packagePath}/config.json`, { encoding: "utf8" }))
  },

  manageKeybindingEntry(binding, packageName) {
    // validate selector
    let selectorTools = require(`${packagePath}/lib/atom-clear-cut`)
    if (!selectorTools.isSelectorValid(binding.selector)) this.error(new Error(`selector syntax error '${binding.selector}'`), binding, packageName)
    // validate command string
    if (!/[a-z-]+:[a-z-]+/.test(binding.command)) this.error(new Error(`invalid command format '${binding.command}'`), binding, packageName)
    // validate priority value
    if (binding.priority != null && !(binding.priority > 0)) this.error(new Error(`invalid priority value '${binding.priority}'`), binding, packageName)
    // validate and normalize keystrokes identifier
    let normalizedKeystrokes = require(`${packagePath}/lib/atom-keymap-helpers`).normalizeKeystrokes(binding.keystrokes)
    if (!normalizedKeystrokes) this.error(new Error(`cannot resolve keystrokes string '${binding.keystrokes}'`), binding, packageName)

    let currentBindings = atom.keymaps.findKeyBindings({ keystrokes: binding.keystrokes, command: binding.command })
        .filter(e => {
          console.log(`${packagesBasePath}\\${packageName}`, e.source)
          if (packageName === "core")
            // TODO Windows specific, what about Linux, etc.?
            return corePackagePathRegExp.test(e.source)
          else
            return e.source.startsWith(`${packagesBasePath}\\${packageName}`)
        })

    if (binding.action === "add") {
      if (binding.command === "native!") this.error(new Error("cannot add native commands"), binding, packageName)
      if (currentBindings.length > 0) this.error(new Error("command with specified binding parameters already exist"), binding, packageName)
      if (packageName === "core")
        // TODO adding 'core' commands
        this.error(new Error("(currently) cannot add core commands"), binding, packageName)
      let source = `${packageName}\\keymaps\\${packageName}.json`
      atom.keymaps.add(source, { [binding.selector]: { [binding.keystrokes]: binding.command } }, binding.priority || 0)
      // NOTE DEBUG
      console.log("+++ADDED", binding, packageName)

    } else if (binding.action === "remove") {
      // TODO add config to suppress these warning and if not create a warning notification popup
      if (binding.command === "native!") console.warn("native command removed", binding, packageName)
      console.log(currentBindings)// NOTE DEBUG
      if (currentBindings.length !== 1) this.error(new Error("keybinding cannot be uniquely identified"), binding, packageName)
      atom.keymaps.keyBindings = atom.keymaps.keyBindings.slice(currentBindings[0].index, 1)
      console.log("---REMOVED", binding, packageName)

    } else { this.error(new Error(`unknown binding action '${binding.action}'`), binding, packageName) }
  },

  manageKeybindings() {
    let bindingConfigs = this.loadBindingConfig()
    for (let packageName in bindingConfigs)
      if (bindingConfigs.hasOwnProperty(packageName))
        // eslint-disable-next-line
        if (!this._$0889e7) { this._$0889e7 = true; continue } // FIXME skip first entry (template entry)
        else
          for (let binding of bindingConfigs[packageName])
            this.manageKeybindingEntry(binding, packageName)
  },


  /* ********** Package Functions ********** */

  activate(state) { // eslint-disable-line no-unused-vars
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add("atom-workspace", "keybindings-manager:toggle", () => { /**/ }))

    this.manageKeybindings()
  },

  deactivate() {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.dispose()
  },
}
