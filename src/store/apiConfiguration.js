// api接口配制文件
/*
local：本地开发配制
dev：测试环境配制
sit：预发布环境配制
uat：验收环境配制
prod：正式环境配制
url：目标地址
imgFileUrl：图片地址
fileUrl：文件地址
cndUrl：cdn静态文件地址
*/
/*
NOW 服务环境
*/
const NOW = 'dev'
const apiConfiguration = {
  rap: {
    url: 'http://192.168.16.237:8811',
    imgFileUrl: 'hdfs://192.168.16.237:9001',
    fileUrl: 'http://192.168.16.237:9001/mds-system-service',
    cdnUrl: ''
  },
  local: {},
  //http://192.168.2.254:8811
  dev: {
    url: 'http://192.168.16.233:9900/',
    imgFileUrl: 'http://192.168.16.233:9900/sdfz-system-service',
    fileUrl: 'http://192.168.16.233:9900',
    cdnUrl: '',
    // messageUrl: '192.168.16.233:8888/',
    messageUrl: '192.168.16.233:9900/'
  },
  // 打包配置
  // dev: {
  //   url: 'http://192.168.16.236:9900/',
  //   imgFileUrl: 'http://192.168.16.236:9900/sdfz-system-service',
  //   fileUrl: 'http://192.168.16.236:9900',
  //   cdnUrl: '',
  //   // messageUrl: '192.168.16.236:8888/',
  //   messageUrl: '192.168.16.236:9900/'
  // },
  test: {},
  sit: {
    url: '',
    imgFileUrl: '',
    fileUrl: '',
    cdnUrl: ''
  },
  uat: {
    url: '',
    imgFileUrl: '',
    fileUrl: '',
    cdnUrl: ''
  },
  prod: {
    url: '',
    imgFileUrl: '',
    fileUrl: '',
    cdnUrl: ''
  }
}
export default apiConfiguration[NOW]
