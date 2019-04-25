const Router = require('koa-router')
const router = new Router({
  prefix: '/request'
})
const Control = require('../src/control/controlCenter')
const control = new Control()

router
  .post('/saveMapByID', async ctx => {
    let result = {}
    try {
      result = {mess: await control.saveInfo(ctx.request.body), res: '保存成功'}
    } catch (e) {
      result = e
    }
    ctx.response.body = result
  })
  .post('/getMapByID', async ctx => {
    const result = await control.getMapbyUid(ctx.request.body.mapUid)
    ctx.response.body = JSON.stringify(result)
  })
  .post('/deleteMapbyID', async ctx => {
    let result = {}
    try {
      result = {mess: await control.deleteInfo(ctx.request.body), res: '删除成功'}
    } catch (e) {
      result = e
    }
    ctx.response.body = result
  })

module.exports = router