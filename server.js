const fs = require("fs");
const JSON5 = require('json5')
const path = process.argv[2]

const express = require('express')
const mustacheExpress = require('mustache-express');
const app = express()
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
const port = 3000


const naming = {
    application: 'Main Area',
    apputils: 'Main Area',
    completer: 'Completer',
    console: 'Console',
    docmanager: 'File Operations',
    documentsearch: 'File Operations',
    editmenu: 'Editing',
    filebrowser: 'File Operations',
    filemenu: 'File Operations',
    imageviewer: 'Image Viewer',
    inspector: 'Inspector',
    kernelmenu: 'Kernel Operations',
    launcher: 'Main Area',
    notebook: 'Notebook Cell Operations',
    runmenu: 'Run Menu',
    settingeditor: 'Settings Editor',
    tabsmenu: 'Main Area',
    tooltip: 'Tooltips',
    viewmenu: 'Notebook Operations',
}

const keysOrdered = [
    
    'Main Area',
    'File Operations',
    'Image Viewer',
    'Settings Editor',
    'Inspector',
    
    'Notebook Cell Operations',

    'Tooltips',
    'Notebook Operations',
    'Run Menu',
    'Kernel Operations',
    'Editing',
    'Console',
    'Completer',

    // 'Help',
]

function getCategory(item) {
    const baseName = item.command.split(':')[0]
    return naming[baseName]
}

function getTitle(item) {
    const base = item.command.split(':')[1]
    const words = base.split('-')
    return words.join(' ')
}

function generateData() {
    // Parse config to object
    const json = fs.readFileSync(path);
    const shortcuts = JSON5.parse(json).shortcuts
    
    let cat = shortcuts.map(sc => getCategory(sc))
    cat = [... new Set(cat)] // remove duplicates

    const viewData = cat.reduce((prev, val) => {
        prev[val] = []
        return prev
    }, {})
    
    // Populate categories with data
    for (const key in shortcuts) {
        const item = shortcuts[key]
        category = getCategory(item)
        viewData[category].push({
            id: item.command,
            action: getTitle(item),
            keys: item.keys.map(item => item != ''? item.split(' ') : [])
        })
    }
    
    // convert back to array of category objects
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