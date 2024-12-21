import fs from 'fs'
import { Settings } from '../types/settings.type'
import { getSettings } from './settings'
import { app } from 'electron'
import path from 'path'
import AdmZip from 'adm-zip'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const init = async () => {
  const settings: Settings = getSettings()

  if (!fs.existsSync(settings.laravelPath)) {
    const zipPath = app.isPackaged
      ? path.join(process.resourcesPath, 'public/laravel.zip')
      : path.join(__dirname, '../public/laravel.zip')
    if (!fs.existsSync(zipPath)) {
      console.error(`ZIP file not found: ${zipPath}`)
      return
    }

    const zip = new AdmZip(zipPath)

    // Extract files to laravelPath's parent directory
    zip.extractAllTo(path.resolve(settings.laravelPath, '..'), true)
    console.log(`Extracted ${zipPath} to ${settings.laravelPath}`)
  }
}
