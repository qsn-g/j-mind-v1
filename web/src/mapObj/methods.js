class Methods {
  addChildPosition (startObj) {
    const jsonInfo = this.getAllObjInfo(startObj, '添加元素')
    return jsonInfo
  }
  rightChildPosition (jsonInfo, rule = 'reset') {
    const spaceConfig = {
      childLeft: jsonInfo.fatherJSON.position.left + jsonInfo.fatherJSON.width + 90,
      objSpaceY: jsonInfo.height * 1.1
    }
    const brotherLen = jsonInfo.fatherJSON.childJSONList.length
    const limit = jsonInfo.fatherJSON.position.top + jsonInfo.fatherJSON.height / 2 - jsonInfo.height / 2
    let toppest = 999999
    switch (rule) {
      case 'reset': {
        jsonInfo.position.left = spaceConfig.childLeft
        break
      }
      case 'add': {
        jsonInfo.position.left = jsonInfo.position.left
        if (jsonInfo.position.left === jsonInfo.fatherJSON.position.left) jsonInfo.position.left = spaceConfig.childLeft
        break
      }
    }
    if (brotherLen === 1) {
      jsonInfo.position.top = limit
    } else {
      jsonInfo.fatherJSON.childJSONList.forEach((elem) => {
        if (elem !== jsonInfo) {
          elem.position.top -= spaceConfig.objSpaceY
          toppest = elem.position.top <= toppest ? elem.position.top : toppest
        }
      })
      jsonInfo.position.top = limit * 2 - toppest
      this.resetBroPostion(jsonInfo.fatherJSON, spaceConfig.objSpaceY)
    }
  }
  // 添加一个节点后，父节点的兄弟节点比父节点高就往上移一段距离，反之就往下移动一段距离
  // 遍历子节点
  resetChildPosition (jsonInfo, type, distance) {
    distance = type === '下移' ? Math.abs(distance) : -Math.abs(distance)
    jsonInfo.position.top += distance
    jsonInfo.childJSONList.forEach((elem) => {
      this.resetChildPosition(elem, type, distance)
    })
  }
  // 遍历兄弟节点
  resetBroPostion (jsonInfo, distance) {
    if (!jsonInfo.fatherJSON) return
    jsonInfo.fatherJSON.childJSONList.forEach((elem) => {
      if (elem !== jsonInfo) {
        const type = elem.position.top > jsonInfo.position.top ? '下移' : '上移'
        this.resetChildPosition(elem, type, distance)
      }
    })
    this.resetBroPostion(jsonInfo.fatherJSON, distance)
  }
  // 从obj开始格式化子节点的所有坐标
  layout (obj, jsonInfo, type = '格式化', rule) {
    // 获得obj开始的json格式的坐标
    jsonInfo = jsonInfo || {
      id: obj.options.id,
      width: obj.options.width,
      height: obj.options.height,
      position: {left: obj.options.left, top: obj.options.top},
      className: obj.options.className,
      lineWidth: obj.options.lineWidth,
      label: obj.options.label,
      childJSONList: [],
      fatherJSON: null,
      url: obj.options.pirUrl
    }
    obj.childObjList.forEach((elem, index) => {
      // position为elem父节点的position
      this.bindJSON(elem, jsonInfo, type)
    })
    // 广度遍历
    obj.childObjList.forEach((elem) => {
      jsonInfo.childJSONList.some((json) => {
        if (json.id === elem.options.id) {
          this.layout(elem, json, type)
          return true
        }
      })
    })
    return jsonInfo
  }
  bindJSON (obj, fatherJSON, type) {
    let jsonInfo = {
      id: obj.options.id,
      width: obj.options.width,
      height: obj.options.height,
      position: {left: obj.options.left, top: obj.options.top},
      class: obj.options.className,
      lineWidth: obj.options.lineWidth,
      label: obj.options.label,
      childJSONList: [],
      fatherJSON: null,
      url: obj.options.pirUrl
    }
    if (fatherJSON) {
      fatherJSON.childJSONList.push(jsonInfo)
      jsonInfo.fatherJSON = fatherJSON
      switch (type) {
        case '缓存': {
          jsonInfo.fatherJSON = null
          break
        }
        case '格式化': {
          this.rightChildPosition(jsonInfo)
          break
        }
        case '添加元素': {
          this.rightChildPosition(jsonInfo, 'add')
          break
        }
      }
    }
  }
  getPositionfromLayout (layoutPosition, id) {
    let result
    layoutPosition.childJSONList.some((elem) => {
      if (elem.id === id) {
        result = elem
        return true
      }
      result = result || this.getPositionfromLayout(elem, id)
    })
    return result
  }
  /*
    返回思维导图的信息，
    type类型：
    1.缓存：json数据不会形成环形数据
    2.格式化：默认选项
    3.添加元素：x坐标不变，格式化y坐标
   */
  getAllObjInfo (obj, type = '') {
    return this.layout(obj, null, type)
  }
  jcode (str) {
    return window.btoa(window.encodeURIComponent(str))
  }
  jdecode (str) {
    return window.decodeURIComponent(window.atob(str))
  }
}

let Cal = new Methods()
export default Cal
