"use babel"

import { CompositeDisposable } from "atom"

class ramdulu {
  static get figo() { return 2105 }
  constructor() {
    console.log(this.constructor.figo, this.badfigo())
  }
}

export default {
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.packages.onDidActivateInitialPackages(() => {
      console.log(new ramdulu())
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },
}
