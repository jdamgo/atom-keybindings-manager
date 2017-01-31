/* eslint-disable */

var ENDS_IN_MODIFIER_REGEX, KEY_NAMES_BY_KEYBOARD_EVENT_CODE, KeyboardLayout, LATIN_KEYMAP_CACHE, MODIFIERS, NON_CHARACTER_KEY_NAMES_BY_KEYBOARD_EVENT_KEY, WHITESPACE_REGEX, buildKeyboardEvent, calculateSpecificity, isASCIICharacter, isKeyup, isLatinCharacter, isLatinKeymap, isLowerCaseCharacter, isUpperCaseCharacter, nonAltModifiedKeyForKeyboardEvent, normalizeKeystroke, parseKeystroke, usCharactersForKeyCode, usKeymap;

calculateSpecificity = require('clear-cut').calculateSpecificity;

KeyboardLayout = require('keyboard-layout');

MODIFIERS = new Set(['ctrl', 'alt', 'shift', 'cmd']);

ENDS_IN_MODIFIER_REGEX = /(ctrl|alt|shift|cmd)$/;

WHITESPACE_REGEX = /\s+/;

KEY_NAMES_BY_KEYBOARD_EVENT_CODE = {
  'Space': 'space',
  'Backspace': 'backspace'
};

NON_CHARACTER_KEY_NAMES_BY_KEYBOARD_EVENT_KEY = {
  'Control': 'ctrl',
  'Meta': 'cmd',
  'ArrowDown': 'down',
  'ArrowUp': 'up',
  'ArrowLeft': 'left',
  'ArrowRight': 'right'
};

LATIN_KEYMAP_CACHE = new WeakMap();

isLatinKeymap = function(keymap) {
  var isLatin;
  if (keymap == null) {
    return true;
  }
  isLatin = LATIN_KEYMAP_CACHE.get(keymap);
  if (isLatin != null) {
    return isLatin;
  } else {
    isLatin = ((keymap.KeyA == null) || isLatinCharacter(keymap.KeyA.unmodified)) && ((keymap.KeyS == null) || isLatinCharacter(keymap.KeyS.unmodified)) && ((keymap.KeyD == null) || isLatinCharacter(keymap.KeyD.unmodified)) && ((keymap.KeyF == null) || isLatinCharacter(keymap.KeyF.unmodified));
    LATIN_KEYMAP_CACHE.set(keymap, isLatin);
    return isLatin;
  }
};

isASCIICharacter = function(character) {
  return (character != null) && character.length === 1 && character.charCodeAt(0) <= 127;
};

isLatinCharacter = function(character) {
  return (character != null) && character.length === 1 && character.charCodeAt(0) <= 0x024F;
};

isUpperCaseCharacter = function(character) {
  return (character != null) && character.length === 1 && character.toLowerCase() !== character;
};

isLowerCaseCharacter = function(character) {
  return (character != null) && character.length === 1 && character.toUpperCase() !== character;
};

usKeymap = null;

usCharactersForKeyCode = function(code) {
  if (usKeymap == null) {
    usKeymap = require('./us-keymap');
  }
  return usKeymap[code];
};

exports.normalizeKeystrokes = function(keystrokes) {
  var j, keystroke, len, normalizedKeystroke, normalizedKeystrokes, ref;
  normalizedKeystrokes = [];
  ref = keystrokes.split(WHITESPACE_REGEX);
  for (j = 0, len = ref.length; j < len; j++) {
    keystroke = ref[j];
    if (normalizedKeystroke = normalizeKeystroke(keystroke)) {
      normalizedKeystrokes.push(normalizedKeystroke);
    } else {
      return false;
    }
  }
  return normalizedKeystrokes.join(' ');
};

normalizeKeystroke = function(keystroke) {
  var i, j, key, keys, keyup, len, modifiers, primaryKey;
  if (keyup = isKeyup(keystroke)) {
    keystroke = keystroke.slice(1);
  }
  keys = parseKeystroke(keystroke);
  if (!keys) {
    return false;
  }
  primaryKey = null;
  modifiers = new Set;
  for (i = j = 0, len = keys.length; j < len; i = ++j) {
    key = keys[i];
    if (MODIFIERS.has(key)) {
      modifiers.add(key);
    } else {
      if (i === keys.length - 1) {
        primaryKey = key;
      } else {
        return false;
      }
    }
  }
  if (keyup) {
    if (primaryKey != null) {
      primaryKey = primaryKey.toLowerCase();
    }
  } else {
    if (isUpperCaseCharacter(primaryKey)) {
      modifiers.add('shift');
    }
    if (modifiers.has('shift') && isLowerCaseCharacter(primaryKey)) {
      primaryKey = primaryKey.toUpperCase();
    }
  }
  keystroke = [];
  if (!keyup || (keyup && (primaryKey == null))) {
    if (modifiers.has('ctrl')) {
      keystroke.push('ctrl');
    }
    if (modifiers.has('alt')) {
      keystroke.push('alt');
    }
    if (modifiers.has('shift')) {
      keystroke.push('shift');
    }
    if (modifiers.has('cmd')) {
      keystroke.push('cmd');
    }
  }
  if (primaryKey != null) {
    keystroke.push(primaryKey);
  }
  keystroke = keystroke.join('-');
  if (keyup) {
    keystroke = "^" + keystroke;
  }
  return keystroke;
};

parseKeystroke = function(keystroke) {
  var character, index, j, keyStart, keys, len;
  keys = [];
  keyStart = 0;
  for (index = j = 0, len = keystroke.length; j < len; index = ++j) {
    character = keystroke[index];
    if (character === '-') {
      if (index > keyStart) {
        keys.push(keystroke.substring(keyStart, index));
        keyStart = index + 1;
        if (keyStart === keystroke.length) {
          return false;
        }
      }
    }
  }
  if (keyStart < keystroke.length) {
    keys.push(keystroke.substring(keyStart));
  }
  return keys;
};

exports.keystrokeForKeyboardEvent = function(event, customKeystrokeResolvers) {
  var altKey, characters, code, ctrlKey, customKeystroke, isNonCharacterKey, j, key, keystroke, len, metaKey, nonAltModifiedKey, ref, ref1, resolver, shiftKey;
  key = event.key, code = event.code, ctrlKey = event.ctrlKey, altKey = event.altKey, shiftKey = event.shiftKey, metaKey = event.metaKey;
  if (key === 'Dead') {
    if (process.platform === 'darwin' && (characters = (ref = KeyboardLayout.getCurrentKeymap()) != null ? ref[event.code] : void 0)) {
      if (altKey && shiftKey && (characters.withAltGraphShift != null)) {
        key = characters.withAltGraphShift;
      } else if (altKey && (characters.withAltGraph != null)) {
        key = characters.withAltGraph;
      } else if (shiftKey && (characters.withShift != null)) {
        key = characters.withShift;
      } else if (characters.unmodified != null) {
        key = characters.unmodified;
      }
    }
  }
  if (KEY_NAMES_BY_KEYBOARD_EVENT_CODE[code] != null) {
    key = KEY_NAMES_BY_KEYBOARD_EVENT_CODE[code];
  }
  if (process.platform === 'linux') {
    if (code === 'NumpadDecimal' && !event.getModifierState('NumLock')) {
      key = 'delete';
    }
    if (code === 'IntlRo' && key === 'Unidentified' && ctrlKey) {
      key = '/';
    }
  }
  isNonCharacterKey = key.length > 1;
  if (isNonCharacterKey) {
    key = (ref1 = NON_CHARACTER_KEY_NAMES_BY_KEYBOARD_EVENT_KEY[key]) != null ? ref1 : key.toLowerCase();
  } else {
    if (event.getModifierState('AltGraph') || (process.platform === 'darwin' && altKey)) {
      if (process.platform === 'darwin' && event.code) {
        nonAltModifiedKey = nonAltModifiedKeyForKeyboardEvent(event);
        if (nonAltModifiedKey && (ctrlKey || metaKey || !isASCIICharacter(key))) {
          key = nonAltModifiedKey;
        } else if (key !== nonAltModifiedKey) {
          altKey = false;
        }
      } else if (process.platform === 'win32' && event.code) {
        nonAltModifiedKey = nonAltModifiedKeyForKeyboardEvent(event);
        if (nonAltModifiedKey && (metaKey || !isASCIICharacter(key))) {
          key = nonAltModifiedKey;
        } else if (key !== nonAltModifiedKey) {
          ctrlKey = false;
          altKey = false;
        }
      } else if (process.platform === 'linux') {
        nonAltModifiedKey = nonAltModifiedKeyForKeyboardEvent(event);
        if (nonAltModifiedKey && (ctrlKey || altKey || metaKey)) {
          key = nonAltModifiedKey;
          altKey = event.getModifierState('AltGraph');
        }
      }
    }
    if (shiftKey) {
      key = key.toUpperCase();
    } else {
      key = key.toLowerCase();
    }
  }
  if ((key.length === 1 && !isLatinKeymap(KeyboardLayout.getCurrentKeymap())) || (metaKey && KeyboardLayout.getCurrentKeyboardLayout() === 'com.apple.keylayout.DVORAK-QWERTYCMD')) {
    if (characters = usCharactersForKeyCode(event.code)) {
      if (event.shiftKey) {
        key = characters.withShift;
      } else {
        key = characters.unmodified;
      }
    }
  }
  keystroke = '';
  if (key === 'ctrl' || (ctrlKey && event.type !== 'keyup')) {
    keystroke += 'ctrl';
  }
  if (key === 'alt' || (altKey && event.type !== 'keyup')) {
    if (keystroke.length > 0) {
      keystroke += '-';
    }
    keystroke += 'alt';
  }
  if (key === 'shift' || (shiftKey && event.type !== 'keyup' && (isNonCharacterKey || (isLatinCharacter(key) && isUpperCaseCharacter(key))))) {
    if (keystroke) {
      keystroke += '-';
    }
    keystroke += 'shift';
  }
  if (key === 'cmd' || (metaKey && event.type !== 'keyup')) {
    if (keystroke) {
      keystroke += '-';
    }
    keystroke += 'cmd';
  }
  if (!MODIFIERS.has(key)) {
    if (keystroke) {
      keystroke += '-';
    }
    keystroke += key;
  }
  if (event.type === 'keyup') {
    keystroke = normalizeKeystroke("^" + keystroke);
  }
  if (customKeystrokeResolvers != null) {
    for (j = 0, len = customKeystrokeResolvers.length; j < len; j++) {
      resolver = customKeystrokeResolvers[j];
      customKeystroke = resolver({
        keystroke: keystroke,
        event: event,
        layoutName: KeyboardLayout.getCurrentKeyboardLayout(),
        keymap: KeyboardLayout.getCurrentKeymap()
      });
      if (customKeystroke) {
        keystroke = normalizeKeystroke(customKeystroke);
      }
    }
  }
  return keystroke;
};

nonAltModifiedKeyForKeyboardEvent = function(event) {
  var characters, ref;
  if (event.code && (characters = (ref = KeyboardLayout.getCurrentKeymap()) != null ? ref[event.code] : void 0)) {
    if (event.shiftKey) {
      return characters.withShift;
    } else {
      return characters.unmodified;
    }
  }
};

exports.MODIFIERS = MODIFIERS;

exports.characterForKeyboardEvent = function(event) {
  if (event.key.length === 1 && !(event.ctrlKey || event.metaKey)) {
    return event.key;
  }
};

exports.calculateSpecificity = calculateSpecificity;

exports.isBareModifier = function(keystroke) {
  return ENDS_IN_MODIFIER_REGEX.test(keystroke);
};

exports.isModifierKeyup = function(keystroke) {
  return isKeyup(keystroke) && ENDS_IN_MODIFIER_REGEX.test(keystroke);
};

exports.isKeyup = isKeyup = function(keystroke) {
  return keystroke.startsWith('^') && keystroke !== '^';
};

exports.keydownEvent = function(key, options) {
  return buildKeyboardEvent(key, 'keydown', options);
};

exports.keyupEvent = function(key, options) {
  return buildKeyboardEvent(key, 'keyup', options);
};

exports.getModifierKeys = function(keystroke) {
  var j, key, keys, len, mod_keys;
  keys = keystroke.split('-');
  mod_keys = [];
  for (j = 0, len = keys.length; j < len; j++) {
    key = keys[j];
    if (MODIFIERS.has(key)) {
      mod_keys.push(key);
    }
  }
  return mod_keys;
};

buildKeyboardEvent = function(key, eventType, arg) {
  var alt, altKey, bubbles, cancelable, cmd, ctrl, ctrlKey, event, keyCode, location, metaKey, ref, shift, shiftKey, target;
  ref = arg != null ? arg : {}, ctrl = ref.ctrl, shift = ref.shift, alt = ref.alt, cmd = ref.cmd, keyCode = ref.keyCode, target = ref.target, location = ref.location;
  ctrlKey = ctrl != null ? ctrl : false;
  altKey = alt != null ? alt : false;
  shiftKey = shift != null ? shift : false;
  metaKey = cmd != null ? cmd : false;
  bubbles = true;
  cancelable = true;
  event = new KeyboardEvent(eventType, {
    key: key,
    ctrlKey: ctrlKey,
    altKey: altKey,
    shiftKey: shiftKey,
    metaKey: metaKey,
    bubbles: bubbles,
    cancelable: cancelable
  });
  if (target != null) {
    Object.defineProperty(event, 'target', {
      get: function() {
        return target;
      }
    });
    Object.defineProperty(event, 'path', {
      get: function() {
        return [target];
      }
    });
  }
  return event;
};

// ---
// generated by coffee-script 1.9.2
// ---
// https://github.com/atom/atom-keymap/blob/ed287cc84d382515772d0edd891cac04bd425ad2/src/helpers.coffee
// 31-01-2017 02:23
