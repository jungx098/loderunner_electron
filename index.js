const { app, BrowserWindow } = require('electron')

let win

// function createWindow
function createWindow() {
    win = new BrowserWindow({
        width:  1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('LodeRunner_TotalRecall/lodeRunner.html')

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)
