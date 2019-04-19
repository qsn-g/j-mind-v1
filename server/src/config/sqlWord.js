module.exports = {
  insert: 'insert into mapFile(mapName, mapUid) values(?, ?)',
  update: 'update mapFile set mapName = ? where mapUid = ?',
  saveInfo: 'insert into mapFile(mapName, mapUid) values(?, ?) on duplicate key update mapName = ?',
  findAll: 'select * from mapFile',
  deleteInfo: 'delete from mapFile where mapUid = ?'
}
