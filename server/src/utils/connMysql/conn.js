const sqlConfig = require('../../config/sqlConfig')
const mysql = require('mysql')
const pool = mysql.createPool(sqlConfig)
class Conn {
  /* eslint-disable no-new */
  connDatabase () {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.log(`初始化数据库失败${err}`)
        } else {
          resolve(connection)
          console.log(`数据库连接成功`)
        }
      })
    })
  }
  releaseDatabase (connection) {
    connection.release()
    console.log(`数据库连接断开`)
  }
  async connCallback (callBack) {
    const connection = await this.connDatabase()
    await callBack(connection)
    await this.releaseDatabase(connection)
  }
}

module.exports = Conn
