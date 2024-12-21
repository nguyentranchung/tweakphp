import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

interface ViteUnzipPluginOptions {
  zipPath: string
  outputDir: string
}

export default function viteUnzipPlugin(options: ViteUnzipPluginOptions) {
  const { zipPath, outputDir } = options

  return {
    name: 'vite-plugin-unzip',
    buildStart: () => {
      if (!fs.existsSync(zipPath)) {
        throw new Error(`ZIP file not found: ${zipPath}`)
      }
      const zip = new AdmZip(zipPath)
      const targetDir = path.resolve(outputDir)

      // Extract files
      zip.extractAllTo(targetDir, true)
      console.log(`Extracted ${zipPath} to ${targetDir}`)
    },
  }
}
