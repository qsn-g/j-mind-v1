import { config } from '../config/config'
import cal from '../mapObj/methods'

export default class Obj {
  constructor (options, mindMap) {
    const defaultsOption = {
      minWidth: config.oneLevel.width,
      minHeight: config.oneLevel.height,
      className: 'one-level',
      left: 150,
      top: 80,
      label: '',
      lineWidth: 2, // 这里注明一下 option.width 和 option.height 是指包含了两边的linewidth的总盒子大小
      oldLeft: null,
      oldTop: null,
      pirUrl: '',
      pirFile: null
    }
    this.mindMap = mindMap
    this.options = Object.assign(defaultsOption, options)
    this.childObjList = []
    this.childLineList = []
    this.fatherObj = null
    this.fatherLine = null
    this.init()
  }
  // 初始化
  init () {
    this.options.id = this.createNewID()
    this.createElements()
    this.bindListener()
    this.updataPoint()
    this.sign = this.mindMap.sign++
  }
  // 绑定监听
  bindListener () {
    this.div.onmousedown = this.drag
    this.div.onmouseup = this.clearDrag
    this.div.oncontextmenu = (evt) => {
      evt.preventDefault()
      this.mindMap.showMenu(evt)
    }
    this.label.ondblclick = () => {
      this.label.contentEditable = 'true'
      this.div.onmousedown = null
    }
    this.label.onblur = () => {
      this.label.contentEditable = 'false'
      this.div.onmousedown = this.drag
      this.options.label = this.label.innerText
      this.options.width = this.div.offsetWidth
      this.options.height = this.div.offsetHeight
    }
    this.label.onkeydown = () => {
      this.updataSize()
    }
    this.image.ondblclick = () => {
      window.open(this.options.pirUrl)
    }
    this.div.onfocus = this.isSelect
    this.div.onblur = this.clearSelect
  }
  // 清除监听
  clearLinstener () {
    this.div.onmousedown = null
    this.div.onmouseup = null
    this.div.oncontextmenu = null
    this.div.onfocus = null
    this.div.onblur = null
    this.label.ondblclick = null
    this.label.onblur = null
    this.label.onmousedown = null
    this.label.onkeydown = null
    this.image.ondblclick = null
  }
  createElements () {
    // 创建元素
    let fatherDiv = this.mindMap.div
    this.div = document.createElement('div')
    this.label = document.createElement('label')
    this.image = new Image()
    fatherDiv.appendChild(this.div)
    this.div.appendChild(this.image)
    this.div.appendChild(this.label)
    this.div.tabIndex = 0
    // 初始化div属性
    this.div.id = this.options.id
    this.div.obj = this
    this.div.className = `${this.options.className} Obj`
    const divStyle = `min-height: ${this.options.minHeight}px; min-width: ${this.options.minWidth}px; left: ${this.options.left}px; top: ${this.options.top}px; border: ${this.options.lineWidth}px solid #ddd`
    this.div.setAttribute('style', divStyle)
    // 初始化label属性
    this.label.innerText = this.options.label || `新建图元`
    this.label.parentObj = this
    this.options.label = this.label.innerText
    // 初始化width 和 height
    this.options.width = this.div.offsetWidth
    this.options.height = this.div.offsetHeight
    // 初始化image属性
    this.setImage(this.options.pirUrl)
    this.image.draggable = false
    this.image.parentObj = this
  }
  // 销毁自己
  destroySelf () {
    this.clearLinstener()
    // 删除属性
    delete this.childObjList
    this.div.removeChild(this.label)
    this.image.parentObj = null
    delete this.image.parentObj
    this.image = null
    delete this.image
    this.label.parentObj = null
    delete this.label.parentObj
    this.label = null
    delete this.label
    this.options = null
    delete this.options
    delete this.sign
    this.linkPoint = null
    delete this.linkPoint
    if (this.fatherObj) {
      this.fatherObj.childObjList.forEach((elem, index) => {
        if (elem === this) this.fatherObj.childObjList.splice(index, 1)
      })
    }
    this.mindMap.objList.forEach((elem, index) => {
      if (elem === this) this.mindMap.objList.splice(index, 1)
    })
    this.mindMap = null
    delete this.mindMap
    delete this.fatherObj
    this.div.obj = null
    this.div.parentElement.removeChild(this.div)
    delete this.div
    delete this.childLineList
    delete this.fatherLine
  }
  // 初始化元件中心点
  updataPoint () {
    const space = 0.3
    let centreLeft = {x: this.options.left + this.options.width * space, y: this.options.top + this.options.height / 2}
    let centreRight = {x: this.options.left + this.options.width * (1 - space), y: this.options.top + this.options.height / 2}
    let left = {x: this.options.left, y: this.options.height / 2 + this.options.top}
    let right = {x: this.options.left + this.options.width, y: this.options.top + this.options.height / 2}
    this.linkPoint = this.options.className.includes('one-level') ? {left: centreLeft, right: centreRight} : {left: left, right: right}
    // this.linkPoint = {left: centreLeft, right: centreRight}
  }
  // 拖动元件执行方法
  drag (evt) {
    this.style.zIndex = 10
    let pir = this.obj.mindMap.div
    let div = this
    // 记录上次的位置为以后撤销作铺垫
    div.obj.options.oldLeft = div.obj.options.left
    div.obj.options.oldTop = div.obj.options.top
    div.obj.childObjList.forEach((elem) => {
      elem.options.oldLeft = elem.options.left
      elem.options.oldTop = elem.options.left
    })
    let lineWidth = this.obj.options.lineWidth
    let mouseXin
    let mouseYin
    if (evt.target.tagName === 'DIV') {
      mouseXin = evt.offsetX + lineWidth
      mouseYin = evt.offsetY + lineWidth
    } else {
      // offsetTop offsetLeft 相当于在容器内的位移偏差
      mouseXin = evt.offsetX + evt.target.offsetLeft + lineWidth
      mouseYin = evt.offsetY + evt.target.offsetTop - lineWidth
    }
    document.onmousemove = (e) => {
      const oldTop = div.obj.options.top
      let newLeft = e.clientX - mouseXin - pir.offsetLeft
      let newTop = e.clientY - mouseYin - pir.offsetTop
      const childOffsetLeft = newLeft - div.obj.options.left
      const childOffsetTop = newTop - oldTop
      div.obj && div.obj.setXY(newLeft, newTop)
      div.obj.chilMove(childOffsetLeft, childOffsetTop)
      // div.obj.autoToggle(newTop, oldTop, div.obj.options.oldTop)
    }
  }
  // 移动时更新线段
  updataLines () {
    if (this.fatherLine) this.fatherLine.updataCanvas()
    this.childLineList.forEach((elem) => {
      elem.updataCanvas()
    })
  }
  // 更新大小
  updataSize () {
    this.options.width = this.div.offsetWidth
    this.options.height = this.div.offsetHeight
    this.updataPoint()
    this.updataLines()
  }
  // 插入图片
  setImage (pirUrl) {
    this.image.src = pirUrl
    this.image.width = 0
    this.image.height = 0
    this.image.onload = () => {
      const width = this.image.naturalWidth
      const height = this.image.naturalHeight
      const override = height / (this.options.height - 4)
      this.image.height = height / override
      this.image.width = width / override
      this.updataSize()
    }
  }
  // 设置元件的坐标
  setXY (left, top) {
    left = left || this.options.left
    top = top || this.options.top
    this.options.left = left
    this.options.top = top
    this.div.style.left = `${left}px`
    this.div.style.top = `${top}px`
    this.updataPoint()
    this.updataLines()
  }
  // 动画移动到指定位置
  movetoXY (left, top) {
  }
  // 拖拽父元件子元件一起移动
  chilMove (offsetLeft, offsetTop) {
    this.childObjList.forEach((elem) => {
      elem.setXY(elem.options.left + offsetLeft, elem.options.top + offsetTop)
      elem.chilMove(offsetLeft, offsetTop)
    })
  }
  // 和兄弟节点切换位置
  autoToggle (newTop, oldTop, top) {
    const direction = newTop !== oldTop ? (newTop > oldTop ? 1 : -1) : 0
    if (direction === 0 || this.fatherObj === null) return
    const brObj = this.fatherObj.childObjList
    const index = brObj.indexOf(this)
    if ((direction === 1 && index === brObj.length - 1) || (direction === -1 && index === 0)) return
    if ((direction === 1 && this.options.top > brObj[index + direction].options.top) || (direction === -1 && this.options.top < brObj[index + direction].options.top)) {
      const obj = this
      const sign = this.sign
      brObj[index].sign = brObj[index + direction].sign
      brObj[index + direction].sign = sign
      const toggleTop = brObj[index + direction].options.top
      brObj[index].options.oldTop = toggleTop
      const childsetoffTop = top - toggleTop
      brObj[index + direction].setXY(null, top)
      brObj[index + direction].childObjList.forEach((elem) => {
        elem.setXY(null, childsetoffTop + elem.options.top)
      })
      brObj[index] = brObj[index + direction]
      brObj[index + direction] = obj
    }
  }
  // 为元件取名
  createNewID () {
    let resultID
    this.mindMap.objList.sort((objA, objB) => {
      return objA.options.id.substring(3) - objB.options.id.substring(3)
    })
    this.mindMap.objList.some((elem, index) => {
      if (elem.options.id !== `obj${index}`) {
        resultID = `obj${index}`
        return true
      }
    })
    resultID = resultID || `obj${this.mindMap.objList.length}`
    return resultID
  }
  // childObjList 按照 sign进行排序
  childObjListSort () {
    this.childObjList.sort((childA, childB) => {
      return childA.sign - childB.sign
    })
  }
  // div被聚焦
  isSelect () {
    const mindMap = this.obj.mindMap
    const obj = this.obj
    document.onkeydown = (event) => {
      const ctrl = event.ctrlKey || event.metaKey
      const keyCode = event.keyCode || event.which || event.charCode
      if (!ctrl) return
      switch (keyCode) {
        case (65): {
          mindMap.addChild(obj)
          break
        }
        case (90): {
          mindMap.deleteObj(obj)
          break
        }
        case (88): {
          mindMap.layout(obj)
          break
        }
      }
    }
  }
  // div不被聚焦
  clearSelect () {
    document.onkeydown = null
  }
  // 清除拖动事件
  clearDrag () {
    document.onmousemove = null
    this.obj.resetObjList()
    this.style.zIndex = 1
  }
  // 通过拖拽来改变元件与兄弟元件之间的优先级
  resetObjList () {
    const obj = this
    if (!obj.fatherObj) return
    const father = obj.fatherObj
    const index = father.childObjList.indexOf(obj)
    let another = father.childObjList.indexOf(
      father.childObjList.find((elem) => {
        return elem.options.top > obj.options.top
      })
    )
    if (index < 0) return
    if (obj.options.top > obj.options.oldTop) {
      another = another > -1 ? another : father.childObjList.length
      const upSign = this.getSignBeforeDrag(father, index, another)
      father.childObjList.splice(index, 1)
      father.childObjList.splice(another - 1, 0, obj)
      this.resetSignAfterDrag(father, index, another, upSign)
    } else if (obj.options.top < obj.options.oldTop) {
      another = index === 0 ? 0 : another
      another = another > -1 ? another : father.childObjList.length
      if (another > index) {
        const layoutPostion = cal.addChildPosition(obj.fatherObj)
        this.mindMap.setLayout(layoutPostion, obj.fatherObj)
        return
      }
      const downSign = this.getSignBeforeDrag(father, another, index + 1)
      father.childObjList.splice(index, 1)
      father.childObjList.splice(another, 0, obj)
      this.resetSignAfterDrag(father, another, index + 1, downSign)
    }
    const layoutPostion = cal.addChildPosition(obj.fatherObj)
    this.mindMap.setLayout(layoutPostion, obj.fatherObj)
  }
  // 获得拖拽之前的拖拽区间的sign
  getSignBeforeDrag (father, begin, end) {
    let resultArr = []
    for (let i = begin; i < end; i++) {
      resultArr.push(father.childObjList[i].sign)
    }
    return resultArr
  }
  resetSignAfterDrag (father, begin, end, signArr) {
    let p = 0
    for (let i = begin; i < end; i++) {
      father.childObjList[i].sign = signArr[p++]
    }
  }
}
