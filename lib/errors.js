"use babel"


/* ********** ********** Imports ********** ********** */

/* *** Node.js *** */
import ExtendableError from "es6-error"


/* ********** ********** Classes ********** ********** */

// TODO move errors to modification-(validation|modification).js

export class ModificationParsingError extends ExtendableError {
  constructor(errcode, modification, property, propertyValue) {
    super()

    this.reference = modification

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
    default: throw new Error(`Unknown error code in '${this.name}'!${errcode ? ` (${errcode})` : ""}`)
    }
    if (errcode !== this.ERRCODE.UNDEFINED && errcode !== this.ERRCODE.ADD_NATIVE)
      message = `${message} of property '${property}' not valid! ('${propertyValue}')`
    this.message = `${this.name}: ${message} @ ${`${modification.package}/${modification.command}[${modification.keystrokes}]`}`
  }
}
ModificationParsingError.ERRCODE = {
  UNDEFINED: Symbol("ModificationParsingError.ERRCODE.UNDEFINED"),
  TYPE: Symbol("ModificationParsingError.ERRCODE.TYPE"),
  VALUE: Symbol("ModificationParsingError.ERRCODE.VALUE"),
  SYNTAX: Symbol("ModificationParsingError.ERRCODE.SYNTAX"),
  ADD_NATIVE: Symbol("ModificationParsingError.ERRCODE.ADD_NATIVE"),
}
ModificationParsingError.getGenericMessage = function(prefixWithName = true) { return `${prefixWithName ? `${this.name}: ` : ""}Some properties cannot be parsed!` }

export class ModificationPackageNotAvailableError extends ExtendableError {
  constructor(packageName) {
    super()

    this.reference = packageName

    this.message = `${this.name}: Package '${packageName}' not available!`
  }
}
ModificationPackageNotAvailableError.getGenericMessage = function(prefixWithName = true) { return `${prefixWithName ? `${this.name}: ` : ""}Some Packages not available!` }

// TODO error for binding not existing in remove (modificiation-application)

// TODO error for multiple bindings match in remove (modificiation-application)

// TODO error for binding(s) already existing in add (modificiation-application)
