import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import { app } from 'electron'
import * as settings from './settings'
import * as php from './php'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getClient(data) {
    const phpVersion = php.getVersion(settings.getSettings().php)
    return app.isPackaged ? path.join(process.resourcesPath, `client-${phpVersion}.phar`) : process.env.CLIENT_PATH
}

export const execute = async (event, data) => {
    let code = data.code.replaceAll('<?php', '')
    code = btoa(code)

    const phpPath = `"${data.php}"`

    const path = `"${data.path}"`

    exec(`${phpPath} ${getClient(data)} ${path} execute ${code}`, (error, stdout, stderr) => {
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

export const info = async (event, data) => {
    exec(`"${data.php}" ${getClient(data)} ${data.path} info`, (error, stdout, stderr) => {
        event.reply('client.info.reply', stdout.replaceAll('\n', ''))
    })
}
