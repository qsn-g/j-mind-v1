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

export {
  getIndexfromList
}
