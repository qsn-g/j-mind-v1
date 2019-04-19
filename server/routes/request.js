const Router = require('koa-router')
const router = new Router({
  prefix: '/request'
})
const Control = require('../src/control/controlCenter')
const control = new Control()

router
  .post('/saveMapByID', async ctx => {
    await control.saveInfo(ctx.request.body)
    ctx.response.body = '保存成功'
  })
  .post('/getMapByID', async ctx => {
    const result = await control.getMapbyUid(ctx.request.body.mapUid)
    ctx.response.body = JSON.stringify(result)
  })
  .post('/deleteMapbyID', async ctx => {
    await control.deleteInfo(ctx.request.body)
    ctx.response.body = '删除成功　 '
  })

module.exports = router