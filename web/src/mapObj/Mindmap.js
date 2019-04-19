import Obj from './Obj'
import Contextmenu from './Contextmenu'
import cal from './methods'
import { config } from '../config/config'
import Line from './Line'
import ajax from '../util/ajax'
import { EventBus } from '../util/eventBus'
export default class Mindmap {
  constructor (options) {
    this.objList = []
    // this.startObjList = []
    this.div = document.getElementById('pir-board')
    this.init()
    this.sign = 0
    this.mapName = options.mapName
    this.mapUid = options.mapUid
  }
  init () {
    this.contextMenu = new Contextmenu(this)
  }
  addObj (options) {
    let obj = new Obj(options, this)
    this.objList.push(obj)
    // if (obj.options.className.includes('one-level')) this.startObjList.push(obj)
    return obj
  }
  addChild (targetObj, options) {
    const isDraw = options ? 1 : 0
    const targetClassName = targetObj.options.className
    let defualtOptions = {}
    switch (true) {
      case (targetClassName.includes('one-level')): {
        defualtOptions = {
          className: 'two-level',
          minHeight: config.twoLevel.height,
          minWidth: config.twoLevel.width,
          left: targetObj.options.left,
          top: targetObj.options.top,
          label: '二级元件'
        }
        break
      }
      default: {
        defualtOptions = {
          className: 'three-level',
          minHeight: config.threeLevel.height,
          minWidth: config.threeLevel.width,
          left: targetObj.options.left,
          top: targetObj.options.top,
          label: '三级元件'
        }
      }
    }
    options = Object.assign(defualtOptions, options)
    let childObj = this.addObj(options)
    childObj.fatherObj = targetObj
    targetObj.childObjList.push(childObj)
    targetObj.childObjListSort()
    if (!isDraw) {
      let startObj = targetObj
      while (startObj.fatherObj) {
        startObj = startObj.fatherObj
      }
      const layoutPostion = cal.addChildPosition(startObj, childObj)
      this.setLayout(layoutPostion, startObj)
    }
    /* eslint-disable no-new */
    new Line(targetObj, childObj, {})
    return childObj
  }
  deleteObj (targetObj, type = 'delete') {
    while (targetObj.childObjList.length > 0) {
      this.deleteObj(targetObj.childObjList[0])
    }
    // 思维导图总父节点不可以删除
    if (!targetObj.fatherLine & type === 'delete') return
    // 思维导图总父节点可以删除
    targetObj.fatherLine && targetObj.fatherLine.destroySelf()
    targetObj.destroySelf()
  }
  insertPic (targetObj, files) {
    if (!files[0]) return
    const fileType = files[0].name.substring(files[0].name.lastIndexOf('.')).toLowerCase()
    if (!fileType.match(/.png|.jpg|.jpeg/)) {
      EventBus.$emit('warm', {delay: 1, message: '文件格式错误'})
      return
    }
    targetObj.options.pirFile = files[0]
    const fr = new FileReader()
    fr.readAsDataURL(targetObj.options.pirFile)
    fr.onload = (event) => {
      const data = event.target.result
      targetObj.setImage(data)
    }
  }
  deletePir (targetObj) {
    targetObj.image.src = ''
    targetObj.image.width = 0
    targetObj.image.height = 0
    targetObj.options.pirUrl = ''
  }
  layout (targetObj) {
    targetObj.childObjListSort()
    const layoutPosition = cal.layout(targetObj)
    this.setLayout(layoutPosition, targetObj)
  }
  setLayout (layoutPosition, targetObj) {
    targetObj.childObjList.forEach((elem) => {
      const position = cal.getPositionfromLayout(layoutPosition, elem.options.id).position
      if (position.left !== elem.options.left || position.top !== elem.options.top) elem.setXY(position.left, position.top)
      this.setLayout(layoutPosition, elem)
    })
  }
  showMenu (evt) {
    let obj = evt.target.tagName === 'DIV' ? evt.target.obj : evt.target.parentObj
    this.contextMenu.bindObj(obj)
    this.contextMenu.show(obj.options.left, obj.options.top + obj.options.height)
    // console.log(evt)
  }
  async saveMindmap () {
    const startArr = this.getStartArr()
    if (startArr.length === 0) {
      return ajax.savemindMapbyID({mapName: this.mapName || '默认名', mapUid: this.mapUid, info: ''})
    }
    const pirPromiseArr = this.getPirPromiseArr(startArr[0])
    await this.resolvePirPromiseArr(pirPromiseArr)
    const allObjInfo = cal.getAllObjInfo(startArr[0], '缓存')
    if (!this.mapUid) {
      const result = await ajax.getRandomUid()
      this.mapUid = result.data.toString()
    }
    return ajax.savemindMapbyID({mapName: this.mapName || '默认名', mapUid: this.mapUid, info: allObjInfo})
  }
  async resolvePirPromiseArr (pirPromiseArr) {
    for (let i = 0; i < pirPromiseArr.length; i++) {
      const elem = pirPromiseArr[i]
      const url = await elem.promise
      elem.obj.options.pirUrl = url.data.data.url
    }
  }
  getPirPromiseArr (startObj, pirPromiseArr = []) {
    if (startObj.options.pirFile && startObj.image.src) {
      const formData = new FormData()
      formData.append('smfile', startObj.options.pirFile)
      pirPromiseArr.push({promise: ajax.uploadPicture(formData), obj: startObj})
    }
    startObj.childObjList.forEach((elem) => {
      this.getPirPromiseArr(elem, pirPromiseArr)
    })
    return pirPromiseArr
  }
  async reDrawMapbyUid (mapUid) {
    const result = await ajax.getmindMapbyID(mapUid)
    const stringInfo = result.data
    if (!result.data) return false
    this.reDrawMindmap(stringInfo)
  }
  reDrawMindmap (stringInfo) {
    if (!stringInfo) return false
    try {
      const jsonInfo = JSON.parse(stringInfo)
      if (!jsonInfo) return
      this.reDrawObj(jsonInfo)
    } catch (error) {
      EventBus.$emit('warm', {delay: 1, message: '文件已损坏'})
    }
  }
  reDrawObj (jsonInfo, fatherObj) {
    const options = {
      className: jsonInfo.className,
      height: jsonInfo.height,
      width: jsonInfo.width,
      id: jsonInfo.id,
      lineWidth: jsonInfo.lineWidth,
      left: jsonInfo.position.left,
      top: jsonInfo.position.top,
      label: jsonInfo.label,
      pirUrl: jsonInfo.url
    }
    for (let k in options) {
      if (!options[k]) delete options[k]
    }
    if (!fatherObj) {
      fatherObj = this.addObj(options)
    } else {
      fatherObj = this.addChild(fatherObj, options)
    }
    jsonInfo.childJSONList.forEach((elem) => {
      if (elem.childJSONList) this.reDrawObj(elem, fatherObj)
    })
  }
  async downLoadMap () {
    try {
      const result = await ajax.getmindMapbyID({ mapUid: this.mapUid })
      const strInfo = cal.jcode(result.data)
      const file = document.getElementById('dl_Button')
      const blob = new Blob([ strInfo ])
      file.href = URL.createObjectURL(blob)
    } catch (error) {
      return false
    }
  }
  getStartArr () {
    let startArr = []
    this.objList.forEach((elem) => {
      if (elem.options.className.indexOf('one-level') > -1) startArr.push(elem)
    })
    return startArr
  }
  clearStage () {
    const startArr = this.getStartArr()
    startArr.forEach((elem) => {
      this.deleteObj(elem, 'clear')
    })
  }
}
