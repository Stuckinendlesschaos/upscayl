const fs = require('fs');
const path = require('path');
import axios from 'axios'
import FormData from 'form-data'

const allowedFileTypes = [".png", ".jpg", ".jpeg", ".webp"];
const BATCH_MAX = 50 // 批处理最大限制个数

export const getFileList = folder => {
    return new Promise((resolve)=>{
        // 收集所有的文件路径
        const fileList:any[] = [];
        //根据文件路径读取文件，返回文件列表
        fs.readdir(folder, (err, files) =>{
            files.forEach((originName) => {
                const name = path.parse(originName).name
                const ext = path.parse(originName).ext
                // 如果图片类型不包含在格式列表,不处理
                if(!allowedFileTypes.includes(ext)) return
                // 一次性批处理的上限，可商用处理逻辑
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
    data.append('ImageFile', fs.createReadStream(imagePath))
    data.append('background-color','#00000000')
    const config = {
        method: 'post',
        url: 'http://103.98.17.166:80/backgroundRemove-jianjia',
        // responseType: 'base64',
        headers: { 
            Accept: '*/*', 
            Host: '103.98.17.166:80',
            Connection: 'keep-alive', 
            'Content-Type': 'multipart/form-data; boundary=--------------------------137783359278318920604824', 
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

export const obtainGenerativeImage = (imagePath: string, prompt: string, negativePrompt: string, randomSeed: number) => {
    return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('prompt', prompt)
        data.append('negativePrompt', negativePrompt)
        data.append('seed', randomSeed)
        data.append('ImageFile', fs.createReadStream(imagePath))
        const config = {
            method: 'post',
            url: 'http://103.98.17.166:80/backgroundEdits-jianjia',
            // responseType: 'base64',
            headers: { 
                Accept: '*/*', 
                Host: '103.98.17.166:80',
                Connection: 'keep-alive', 
                'Content-Type': 'multipart/form-data; boundary=--------------------------137783359278318920604824', 
             },
            data: data,
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

export const obtainRefactoringImage = (imagePath: string, sega_val0: string[], sega_val1: string[], switchSeed: boolean) => {
    return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('sega_val0', sega_val0.join())
        data.append('sega_val1', sega_val1.join())
        data.append('Seed_switch', String(switchSeed))
        data.append('ImageFile', fs.createReadStream(imagePath))

        const config = {
            method: 'post',
            url: 'http://103.98.17.166:80/ledits-jianjia',
            headers: { 
                Accept: '*/*', 
                Host: '103.98.17.166:80',
                Connection: 'keep-alive', 
                'Content-Type': 'multipart/form-data; boundary=--------------------------137783359278318920604824', 
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

