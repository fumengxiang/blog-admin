import service from '@/utils/request'
export default {
  getList(query, current = 1, size = 20) {
    return service({
      url: '/article/article/search',
      method: 'post',
      data: {
        ...query,
        current,
        size
      }
    })
  },
  // 根据id获取指定文章
  getById(id) {
    return service({
      url: `/article/article/${id}`,
      method: 'get'
    })
  },
  // 文章审核通过
  auditSuccess(id) {
    return service({
      url: `/article/article/audit/success/${id}`,
      method: 'get'
    })
  },
  // 文章审核不通过
  auditFail(id) {
    return service({
      url: `/article/article/audit/fail/${id}`,
      method: 'get'
    })
  },
  deleteById(id) {
    return service({
      url: `/article/article/${id}`,
      method: 'delete'
    })
  }
}