# 项目结构

- electron # 主进程 修改后需要 npm run build 生效
- renderer # 渲染进程
- main # 编译后文件

# Development 🛠

I recommend using Volta: https://volta.sh for using Node.js.
Download and install volta, then do: `volta install node`.

```bash
# FOR EVERYONE
git clone https://github.com/Stuckinendlesschaos/upscayl
cd upscayl

# INSTALL DEPENDENCIES
npm install

#IPCMAIN PROCESSION REBUILD TO MAKE IT VALID
npm run build

# RUN THE DEVELOPMENT SERVER LOCALLY
## YOUR LOGS WILL NOW APPEAR IN THE TERMINAL
npm run dev

# FOR DEVS
## PACKAGE THE APP
npm run dist

## PUBLISH THE APP, MAKE SURE TO ADD GH_TOKEN= IN SHELL
npm run publish-app
```

# Credits ❤

- Real-ESRGAN for their wonderful research work.\
[Real-ESRGAN: Copyright (c) 2021, Xintao Wang](https://github.com/xinntao/Real-ESRGAN/)

- Foolhardy for their [Remacri model](https://upscale.wiki/wiki/Model_Database).
- [Kim2091](https://upscale.wiki/wiki/User:Kim2091)	for their [Ultrasharp and Ultramix Balanced model](https://upscale.wiki/wiki/Model_Database).
