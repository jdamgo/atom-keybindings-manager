"use babel"

export default [
  {
    "action": "remove",
    "package": "archive-view",
    "selector": ".archive-editor",
    "command": "core:move-down",
    "keystrokes": "j"
  },
  {
    "action": "remove",
    "package": "archive-view",
    "selector": ".archive-editor",
    "command": "core:move-up",
    "keystrokes": "k"
  },
  {
    "action": "remove",
    "package": "autoflow",
    "selector": ".platform-win32 atom-text-editor, .platform-linux atom-text-editor",
    "command": "autoflow:reflow-selection",
    "keystrokes": "ctrl-shift-q"
  },
  {
    "action": "remove",
    "package": "build",
    "selector": "atom-workspace, atom-text-editor",
    "command": "build:select-active-target",
    "keystrokes": "f7"
  },
  {
    "action": "remove",
    "package": "build",
    "selector": "atom-workspace, atom-text-editor",
    "command": "build:toggle-panel",
    "keystrokes": "f8"
  },
  {
    "action": "remove",
    "package": "build",
    "selector": "atom-workspace, atom-text-editor",
    "command": "build:trigger",
    "keystrokes": "f9"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "application:new-window",
    "keystrokes": "ctrl-shift-n"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "application:show-settings",
    "keystrokes": "ctrl-,"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:backspace",
    "keystrokes": "shift-backspace"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:close",
    "keystrokes": "ctrl-f4"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:copy",
    "keystrokes": "ctrl-insert"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:cut",
    "keystrokes": "shift-delete"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:move-down",
    "keystrokes": "ctrl-down"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:move-down",
    "keystrokes": "ctrl-shift-down"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:move-up",
    "keystrokes": "ctrl-shift-up"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:move-up",
    "keystrokes": "ctrl-up"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "core:paste",
    "keystrokes": "shift-insert"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "atom-workspace atom-text-editor:not([mini])",
    "command": "editor:indent-selected-rows",
    "keystrokes": "ctrl-]"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "atom-workspace atom-text-editor:not([mini])",
    "command": "editor:join-lines",
    "keystrokes": "ctrl-j"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "atom-workspace atom-text-editor",
    "command": "editor:lower-case",
    "keystrokes": "ctrl-k ctrl-l"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "editor:move-selection-left",
    "keystrokes": "alt-shift-left"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "editor:move-selection-right",
    "keystrokes": "alt-shift-right"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "atom-workspace atom-text-editor:not([mini])",
    "command": "editor:outdent-selected-rows",
    "keystrokes": "ctrl-["
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "atom-workspace atom-text-editor:not([mini])",
    "command": "editor:scroll-to-cursor",
    "keystrokes": "ctrl-<"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "atom-workspace atom-text-editor",
    "command": "editor:select-line",
    "keystrokes": "ctrl-l"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "atom-workspace atom-text-editor",
    "command": "editor:upper-case",
    "keystrokes": "ctrl-k ctrl-u"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "pane:close",
    "keystrokes": "ctrl-k ctrl-w"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "pane:close-other-items",
    "keystrokes": "ctrl-k ctrl-alt-w"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "pane:move-active-item-to-top-of-stack",
    "keystrokes": "ctrl-shift-tab ^ctrl"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "pane:move-active-item-to-top-of-stack",
    "keystrokes": "ctrl-tab ^ctrl"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "pane:split-down-and-copy-active-item",
    "keystrokes": "ctrl-k down"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "pane:split-left-and-copy-active-item",
    "keystrokes": "ctrl-k left"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "pane:split-right-and-copy-active-item",
    "keystrokes": "ctrl-k right"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "pane:split-up-and-copy-active-item",
    "keystrokes": "ctrl-k up"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:close",
    "keystrokes": "ctrl-shift-w"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:focus-next-pane",
    "keystrokes": "ctrl-k ctrl-n"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:focus-pane-above",
    "keystrokes": "ctrl-k ctrl-up"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:focus-pane-below",
    "keystrokes": "ctrl-k ctrl-down"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:focus-pane-on-left",
    "keystrokes": "ctrl-k ctrl-left"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:focus-pane-on-right",
    "keystrokes": "ctrl-k ctrl-right"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:focus-previous-pane",
    "keystrokes": "ctrl-k ctrl-p"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:reload",
    "keystrokes": "ctrl-shift-f5"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:run-package-specs",
    "keystrokes": "ctrl-shift-y"
  },
  {
    "action": "remove",
    "package": "core",
    "selector": "body",
    "command": "window:toggle-dev-tools",
    "keystrokes": "ctrl-shift-i"
  },
  {
    "action": "remove",
    "package": "dev-live-reload",
    "selector": ".platform-win32",
    "command": "dev-live-reload:reload-all",
    "keystrokes": "ctrl-alt-shift-r"
  },
  {
    "action": "remove",
    "package": "encoding-selector",
    "selector": ".platform-win32 atom-text-editor",
    "command": "encoding-selector:show",
    "keystrokes": "ctrl-shift-u"
  },
  {
    "action": "remove",
    "package": "find-and-replace",
    "selector": ".platform-win32, .platform-linux",
    "command": "find-and-replace:show-replace",
    "keystrokes": "ctrl-alt-f"
  },
  {
    "action": "remove",
    "package": "find-and-replace",
    "selector": ".platform-win32 atom-text-editor, .platform-linux atom-text-editor",
    "command": "find-and-replace:use-selection-as-find-pattern",
    "keystrokes": "ctrl-e"
  },
  {
    "action": "remove",
    "package": "go-to-line",
    "selector": ".platform-win32 .go-to-line atom-text-editor[mini]",
    "command": "core:cancel",
    "keystrokes": "ctrl-w"
  },
  {
    "action": "remove",
    "package": "go-to-line",
    "selector": ".go-to-line atom-text-editor[mini]",
    "command": "core:cancel",
    "keystrokes": "escape"
  },
  {
    "action": "remove",
    "package": "settings-view",
    "selector": ".platform-win32, .platform-linux",
    "command": "settings-view:open",
    "keystrokes": "ctrl-,"
  },
  {
    "action": "remove",
    "package": "styleguide",
    "selector": ".platform-win32, .platform-linux",
    "command": "styleguide:show",
    "keystrokes": "ctrl-shift-g"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32, .platform-linux",
    "command": "tree-view:toggle",
    "keystrokes": "ctrl-k ctrl-b"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "core:move-down",
    "keystrokes": "j"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "core:move-up",
    "keystrokes": "k"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "tree-view:collapse-directory",
    "keystrokes": "h"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "tree-view:expand-item",
    "keystrokes": "l"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-down",
    "keystrokes": "ctrl-k down"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-down",
    "keystrokes": "ctrl-k j"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-1",
    "keystrokes": "ctrl-1"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-2",
    "keystrokes": "ctrl-2"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-3",
    "keystrokes": "ctrl-3"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-4",
    "keystrokes": "ctrl-4"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-5",
    "keystrokes": "ctrl-5"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-6",
    "keystrokes": "ctrl-6"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-7",
    "keystrokes": "ctrl-7"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-8",
    "keystrokes": "ctrl-8"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-in-pane-9",
    "keystrokes": "ctrl-9"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-left",
    "keystrokes": "ctrl-k h"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-left",
    "keystrokes": "ctrl-k left"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-right",
    "keystrokes": "ctrl-k l"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-right",
    "keystrokes": "ctrl-k right"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-up",
    "keystrokes": "ctrl-k k"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".platform-win32 .tree-view, .platform-linux .tree-view",
    "command": "tree-view:open-selected-entry-up",
    "keystrokes": "ctrl-k up"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "tree-view:recursive-collapse-directory",
    "keystrokes": "alt-left"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "tree-view:recursive-collapse-directory",
    "keystrokes": "ctrl-alt-["
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "tree-view:recursive-expand-directory",
    "keystrokes": "alt-right"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "tree-view:recursive-expand-directory",
    "keystrokes": "ctrl-alt-]"
  },
  {
    "action": "remove",
    "package": "tree-view",
    "selector": ".tree-view",
    "command": "tree-view:remove",
    "keystrokes": "backspace"
  }
]