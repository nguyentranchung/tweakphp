import { autoUpdater } from 'electron-updater'
import { UpdateInfo } from 'builder-util-runtime'
import { BrowserWindow } from 'electron'

export const init = async (window: BrowserWindow) => {
  autoUpdater.autoDownload = false
  if (process.env.DEV) {
    autoUpdater.forceDevUpdateConfig = true
  }
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    console.log('sending update.available')
    window.webContents.send('update.available', info)
  })
}

export const checkForUpdates = async () => {
  await autoUpdater.checkForUpdates()
}
