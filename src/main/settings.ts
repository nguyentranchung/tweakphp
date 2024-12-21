import { fileURLToPath } from 'url'
import path from 'path'
import * as fs from 'node:fs'
import * as lsp from './lsp/index'
import { app } from 'electron'
import { Settings } from '../types/settings.type'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const laravelPath = app.isPackaged
  ? path.join(process.resourcesPath, 'public/laravel')
  : path.join(__dirname, 'laravel')

const settingsPath = path.join(__dirname, 'settings.json')

const defaultSettings: Settings = {
  laravelPath: laravelPath,
  php: '/Users/saeed/Library/Application Support/Herd/bin/php',
  theme: 'dracula',
  editorFontSize: 15,
  editorWordWrap: 'on',
  layout: 'vertical',
}

export const storeSettings = async (data: any) => {
  fs.writeFileSync(settingsPath, JSON.stringify(data))
  await lsp.init()
}

export const getSettings = () => {
  let settingsRaw: string = ''
  let settings: Settings = defaultSettings

  if (fs.existsSync(settingsPath)) {
    settingsRaw = fs.readFileSync(settingsPath).toString()
  }

  if (settingsRaw) {
    settings = JSON.parse(settingsRaw)
  } else {
    settings = defaultSettings
  }

  // merge default settings with stored settings and take stored settings as priority
  return {
    ...defaultSettings,
    ...settings,
  }
}
