const fs = require("fs");
const JSON5 = require('json5')
const express = require('express')
const mustacheExpress = require('mustache-express');
const app = express()
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
const port = 3000

// Parse config to object
const json = fs.readFileSync("keys.json");
const shortcuts = JSON5.parse(json)

// Build object with categories
let cat = Object.keys(shortcuts).map(val => shortcuts[val].category)
cat = [... new Set(cat)]
let viewData = cat.reduce((prev, val) => {
    prev[val] = []
    return prev
}, {})

// Populate categories with data
for (const key in shortcuts) {
    const item = shortcuts[key]
    viewData[item.category].push({
        action: item.title,
        keys: item.keys
    })
}
// convert back to array of objects
viewData = Object.keys(viewData).map(key => ({title: key, options: viewData[key]}))

console.log(viewData)



// Log all requests
app.use((req, res, next) => {
    console.log(`${process.uptime()}: ${req.method} ${req.url} received from ${req.headers.host}`)
    next()
})

app.get('/', (req, res) => res.render('index', {name: ['Peter', 'Martin']}))

app.listen(port, () => console.log(`App started at http://0.0.0.0:${port}`))