const fs = require("fs");
const JSON5 = require('json5')

const json = fs.readFileSync("keys.json");
const shortcuts = JSON5.parse(json)

console.log(Object.keys(shortcuts))