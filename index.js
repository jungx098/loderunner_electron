const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

let win

// Path to store window bounds
const boundsFilePath = path.join(app.getPath('userData'), 'window-state.json')

// Load window state from file
function loadWindowState() {
    try {
        if (fs.existsSync(boundsFilePath)) {
            const data = fs.readFileSync(boundsFilePath, 'utf8')
            return JSON.parse(data)
        }
    } catch (error) {
        console.error('Error loading window state:', error)
    }
    // Return default state if no saved state exists
    return { width: 1024, height: 768, isMaximized: false, isFullScreen: false }
}

// Save window state to file
function saveWindowState() {
    try {
        const state = {
            ...win.getBounds(),
            isMaximized: win.isMaximized(),
            isFullScreen: win.isFullScreen()
        }
        fs.writeFileSync(boundsFilePath, JSON.stringify(state), 'utf8')
    } catch (error) {
        console.error('Error saving window state:', error)
    }
}

// function createWindow
function createWindow() {
    const state = loadWindowState()

    win = new BrowserWindow({
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // Restore maximized and fullscreen state
    if (state.isMaximized) {
        win.maximize()
    }
    if (state.isFullScreen) {
        win.setFullScreen(true)
    }

    win.loadFile('LodeRunner_TotalRecall/lodeRunner.html')

    // Save window state when resized, moved, maximized, or fullscreen changed
    win.on('resize', saveWindowState)
    win.on('move', saveWindowState)
    win.on('maximize', saveWindowState)
    win.on('unmaximize', saveWindowState)
    win.on('enter-full-screen', saveWindowState)
    win.on('leave-full-screen', saveWindowState)

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)
