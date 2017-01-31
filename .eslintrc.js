module.exports =
{
  "extends": "C:/Users/kilia/.eslintrc.js",

  "parserOptions": { "sourceType": "module" },

  "env": { "node": true, "es6": true },

  "globals": {
    "atom": false
  },

  "rules": {
    "no-magic-numbers": "off",
    "no-multiple-empty-lines": ["warn", { "max": 2 }],
  }
}
