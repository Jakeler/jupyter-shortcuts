const fs = require("fs");
const JSON5 = require('json5')
const express = require('express')
const mustacheExpress = require('mustache-express');
const app = express()
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
const port = 3000

const json = fs.readFileSync("keys.json");
const shortcuts = JSON5.parse(json)

console.log(Object.keys(shortcuts))

// Log all requests
app.use((req, res, next) => {
    console.log(`${process.uptime()}: ${req.method} ${req.url} received from ${req.headers.host}`)
    next()
})


app.get('/', (req, res) => res.render('index', {name: ['Peter', 'Martin']}))

app.listen(port, () => console.log(`App started at http://0.0.0.0:${port}`))