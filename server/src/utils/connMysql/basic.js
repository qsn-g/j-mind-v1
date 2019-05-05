const Conn = require('./conn')
const sqlWord = require('../../config/sqlWord')
const conn = new Conn()

class Basic {
  updateRecord (jsonInfo) {
    return new Promise((resolve, reject) => {
      conn.connCallback((connection) => {
        const timeStamp = new Date().getTime().toString()
        connection.query(sqlWord.saveInfo, [jsonInfo.mapName, jsonInfo.mapUid, timeStamp, jsonInfo.mapName, timeStamp], (err, success) => {
          if (err) {
            reject(err)
          } else {
            resolve(success)
          }
        })
      })
    })
  }
  getAllRecord () {
    return new Promise((resolve, reject) => {
      conn.connCallback((connection) => {
        connection.query(sqlWord.findAll, (err, success) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(success)
          }
        })
      })
    })
  }
  deleteRecord (mapUid) {
    return new Promise((resolve, reject) => {
      conn.connCallback((connection) => {
        connection.query(sqlWord.deleteInfo, [mapUid], (err, success) => {
          if (err) {
            reject(err)
          } else {
            resolve(success)
          }
        })
      })
    })
  }
}

module.exports = Basic
