import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

export default function viteUnzipPlugin(options) {
    const { zipPath, outputDir } = options

    return {
        name: 'vite-plugin-unzip',
        buildStart() {
            if (!fs.existsSync(zipPath)) {
                this.error(`ZIP file not found: ${zipPath}`)
            }
            const zip = new AdmZip(zipPath)
            const targetDir = path.resolve(outputDir)

            // Extract files
            zip.extractAllTo(targetDir, true)
            console.log(`Extracted ${zipPath} to ${targetDir}`)
        },
    }
}
