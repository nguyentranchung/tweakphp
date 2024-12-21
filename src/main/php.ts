import { execSync } from 'child_process'

let cachedPhpPath: string | null = null

import { IpcMainEvent } from 'electron'

export const path = async (event: IpcMainEvent) => {
  event.reply('php.path.reply', getPHPPath())
}

export const getPHPPath = () => {
  if (cachedPhpPath) {
    return cachedPhpPath
  }

  try {
    cachedPhpPath = execSync('/usr/bin/which php').toString().trim()
    return cachedPhpPath
  } catch (error) {
    console.error(`Error retrieving PHP path: ${error}`)
  }

  return ''
}

export const getVersion = (path: string | undefined) => {
  try {
    const command = `"${path}" -r "echo PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . PHP_EOL;"`
    const output = execSync(command, { encoding: 'utf8' })
    return output.trim() // Clean up extra whitespace or newlines
  } catch (error: any) {
    console.error('Error executing PHP command:', error.message)
    console.error('Stack:', error.stack)
    return null
  }
}
