/*
mapList => [
  {mapUid, mapName}
  ...
]
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

const isUseFile = (fileName, suffix) => {
  if (!fileName || !suffix) return false
  const index = fileName.lastIndexOf('.')
  const fileSuffix = fileName.substr(index + 1)
  return fileSuffix === suffix
}

const readTextData = (file) => {
  return new Promise((resolve) => {
    const fr = new FileReader()
    fr.readAsText(file, 'UTF-8')
    fr.onload = (evt) => {
      resolve(evt.target.result)
    }
  })
}

const getFileName = (fileName) => {
  if (!fileName) return 'error: No FileName'
  const suffix = fileName.substr(fileName.lastIndexOf('.') + 1)
  return fileName.replace(`.${suffix}`, '')
}

const jCode = (str) => {
  return window.btoa(window.encodeURIComponent(str))
}

const jDecode = (str) => {
  return window.decodeURIComponent(window.atob(str))
}

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
