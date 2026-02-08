const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

let win

// Path to store window bounds
const boundsFilePath = path.join(app.getPath('userData'), 'window-bounds.json')

// Load window bounds from file
function loadWindowBounds() {
    try {
        if (fs.existsSync(boundsFilePath)) {
            const data = fs.readFileSync(boundsFilePath, 'utf8')
            return JSON.parse(data)
        }
    } catch (error) {
        console.error('Error loading window bounds:', error)
    }
    // Return default bounds if no saved bounds exist
    return { width: 1024, height: 768 }
}

// Save window bounds to file
function saveWindowBounds() {
    try {
        const bounds = win.getBounds()
        fs.writeFileSync(boundsFilePath, JSON.stringify(bounds), 'utf8')
    } catch (error) {
        console.error('Error saving window bounds:', error)
    }
}

// function createWindow
function createWindow() {
    const bounds = loadWindowBounds()

    win = new BrowserWindow({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('LodeRunner_TotalRecall/lodeRunner.html')

    // Save window bounds when resized or moved
    win.on('resize', saveWindowBounds)
    win.on('move', saveWindowBounds)

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)
