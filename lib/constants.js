"use babel"


/* ********** ********** Variables ********** ********** */

/* *** Package Information *** */
export const PACKAGE_NAME = "keybindings-manager"
export const PACKAGE_GITHUB = "jdamgo/keybindings-manager"

/* *** Modification Actions *** */
export const ADD_ACTION = "add"
export const CHANGE_ACTION = "change"
export const REMOVE_ACTION = "remove"
export const ALL_ACTIONS = [ADD_ACTION, CHANGE_ACTION, REMOVE_ACTION]

/* *** Special Modification Values *** */
export const CORE_PACKAGE_NAME = "core!"
export const NATIVE_COMMAND_STRING = "native!"

/* *** others *** */
// last line of description field on notifications
export const NOTIFICATION_SIGNATURE = `<sub>_[${PACKAGE_NAME}](http://github.com/${PACKAGE_GITHUB})_</sub>`
