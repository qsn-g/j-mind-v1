const FileWorker = require('../utils/file/fileWorker')
const Basic = require('../utils/connMysql/basic')
const fw = new FileWorker()
const sqlBasic = new Basic()
const nanoid = require('nanoid')
class Control {
  saveInfo (jsonInfo) {
    const str = JSON.stringify(jsonInfo.info)
    let promiseList = []
    promiseList.push(fw.updataFile(`${jsonInfo.mapUid}`, str))
    promiseList.push(sqlBasic.updateRecord(jsonInfo))
    return Promise.all(promiseList)
  }
  deleteInfo (jsonInfo) {
    const mapUid = jsonInfo.mapUid
    let promiseList = []
    promiseList.push(fw.deleteFile(mapUid))
    promiseList.push(sqlBasic.deleteRecord(mapUid))
    return Promise.all(promiseList)
  }
  getAllMap () {
    return sqlBasic.getAllRecord()
  }
  getMapbyUid (mapUid) {
    return fw.readFile(mapUid)
  }
  async randomUid () {
    let uidArr = []
    const result = await this.getAllMap()
    result.forEach((elem) => {
      uidArr.push(elem.mapUid)
    })
    let resultUid = nanoid()
    while (uidArr.includes(resultUid)) {
      console.log('正在重新生成uid')
      resultUid = nanoid()
    }
    return resultUid
  }
}

module.exports = Control

// new Control().randomUid()
