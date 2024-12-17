import { WebSocketServer } from 'ws'
import express from 'express'
import { upgradeWsServer } from './server-commons.js'

let httpServer = null

export const runLanguageServer = async languageServerRunConfig => {
    process.on('uncaughtException', err => {
        console.error('Uncaught Exception: ', err.toString())
        if (err.stack !== undefined) {
            console.error(err.stack)
        }
    })

    const app = express()

    await shutdown()

    // start the http server
    httpServer = app.listen(languageServerRunConfig.serverPort)
    const wss = new WebSocketServer(languageServerRunConfig.wsServerOptions)
    // create the web socket
    upgradeWsServer(languageServerRunConfig, {
        server: httpServer,
        wss,
    })
}

export const shutdown = async () => {
    if (httpServer) {
        await httpServer.close()
    }
}
