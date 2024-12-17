import { execSync } from 'child_process'

let cachedPhpPath = null

export const path = async event => {
    event.reply('php.path.reply', getPHPPath())
}

export const getPHPPath = () => {
    if (cachedPhpPath) {
        return cachedPhpPath
    }

    try {
        const phpPath = execSync('/usr/bin/which php').toString().trim()
        const escapedPath = phpPath.replace(/ /g, '\\ ')
        cachedPhpPath = escapedPath
        return escapedPath
    } catch (error) {
        console.error(`Error retrieving PHP path: ${error}`)
        throw new Error('Unable to retrieve PHP path')
    }
}

export const getVersion = path => {
    try {
        const command = `"${path}" -r "echo PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . PHP_EOL;"`
        const output = execSync(command, { encoding: 'utf8' })
        return output.trim() // Clean up extra whitespace or newlines
    } catch (error) {
        console.error('Error executing PHP command:', error.message)
        console.error('Stack:', error.stack)
        return null
    }
}
