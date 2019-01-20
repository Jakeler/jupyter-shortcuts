const fs = require("fs");
const JSON5 = require('json5')
const path = process.argv[2]

const express = require('express')
const mustacheExpress = require('mustache-express');
const app = express()
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
const port = 3000

function generateData() {
    // Parse config to object
    const json = fs.readFileSync(path);
    const shortcuts = JSON5.parse(json)
    
    // Build object with categories
    let cat = Object.keys(shortcuts).map(val => shortcuts[val].category)
    cat = [... new Set(cat)]
    
    const viewData = cat.reduce((prev, val) => {
        prev[val] = []
        return prev
    }, {})
    
    // Populate categories with data
    for (const key in shortcuts) {
        const item = shortcuts[key]
        viewData[item.category].push({
            id: item.command,
            action: item.title,
            keys: item.keys.map(item => item != ''? item.split(' ') : [])
        })
    }
    
    const keysOrdered = [   
        'Main Area',
        'File Operations',
        'Image Viewer',
        'Settings Editor',
        'Tooltips',
    
        'Notebook Operations',
        'Run Menu',
        'Kernel Operations',
        'Editing',
        'Console',
        'Completer',
        'Inspector',
    
        'Notebook Cell Operations',
        'Help',
    ]
    // convert back to array of catergory objects
    return keysOrdered.map(key => ({title: key, options: viewData[key]}))
}

// Serve static stylesheet
app.use(express.static('public'));

// Log all requests
app.use((req, res, next) => {
    console.log(`${process.uptime()}: ${req.method} ${req.url} received from ${req.headers.host}`)
    next()
})

app.get('/', (req, res) => {
    const shortcuts = generateData()
    res.render('index', {shortcuts})
})

app.listen(port, () => console.log(`App started at http://0.0.0.0:${port}`))