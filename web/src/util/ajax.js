import axios from 'axios'

class Ajax {
  savemindMapbyID (options) {
    return axios.post('/api/request/saveMapByID', options)
  }
  getmindMapbyID (mapUid) {
    return axios.post('/api/request/getMapByID', mapUid)
  }
  getmindMapList () {
    return axios.get('/api/response/getAllMap')
  }
  getRandomUid () {
    return axios.get('/api/response/getRandomUid')
  }
  deleteMindMapbyUid (options) {
    return axios.post('/api/request/deleteMapbyID', options)
  }
  uploadPicture (formData) {
    return new Promise((resolve) => {
      axios.post('https://sm.ms/api/upload', formData).then((data) => {
        resolve(data)
      })
    })
  }
}

const ajax = new Ajax()

export default ajax
