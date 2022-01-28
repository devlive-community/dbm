import { UpdateEnum } from '../renderer/enum/update.enum';
import { BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

/**
 * -1 Failed to check the update
 * 0 checking for updates
 * 1 A new version is detected and ready to download
 * 2 No new version is detected
 * 3 Downloading
 * 4 Download completed
**/
function handlerMessage(mainWindow: BrowserWindow, type: Number, data?: String) {
    const updaterMessage = {
        state: type,
        message: data || ''
    }
    console.log(updaterMessage)
    mainWindow.webContents.send('updater', updaterMessage)
}

function handlerUpdater(mainWindow: BrowserWindow) {
    const uploadUrl = 'http://localhost:7777/release/'
    autoUpdater.setFeedURL(uploadUrl)
    autoUpdater.autoDownload = false

    autoUpdater.on('error', (err) => {
        if (err.message.includes('sha512 checksum mismatch')) {
            handlerMessage(mainWindow, UpdateEnum.error, 'sha512 checksum mismatch')
        }
    })

    ipcMain.on('checking-for-update', (event, arg) => {
        console.log('checking-for-update')
        handlerMessage(mainWindow, UpdateEnum.checking)
    })

    autoUpdater.on('update-available', (info) => {
        console.log('update-available')
        handlerMessage(mainWindow, UpdateEnum.hasversion, info)
    })

    autoUpdater.on('update-not-available', (event, arg) => {
        console.log('update-not-available')
        handlerMessage(mainWindow, UpdateEnum.noversion)
    })

    autoUpdater.on('download-progress', (progressObj) => {
        console.log('download-progress')
        handlerMessage(mainWindow, UpdateEnum.downloading, progressObj)
    })

    autoUpdater.on('update-downloaded', () => {
        console.log('update-downloaded')
        handlerMessage(mainWindow, UpdateEnum.completed)
    })

    ipcMain.on('check-update', () => {
        console.log('update-not-available')
        autoUpdater.checkForUpdates().catch(err => {
            handlerMessage(mainWindow, UpdateEnum.failed, err)
        })
    })

    ipcMain.on('confirm-update', () => {
        autoUpdater.quitAndInstall()
    })

    ipcMain.on('confirm-downloadUpdate', () => {
        autoUpdater.downloadUpdate().catch(err => {
            handlerMessage(mainWindow, UpdateEnum.failed, err)
        })
    })
}

export {
    handlerUpdater
}
