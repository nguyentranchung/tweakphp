import { fileURLToPath } from 'url'
import path from 'path'
import * as fs from 'node:fs'
import * as lsp from './lsp/index.js'
import { app } from 'electron'
import * as php from './php'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const laravelPath = app.isPackaged ? path.join(process.resourcesPath, 'laravel') : path.join(__dirname, 'laravel')

const settingsPath = path.join(__dirname, 'settings.json')

const defaultSettings = {
    laravelPath: laravelPath,
    php: '/Users/saeed/Library/Application Support/Herd/bin/php',
    theme: 'dracula',
    editorFontSize: 15,
    editorWordWrap: 'on',
    layout: 'vertical',
}

export const storeSettings = async (event, data) => {
    fs.writeFileSync(settingsPath, JSON.stringify(data))
    await lsp.init()
}

export const getSettings = () => {
    let settings = null

    if (fs.existsSync(settingsPath)) {
        settings = fs.readFileSync(settingsPath).toString()
    }

    if (settings) {
        settings = JSON.parse(settings)
    } else {
        settings = defaultSettings
    }

    // merge default settings with stored settings and take stored settings as priority
    return {
        ...defaultSettings,
        ...settings,
    }
}
