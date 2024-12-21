/// <reference types="vite/client" />

import { IpcRenderer } from '../preload/preload'

interface Window {
  ipcRenderer: IpcRenderer
}
