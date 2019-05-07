/**
 * 获取 map 在 maplist 的index
 * @param {string} mapUid
 * @param {Array [{mapName, mapUid}]} mapList
 */
const getIndexfromList = (mapUid, mapList) => {
  let resultIndex = -1
  mapList.some((elem, index) => {
    if (mapUid === elem.mapUid) {
      resultIndex = index
      return true
    }
  })
  return resultIndex
}

/**
 * 判断fileName 的后缀名是不是 suffix
 * @param {string} fileName
 * @param {string} suffix
 */
const isUseFile = (fileName, suffix) => {
  if (!fileName || !suffix) return false
  const index = fileName.lastIndexOf('.')
  const fileSuffix = fileName.substr(index + 1)
  return fileSuffix === suffix
}
/**
 * 读取文件内容
 * @param {file} file
 */
const readTextData = (file) => {
  return new Promise((resolve) => {
    const fr = new FileReader()
    fr.readAsText(file, 'UTF-8')
    fr.onload = (evt) => {
      resolve(evt.target.result)
    }
  })
}
/**
 * 去掉文件后缀名
 * @param {string} fileName
 */
const getFileName = (fileName) => {
  if (!fileName) return 'error: No FileName'
  const suffix = fileName.substr(fileName.lastIndexOf('.') + 1)
  return fileName.replace(`.${suffix}`, '')
}
/**
 * 将str进行加密
 * @param {*} str
 */
const jCode = (str) => {
  return window.btoa(window.encodeURIComponent(str))
}

/**
 * 将str进行解密
 * @param {*} str
 */
const jDecode = (str) => {
  return window.decodeURIComponent(window.atob(str))
}
/**
 * 将时间戳转为时间格式
 * @param {string} timeStamp
 */
const getTimeFromStamp = (timeStamp) => {
  const time = new Date(parseInt(timeStamp)).toLocaleString().replace(/:\d{1,2}$/, ' ')
  return time.toString()
}

export {
  getIndexfromList,
  isUseFile,
  readTextData,
  getFileName,
  jCode,
  jDecode,
  getTimeFromStamp
}
