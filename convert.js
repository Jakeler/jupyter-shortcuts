const fs = require("fs");
const JSON5 = require('json5')
const express = require('express')
const app = express()

const json = fs.readFileSync("keys.json");
const shortcuts = JSON5.parse(json)

console.log(Object.keys(shortcuts))

const port = 3000

app.get('/', (req, res) => res.send('no World!'))

app.listen(port, () => console.log(`App started at http://0.0.0.0:${port}`))