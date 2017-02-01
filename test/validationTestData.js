"use babel"

export default [
  {},
  { action: { _ERROR_: true } },
  { action: "_ERROR_" },
  {
    action: "remove",
    package: "_ERROR_",
  },
  {
    action: "remove",
    package: "keybindings-manager",
    selector: "_ERROR_~!@#$%^&*()_+",
  },
  {
    action: "remove",
    package: "keybindings-manager",
    selector: "atom-workspace",
    command: "_ERROR_",
  },
  {
    package: "keybindings-manager",
    selector: "atom-workspace",
    command: "native!",
    action: "add",
  },
  {
    action: "remove",
    package: "keybindings-manager",
    selector: "atom-workspace",
    command: "keybindings-manager:toggle",
    keystrokes: "_ERROR_",
  },
  {
    _valid: true,
    action: "remove",
    package: "keybindings-manager",
    selector: "atom-workspace",
    command: "keybindings-manager:toggle",
    keystrokes: "ctrl-alt-o",
  },


  {
    action: "remove",
    package: ["keybindings-manager"],
  },
  {
    _valid: true,
    action: "change",
    package: "go-to-line",
    selector: ".platform-win32 .go-to-line atom-text-editor[mini]",
    command: "core:cancel",
    keystrokes: ["ctrl-w", "ctrl-alt-p"],
  },
]
