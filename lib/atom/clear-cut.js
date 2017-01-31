// source: .scripts/atom/clear-cut/index.js
/* eslint-disable */

// [...]

if (global.document) {
  var validSelectorCache = {};
  var testSelectorElement = global.document.createElement('div');

  exports.isSelectorValid = function(selector) {
    var valid = validSelectorCache[selector];
    if (valid === undefined) {
      try {
        testSelectorElement.querySelector(selector);
        valid = true;
      } catch (error) {
        valid = false;
      }
      validSelectorCache[selector] = valid;
    }
    return valid;
  }

  // [...]
}
