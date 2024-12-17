const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const glob = require('glob')

function cleanup() {
    const files = glob.sync(path.join(__dirname, 'clients', '*.phar'))
    files.forEach(file => {
        fs.unlinkSync(file)
    })
}

async function downloadFile(url, output) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${url}`)

    const destPath = path.resolve(__dirname, '..', output)
    fs.mkdirSync(path.dirname(destPath), { recursive: true })

    const fileStream = fs.createWriteStream(destPath)
    response.body.pipe(fileStream)

    return new Promise((resolve, reject) => {
        fileStream.on('finish', resolve)
        fileStream.on('error', reject)
    })
}

async function main() {
    cleanup()

    fetch('https://api.github.com/repos/tweakphp/client/releases/latest')
        .then(response => response.json())
        .then(data => {
            data.assets.forEach(async asset => {
                const url = asset.browser_download_url
                const filePath = path.join(__dirname, 'clients', asset.name)
                await downloadFile(url, filePath)
            })
        })
        .catch(err => {
            console.error('Error fetching release data:', err.message)
        })
}

main().then()
