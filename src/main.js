import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, ipcRenderer } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import * as source from './source.js'
import * as client from './client.js'
import * as settings from './settings.js'
import * as php from './php.js'
import * as lsp from './lsp/index.js'
import log from 'electron-log/main'
import * as dotenv from 'dotenv'

Object.assign(console, log.functions)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

app.whenReady().then(async () => {
    await lsp.init()

    const tray = new Tray(nativeImage.createFromPath(path.join(__dirname, './tray/IconTemplate.png')))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: () => {
                app.quit()
            },
        },
    ])
    tray.setContextMenu(contextMenu)

    const window = new BrowserWindow({
        minWidth: 1000,
        minHeight: 600,
        width: 1000,
        height: 600,
        maximizable: false,
        minimizable: false,
        resizable: true,
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // webSecurity: false,
        },
        alwaysOnTop: false,
    })

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        await window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
        window.webContents.openDevTools()
    } else {
        await window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
    }

    ipcMain.on('init', async (event, data) => {
        event.reply('init.reply', {
            settings: settings.getSettings(),
        })
    })
    ipcMain.on('settings.store', settings.storeSettings)
    ipcMain.on('client.execute', client.execute)
    ipcMain.on('client.info', client.info)
    ipcMain.on('source.open', source.open)
    ipcMain.on('php.path', php.path)
    // ipcMain.on('ssh.connect', ssh.connect)
})

app.on('window-all-closed', () => {
    app.quit()
})

app.on('before-quit', async event => {
    await lsp.shutdown()
})
