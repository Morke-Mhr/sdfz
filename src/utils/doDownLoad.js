import { getToken } from '@/utils/auth'
import store from '@/store/index.js'
export function downloadGet(formName) {
  var xhr = new XMLHttpRequest()

  var play_url =
    store.state.apiConfiguration.url +
    store.state.serviceName.jurisdiction +
    formName
  xhr.open('GET', play_url, true)
  xhr.responseType = 'blob'
  xhr.setRequestHeader('Authorization', getToken())
  xhr.onload = function() {
    if (this.status == 200) {
      var blob = this.response

      // video.onload = function(e) {
      // window.URL.revokeObjectURL(video.src);
      // };
      // video.src = window.URL.createObjectURL(blob);
      var a = document.createElement('a')
      var url = window.URL.createObjectURL(blob)

      var filename = formName.substring(formName.lastIndexOf('/'))
      a.href = url
      a.download = filename
      a.click()
    }
  }
  xhr.send()
}
export function downloadGets(serviceName, formName) {
  var xhr = new XMLHttpRequest()

  var play_url = store.state.apiConfiguration.url + serviceName + formName
  xhr.open('GET', play_url, true)
  xhr.responseType = 'blob'
  xhr.setRequestHeader('Authorization', getToken())
  xhr.onload = function() {
    if (this.status == 200) {
      var blob = this.response

      // video.onload = function(e) {
      // window.URL.revokeObjectURL(video.src);
      // };
      // video.src = window.URL.createObjectURL(blob);
      var a = document.createElement('a')
      var url = window.URL.createObjectURL(blob)
      console.log(formName)

      var filename = formName.substring(formName.lastIndexOf('/') + 1)
      console.log(filename)
      a.href = url
      a.download = filename
      a.click()
    }
  }
  xhr.send()
}
export function downloadPost(serviceName, formName) {
  var xhr = new XMLHttpRequest()

  var play_url = store.state.apiConfiguration.url + serviceName + formName

  xhr.open('POST', play_url, true)
  xhr.responseType = 'blob'
  xhr.setRequestHeader('Authorization', getToken())
  xhr.onload = function() {
    if (this.status == 200) {
      var blob = this.response

      // video.onload = function(e) {
      // window.URL.revokeObjectURL(video.src);
      // };
      // video.src = window.URL.createObjectURL(blob);
      var a = document.createElement('a')
      var url = window.URL.createObjectURL(blob)
      var filename = formName.substring(formName.lastIndexOf('/') + 1)
      a.href = url
      a.download = filename
      a.click()
    }
  }
  xhr.send()
}
