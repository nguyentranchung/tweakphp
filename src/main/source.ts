import { dialog } from 'electron'
import { IpcMainEvent } from 'electron'

export const open = async (event: IpcMainEvent) => {
  // Use shell.openPath to open the specified folder
  dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
    if (!result.canceled) {
      event.reply('source.open.reply', result.filePaths[0])
    }
  })
}
