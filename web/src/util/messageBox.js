import {Message} from 'element-ui'

const duration = 1500
const showClose = true

const sendWarn = (message) => {
  Message({
    message,
    duration,
    showClose,
    type: 'warning'
  })
}
const sendError = (message) => {
  Message({
    message,
    duration,
    showClose,
    type: 'error'
  })
}
const sendSuccess = (message) => {
  Message({
    message,
    duration,
    showClose,
    type: 'success'
  })
}

export {
  sendWarn,
  sendError,
  sendSuccess
}
