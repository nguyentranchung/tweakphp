import path from 'path'
import { exec } from 'child_process'
import { app } from 'electron'
import * as settings from './settings'
import * as php from './php'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getClient() {
  const phpVersion = php.getVersion(settings.getSettings().php)
  if (app.isPackaged) {
    return path.join(process.resourcesPath, `public/client-${phpVersion}.phar`)
  }

  if (process.env.CLIENT_PATH) {
    return process.env.CLIENT_PATH
  }

  return path.join(__dirname, `../public/client-${phpVersion}.phar`)
}

export const execute = async (event: Electron.IpcMainEvent, data: { code: string; php: string; path: string }) => {
  let code = data.code.replaceAll('<?php', '')
  code = btoa(code)

  const phpPath = `"${data.php}"`

  const path = `"${data.path}"`

  exec(`${phpPath} ${getClient()} ${path} execute ${code}`, (stdout, stderr) => {
    // format Y-m-d H:i:s
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    let result = '// ' + date + '\n'
    if (stderr) {
      result += stderr
      event.reply('client.execute.reply', result)
      return
    }
    result += stdout

    result = result.trim()

    // Remove surrounding double quotes if present
    if (result.startsWith('"') && result.endsWith('"')) {
      result = result.slice(1, -1)
    }

    event.reply('client.execute.reply', result)
  })
}

export const info = async (event: Electron.IpcMainEvent, data: { php: string; path: string }) => {
  exec(`"${data.php}" ${getClient()} ${data.path} info`, (error, stdout) => {
    if (error) {
      event.reply('client.info.reply', error.message)
      return
    }
    event.reply('client.info.reply', stdout?.replaceAll('\n', ''))
  })
}
