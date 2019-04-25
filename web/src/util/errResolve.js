import { EventBus } from '../util/eventBus.js'

const ERR_ARR = [
  {code: 504, message: '连接服务器失败'},
  {code: 1366, message: '标题字符无法识别'}
]

const emitErrMess = (err) => {
  if (!err.code && !err.message) return
  if (err.message) {
    EventBus.$emit('warm', {delay: err.delay, message: err.message})
    return
  }
  ERR_ARR.forEach((elem) => {
    if (elem.code === err.code) {
      EventBus.$emit('warm', {delay: err.delay, message: elem.message})
    }
    return true
  })
}

export {
  emitErrMess
}
