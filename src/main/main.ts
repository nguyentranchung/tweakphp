import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import * as source from './source'
import * as client from './client'
import * as settings from './settings'
import * as php from './php'
import * as lsp from './lsp/index'
import * as laravel from './laravel'
import log from 'electron-log/main'
import * as dotenv from 'dotenv'

Object.assign(console, log.functions)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

app.whenReady().then(async () => {
  await lsp.init()

  const trayIconPath: string = path.join(app.getAppPath(), 'src/main/tray/IconTemplate.png')
  const tray = new Tray(nativeImage.createFromPath(trayIconPath))
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
      preload: path.join(__dirname, 'preload.mjs'),
      // webSecurity: false,
    },
    alwaysOnTop: false,
    icon: path.join(app.getAppPath(), 'build/icon.png'),
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    await window.loadURL(process.env.VITE_DEV_SERVER_URL)
    window.webContents.openDevTools()
  } else {
    await window.loadFile(path.join(__dirname, `./index.html`))
  }

  ipcMain.on('init', async event => {
    laravel.init()
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

app.on('before-quit', async () => {
  await lsp.shutdown()
})
