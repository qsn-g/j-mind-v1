import './Contextmenu.css'

export default class Contextmenu {
  constructor (Mindmap) {
    this.Mindmap = Mindmap
    this.init()
  }
  init () {
    this.drawMenu()
    // this.width = this.div
    document.onclick = () => {
      this.hide()
    }
  }
  drawMenu () {
    this.div = document.createElement('div')
    this.div.className = 'contextMenu'
    this.div.obj = this
    this.Mindmap.div.appendChild(this.div)
    this.addChildBT()
    this.deleteBT()
    this.insertPicBT()
    this.deletePirBT()
    this.layoutBT()
  }
  insertPicBT () {
    let bt = document.createElement('label')
    bt.className = 'button'
    bt.innerText = '图片'
    this.div.appendChild(bt)
    let file = document.createElement('input')
    file.type = 'file'
    bt.appendChild(file)
    this.insertPicListener(bt)
  }
  insertPicListener (button) {
    button.onchange = (files) => {
      if (!this.targetObj) return
      this.Mindmap.insertPic(this.targetObj, files.target.files)
    }
  }
  deletePirBT () {
    let bt = document.createElement('div')
    bt.className = 'button'
    bt.innerText = '删图'
    this.div.append(bt)
    this.deletePirListener(bt)
  }
  deletePirListener (button) {
    button.onclick = () => {
      if (!this.targetObj) return
      this.Mindmap.deletePir(this.targetObj)
    }
  }
  layoutBT () {
    let bt = document.createElement('div')
    bt.className = 'button'
    bt.innerText = '格式'
    this.div.appendChild(bt)
    this.layoutListener(bt)
  }
  layoutListener (button) {
    button.onclick = () => {
      if (!this.targetObj) return
      this.Mindmap.layout(this.targetObj)
    }
  }
  addChildBT () {
    let bt = document.createElement('div')
    bt.className = 'button'
    bt.innerText = '下级'
    this.div.appendChild(bt)
    this.addChildListener(bt)
  }
  addChildListener (button) {
    button.onclick = () => {
      if (!this.targetObj) return
      this.Mindmap.addChild(this.targetObj)
    }
  }
  deleteBT () {
    let bt = document.createElement('div')
    bt.className = 'button'
    bt.innerText = '删除'
    this.div.appendChild(bt)
    this.deleteLstener(bt)
  }
  deleteLstener (button) {
    button.onclick = () => {
      if (!this.targetObj) return
      this.Mindmap.deleteObj(this.targetObj)
    }
  }
  bindObj (obj) {
    this.targetObj = obj
  }
  show (left, top) {
    left = left || 0
    top = top || 0
    this.div.style.left = `${left}px`
    this.div.style.top = `${top}px`
    this.div.style.display = 'inline-block'
    this.div.style.maxWidth = this.targetObj.options.width
    const menuStyle = `left: ${left}px; top: ${top}px; display: inline-block; /*max-width: ${this.targetObj.options.width * 1.1}px*/`
    this.div.setAttribute('style', menuStyle)
  }
  hide () {
    this.div.style.display = 'none'
  }
}
