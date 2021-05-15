import service from '@/utils/request'

export default {
  // 查询总用户数
  getUserTotal() {
    return service({
      url: '/system/user/total',
      method: 'get'
    })
  },
  // 查询总文章数
  getArticleTotal() {
    return service({
      url: '/system/article/total',
      method: 'get'
    })
  },
  // 查询总问题数
  getQuestionTotal() {
    return service({
      url: '/system/question/total',
      method: 'get'
    })
  },
  // 查询饼图数据
  getPieData() {
    return service({
      url: '/article/article/category/total',
      method: 'get'
    })
  },
  // 查询柱状数据
  getBarData() {
    return service({
      url: '/article/article/month/total',
      method: 'get'
    })
  }
}