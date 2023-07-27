const fs = require('fs');
const path = require('path');
import axios from 'axios'
import FormData from 'form-data'

const allowedFileTypes = [".png", ".jpg", ".jpeg", ".webp"];
const BATCH_MAX = 10 // 批处理最大限制个数

export const getFileList = folder => {
    return new Promise((resolve)=>{
        // 收集所有的文件路径
        const fileList:any[] = [];
        //根据文件路径读取文件，返回文件列表
        fs.readdir(folder, (err, files) =>{
            files.forEach((originName) => {
                const name = path.parse(originName).name
                const ext = path.parse(originName).ext
                if(!allowedFileTypes.includes(ext)) return
                if(fileList.length > BATCH_MAX) return
                //获取当前文件的绝对路径
                const filePath = path.join(folder, originName);
                const obj = {
                    filePath,
                    originName,
                    name,
                    ext
                }
                fileList.push(obj)
            });
            resolve(fileList)
        });
    })
}

export const getRemoveBgImgData = (imagePath: string) =>{
  return new Promise((resolve,reject) => {
    const data = new FormData()
    data.append('image', fs.createReadStream(imagePath))
    const config = {
        method: 'post',
        url: 'https://pixian.ai/api/v1/remove-background',
        responseType: 'arraybuffer',
        headers: {
        Authorization:
            'Basic cHhkOWlsN2tjeWE1cWZlOmc5bWdxdWhpMjM4OWw3aXQxZzd0anRrNjhzcHB0OHMwam9wNHZ1ZjR0aWh0c3Y0OTc5YWI=',
        Accept: '*/*',
        Host: 'pixian.ai',
        Connection: 'keep-alive',
        'Content-Type':
            'multipart/form-data; boundary=--------------------------770839930141001909509711',
        // @ts-ignore
        //   ...data.getHeaders(),
        },
        data: data,
    }
    // @ts-ignore
    axios(config).then((response) => {
        const imgData = Buffer.from(response.data, 'base64') //Buffer编码
        resolve(imgData)
    })
    .catch((error) => {
        console.error('axios error >>>>>> ', error)
        reject("")
    })
  })
}

export const obtainGenerativeImage = (imagePath: string,prompt: string,negativePrompt: string, randomSeed: number) => {
    return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('prompt', prompt)
        data.append('negativePrompt', negativePrompt)
        data.append('seed', randomSeed)
        data.append('imageFile', fs.createReadStream(imagePath))
        const config = {
          method: 'post',
          url: 'https://beta-sdk.photoroom.com/v1/instant-backgrounds',
          responseType: 'arraybuffer',
          headers: {
            'x-api-key': '5c601eae7aa82665f6ea77a83992ba6dacd7d514',
            Accept: '*/*',
            Host: 'beta-sdk.photoroom.com',
            Connection: 'keep-alive',
            'Content-Type':
              'multipart/form-data; boundary=--------------------------770839930141001909509711'
          },
          data: data
        }

        // @ts-ignore
        axios(config)
          .then((response) => {
            const imgData = Buffer.from(response.data, 'base64') //Buffer编码
            resolve(imgData)
          })
          .catch((error) => {
            console.error('axios error >>>>>> ', error)
            reject('')
          })
      })
}

export const downloadFile = (outFilePath,imgData)=>{
    return new Promise((resolve,reject)=>{
        fs.mkdir(path.dirname(outFilePath), { recursive: true}, function (err) {
            if (err) return ;
            fs.writeFile(outFilePath, imgData, (err) => {
                if (err) {
                    console.log("downloadFile err ", err);
                    reject('')
                } else {
                    resolve(outFilePath)
                }
              }
            )
        });
    })
}

