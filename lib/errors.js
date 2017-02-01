"use babel"


/* ********** ********** Imports ********** ********** */

/* ***** Node.js ***** */
import ExtendableError from "es6-error"


/* ********** ********** Classes ********** ********** */

export class ModificationParsingError extends ExtendableError {
  static get ERRCODE_UNDEFINED() { return "EUNDEFINED" }
  static get ERRCODE_TYPE() { return "EBADTYPE" }
  static get ERRCODE_VALUE() { return "EBADVALUE" }
  static get ERRCODE_SYNTAX() { return "EBADSYNTAX" }
  static get ERRCODE_ADD_NATIVE() { return "EADDNATIVE" }

  constructor(modification, property, errcode) {
    super()
    this.modification = modification
    this.errorProperty = property
    this.code = errcode
    message: {
      let errorTypeString
      switch (errcode) {
      case this.constructor.ERRCODE_UNDEFINED:
        this.message = `Property '${property}' missing!`
        break message
      case this.constructor.ERRCODE_ADD_NATIVE:
        this.message = "Cannot add native commands!"
        break message
      case this.constructor.ERRCODE_TYPE: errorTypeString = "Type"; break
      case this.constructor.ERRCODE_SYNTAX: errorTypeString = "Syntax"; break
      case this.constructor.ERRCODE_VALUE: errorTypeString = "Value"; break
      default:
        throw new Error(`Unknown error code in constructor of '${this.name}'! (${errcode})`)
      }
      this.message = `${errorTypeString} of property '${property}' not valid! ('${modification[property]}')`
    }
  }
}

export class PackageNotAvailableError extends ExtendableError {
  constructor(packageName) {
    super(`Package '${packageName}' not available!`)
    this.packageName = packageName
  }
}

export class KeyBindingQueryError extends ExtendableError {
  constructor(message, queryParams) {
    super(message)
    this.queryParams = queryParams
  }
}

export class KeyBindingNotFoundError extends KeyBindingQueryError {
  constructor(queryParams) {
    super("No key bindings with specified parameters found!", queryParams)
  }
}

export class KeyBindingNotUniqueError extends KeyBindingQueryError {
  constructor(queryParams, queryResults) {
    super("Key bindings cannot be uniquely identified by specified parameters!", queryParams)
    this.queryResults = queryResults
  }
}
