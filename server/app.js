const Koa = require('koa')
const app = new Koa()
const requestRouter = require('./routes/request')
const responseRouter = require('./routes/response')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')

app.use(cors())
app.use(bodyParser())
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// router
app
  .use(responseRouter.routes())
  .use(requestRouter.routes())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
