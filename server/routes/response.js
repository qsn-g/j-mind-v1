const Router = require('koa-router')
const Control = require('../src/control/controlCenter')
const control = new Control()
const router = new Router({
  prefix: '/response'
})

router
  .get('/getAllMap',  async　(ctx) => {
    const result = await control.getAllMap()
    ctx.response.body = result
  })
  .get('/getRandomUid', async (ctx) => {
    const result = await control.randomUid()
    ctx.response.body = result
  })
module.exports = router