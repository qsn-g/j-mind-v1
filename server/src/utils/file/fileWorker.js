const path = require('../../config/fileConfig')
const fs = require('fs')
class FileWorker {
  createDir (dirName) {
    return new Promise((resolve) => {
      fs.mkdir(`${path.gen}/${dirName}`, (err) => {
        if (err) {
          console.log(err)
          resolve(false)
        }
        console.log('创建成功')
        resolve(true)
      })
    })
  }
  createDir2 (dirName) {
    try {
      fs.mkdirSync(`${path.gen}${dirName}`)
      return true
    } catch (e) {
      console.log(e)
      return '创建失败'
    }
  }
  updataFile (fileName, info) {
    return new Promise((resolve) => {
      fs.writeFile(`${path.public}/${fileName}.jzx`, info, 'utf-8', (err) => {
        if (err) {
          console.log(err)
          resolve(err)
          return
        }
        console.log('写入成功')
        resolve(true)
      })
    })
  }
  deleteFile (fileName) {
    return new Promise((resolve) => {
      fs.unlink(`${path.public}/${fileName}.jzx`, (err) => {
        if (err) {
          switch (err.code) {
            case ('ENOENT'): {
              console.log('文件不存在')
              resolve('文件不存在')
              break
            }
          }
          resolve(false)
          return
        }
        console.log('删除成功')
        resolve(true)
      })
    })
  }
  readFile (fileName) {
    return new Promise((resolve) => {
      fs.readFile(`${path.public}/${fileName}.jzx`, (err, fileData) => {
        if (err) {
          console.log('读取错误')
          resolve(false)
        }
        fileData = fileData || ''
        resolve(fileData.toString())
      })
    })
  }
  fileMtime (fileName) {
    const path = `${path.public}/${fileName}.jzx`
    const fileStat = fs.statSync(fileName)
    console.log(fileStat.mtime)
    return fileStat.mtime
  }
}

module.exports = FileWorker

