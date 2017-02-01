"use babel"

export default [
  {},
  { action: { _ACTION_: true } },
  { action: "_ACTION_" },
  {
    action: "remove",
    package: "_PACKAGE_",
  },
  {
    action: "remove",
    package: "keybindings-manager",
    selector: "_SELECTOR_~!@#$%^&*()_+",
  },
  {
    action: "remove",
    package: "keybindings-manager",
    selector: "atom-workspace",
    command: "_COMMAND_",
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
    keystrokes: "_KEY-STOKES_",
  },
  {
    __valid: true,
    action: "remove",
    package: "keybindings-manager",
    selector: "atom-workspace",
    command: "keybindings-manager:toggle",
    keystrokes: "ctrl-alt-o",
  },


  {
    action: "change",
    package: ["go-to-line"],
  },
  {
    action: "change",
    package: "go-to-line",
    selector: ".platform-win32 .go-to-line atom-text-editor[mini]",
    command: "core:cancel",
    keystrokes: "ctrl-w",
  },
  {
    action: "change",
    package: ["go-to-line", "go-to-line"],
    selector: ".platform-win32 .go-to-line atom-text-editor[mini]",
    command: "core:cancel",
    keystrokes: "ctrl-w",
  },
  {
    __valid: true,
    action: "change",
    package: ["go-to-line", "go-to-line"],
    selector: ".platform-win32 .go-to-line atom-text-editor[mini]",
    command: "core:cancel",
    keystrokes: ["ctrl-w", "ctrl-alt-p"],
  },
]
