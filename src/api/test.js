import service from '@/utils/request' // service是在request文件中定义的axios实例，此函数返回一个promise对象
export default {
  test() {
    return service({
      url: '/test',
      method: 'get'
    })
  }
}
