"use babel"


/* ********** ********** Imports ********** ********** */

/* *** Node.js *** */
import ExtendableError from "es6-error"


/* ********** ********** Classes ********** ********** */

export class FatalError extends ExtendableError {}

export class ModificationParsingError extends ExtendableError {
  constructor(errcode, modification, property, propertyValue) {
    super()

    let message
    switch (errcode) {
    case this.ERRCODE.UNDEFINED:
      message = `Property '${property}' missing!`
      break
    case this.ERRCODE.ADD_NATIVE:
      message = "Cannot add native commands!"
      break
    case this.ERRCODE.TYPE: message = "Type"; break
    case this.ERRCODE.SYNTAX: message = "Syntax"; break
    case this.ERRCODE.VALUE: message = "Value"; break
    default: throw new FatalError(`Unknown error code in '${this.name}'!${errcode ? ` (${errcode})` : ""}`)
    }
    if (errcode !== this.ERRCODE.UNDEFINED && errcode !== this.ERRCODE.ADD_NATIVE)
      message = `${message} of property '${property}' not valid! ('${propertyValue}')`

    this.message = `${this.name}: ${message} @ ${`${modification.package}/${modification.command}[${modification.keystrokes}]`}`
  }
}
ModificationParsingError.prototype.ERRCODE = {
  UNDEFINED: Symbol("ModificationParsingError.ERRCODE.UNDEFINED"),
  TYPE: Symbol("ModificationParsingError.ERRCODE.TYPE"),
  VALUE: Symbol("ModificationParsingError.ERRCODE.VALUE"),
  SYNTAX: Symbol("ModificationParsingError.ERRCODE.SYNTAX"),
  ADD_NATIVE: Symbol("ModificationParsingError.ERRCODE.ADD_NATIVE"),
}
