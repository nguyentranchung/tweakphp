import path from 'path'
import { exec } from 'child_process'
import { app, ipcMain } from 'electron'
import * as settings from './settings'
import * as php from './php'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const init = async () => {
  ipcMain.on('client.execute', execute)
  ipcMain.on('client.info', info)
}

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

export const execute = async (
  event: Electron.IpcMainEvent,
  data: { code: string; php: string; path: string; phar_client: string; docker_container_id: string }
) => {
  const phpPath = `"${data.php}"`;
  const path = `"${data.path}"`;
  const code = btoa(data.code.replaceAll('<?php', ''));

  const pharClient = data.docker_container_id ? data.phar_client : getClient();

  const command = data.docker_container_id
    ? `docker exec ${data.docker_container_id} ${phpPath} ${pharClient} ${path} execute ${code}`
    : `${phpPath} ${pharClient} ${path} execute ${code}`;

  console.log(command)

  exec(command, (stdout, stderr) => {
    let result: string = ''

    if (stderr) {
      result += stderr
      event.reply('client.execute.reply', result)
      return
    }

    result += stdout
    result = result.trim()

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
