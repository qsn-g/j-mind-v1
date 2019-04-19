import {lineColor, lineOffSet} from '../config/config'

export default class Line {
  constructor (fatherObj, childObj, options) {
    const defaultOptions = {
      lineWidth: 4,
      color: 'black'
    }
    this.fatherObj = fatherObj
    this.childObj = childObj
    this.options = Object.assign(defaultOptions, options)
    this.fatherObj.childLineList.push(this)
    this.childObj.fatherLine = this
    this.init()
  }
  init () {
    this.initOptions()
    this.createCanvas()
    this.updataCanvas()
  }
  createCanvas () {
    // 创建元素
    this.canvas = document.createElement('canvas')
    this.fatherObj.mindMap.div.appendChild(this.canvas)
    // 初始化canvas属性
    this.canvas.id = `${this.fatherObj.options.id}-to-${this.childObj.options.id}`
    this.canvas.obj = this
  }
  // 删除线条
  destroySelf () {
    this.options = null
    delete this.options
    this.canvas.obj = null
    this.fatherObj.mindMap.div.removeChild(this.canvas)
    delete this.canvas
    this.childObj.fatherLine = null
    delete this.childObj
    this.fatherObj.childLineList.forEach((elem, index) => {
      if (elem === this) this.fatherObj.childLineList.splice(index, 1)
    })
    delete this.fatherObj
  }
  // 更新线条
  updataCanvas () {
    const { fatherPoint, childPoint } = this.getlinkPoints()
    this.options.left = fatherPoint.x < childPoint.x ? fatherPoint.x : childPoint.x
    this.options.top = fatherPoint.y < childPoint.y ? fatherPoint.y : childPoint.y
    // 保证当父元件和子元件在同一水平线时，也能显示出线条
    this.options.width = Math.abs(fatherPoint.x - childPoint.x) >= 2 ? Math.abs(fatherPoint.x - childPoint.x) : 2
    this.options.height = Math.abs(fatherPoint.y - childPoint.y) >= 2 ? Math.abs(fatherPoint.y - childPoint.y) : 2
    this.canvas.width = this.options.width
    this.canvas.height = this.options.height + lineOffSet * 2
    const canvasStyle = `left: ${this.options.left}px; top: ${this.options.top - 5}px;`
    this.canvas.setAttribute('style', canvasStyle)
    this.drawCanvas(fatherPoint, childPoint)
  }
  // 画线条
  drawCanvas (fatherPoint, childPoint) {
    const usePoint = {
      x0: fatherPoint.x > childPoint.x ? this.options.width : 0,
      y0: fatherPoint.y > childPoint.y ? this.options.height : 0,
      R: this.options.width > this.options.height ? this.options.width : this.options.height
    }
    usePoint.x2 = usePoint.x0 === 0 ? this.options.width : 0
    usePoint.y2 = usePoint.y0 === 0 ? this.options.height : 0
    usePoint.x1 = usePoint.x0
    usePoint.y1 = usePoint.y2
    const ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(usePoint.x0, usePoint.y0 + lineOffSet)
    ctx.quadraticCurveTo(usePoint.x1, usePoint.y1 + lineOffSet, usePoint.x2, usePoint.y2 + lineOffSet)
    ctx.lineWidth = this.options.lineWidth
    ctx.strokeStyle = this.options.color
    ctx.stroke()
  }
  // 获取两个最近的连接点
  getlinkPoints () {
    const distanceA = Math.abs(this.fatherObj.linkPoint.left.x - this.childObj.linkPoint.right.x)
    const distanceB = Math.abs(this.fatherObj.linkPoint.right.x - this.childObj.linkPoint.left.x)
    if (distanceA < distanceB) {
      return {fatherPoint: this.fatherObj.linkPoint.left, childPoint: this.childObj.linkPoint.right}
    } else {
      return {fatherPoint: this.fatherObj.linkPoint.right, childPoint: this.childObj.linkPoint.left}
    }
  }
  // 初始化颜色和线条粗细
  initOptions () {
    if (this.fatherObj.fatherLine) {
      this.options.color = this.fatherObj.fatherLine.options.color
      this.options.lineWidth = (this.fatherObj.fatherLine.options.lineWidth - 0.5) >= 2 ? this.fatherObj.fatherLine.options.lineWidth - 1 : 2
    } else {
      this.options.color = lineColor[parseInt(Math.random() * lineColor.length)]
    }
  }
}
