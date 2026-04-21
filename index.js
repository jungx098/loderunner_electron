const { app, BrowserWindow, Menu } = require('electron')
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

function createApplicationMenu() {
    const editSubmenu = [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
    ]

    if (process.platform === 'darwin') {
        const template = [
            {
                label: app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            },
            { label: 'Edit', submenu: editSubmenu },
            {
                label: 'Window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'zoom' },
                    { type: 'separator' },
                    { role: 'front' }
                ]
            }
        ]
        Menu.setApplicationMenu(Menu.buildFromTemplate(template))
        return
    }

    // Windows / Linux: File → Quit with Ctrl+Q (macOS uses the app menu for ⌘Q)
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Quit',
                    accelerator: 'Ctrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        { label: 'Edit', submenu: editSubmenu },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        }
    ]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
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
            nodeIntegration: true,
            // loadFile(..., { query }) does not always surface ?sf= on file:// URLs in the
            // renderer; additionalArguments is reliable for startup fullscreen detection.
            additionalArguments: state.isFullScreen ? ['--lode-runner-start-fullscreen'] : []
        }
    })

    // Quit shortcuts must not reach the game: handleKeyDown treats Q as "dig left" and
    // returns false, which blocks default handling and breaks Cmd+Q / Ctrl+Q to quit.
    win.webContents.on('before-input-event', (event, input) => {
        if (input.type !== 'keyDown') return
        const key = typeof input.key === 'string' ? input.key.toLowerCase() : ''
        if (key !== 'q') return
        const quit =
            input.meta ||
            (process.platform !== 'darwin' && input.control)
        if (quit) {
            event.preventDefault()
            app.quit()
        }
    })

    // Restore maximized and fullscreen state
    if (state.isMaximized) {
        win.maximize()
    }
    if (state.isFullScreen) {
        win.setFullScreen(true)
    }

    // Query flags let the renderer size the canvas to the target display on first paint.
    // On macOS, window.innerWidth/Height can still reflect the pre-fullscreen window when
    // init() runs, so startup would letterbox until a later resize.
    win.loadFile('LodeRunner_TotalRecall/lodeRunner.html', {
        query: { sf: state.isFullScreen ? '1' : '0' }
    })

    if (process.env.LODERUNNER_DEBUG === '1') {
        win.webContents.once('did-finish-load', () => {
            win.webContents.openDevTools()
        })
    }

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

app.on('ready', () => {
    createApplicationMenu()
    createWindow()
})
