// require(require("path").join(atom.packages.resolvePackagePath("PACKAGE_NAME"), "PATH_TO_FILE/atom_require"))

const path = require("path")
const fs = require("fs")


function getAtomPackagePath(packageName) {
  if (packageName)
    return atom.packages.resolvePackagePath(packageName)

  for (let packagePath of module.parent.paths) {
    packagePath = packagePath.slice(0, -"node_modules".length)
    if (fs.existsSync(`${packagePath}package.json`))
      return packagePath
  }
  return undefined
}

global.atom_require = (packageName, moduleName) => {
  if (!moduleName)
    moduleName = packageName
  packageName = getAtomPackagePath(packageName)
  if (!packageName)
    throw `Cannot find package ${packageName ? `'${packageName}'` : `of '${module.parent.filename}'`}`

  let returnValue
  try {
    returnValue = require(path.join(packageName, moduleName))
  } catch (err_base) {
    try {
      returnValue = require(path.join(packageName, "lib", moduleName))
    } catch (err_lib) {
      throw err_base
    }
  }
  return returnValue
}
