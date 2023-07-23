import { ipcRenderer, contextBridge } from 'electron'

// 'ipcRenderer' will be available in index.js with the method 'window.electron'
contextBridge.exposeInMainWorld('electron', {
  send: (command: string, payload: any) => ipcRenderer.send(command, payload),
  on: (command: string, func: (...args: any) => any) =>
    ipcRenderer.on(command, (event, args) => {
      func(event, args)
    }),
  invoke: (command: string, payload: any) => ipcRenderer.invoke(command, payload),
  test: () => {
    console.log('我是通过 window.electron.test()触发')
  }
})
