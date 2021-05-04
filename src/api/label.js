import service from "@/utils/request";

export default {
  // 标签分页查询
  getList(query, current = 1, size = 20) {
    return service({
      url: '/article/label/search',
      method: 'post',
      data: {
        ...query,
        current,
        size
      }
    })
  },
  add(data) {
    return service({
      url: 'article/label',
      method: 'post',
      data
    })
  },
  getById(id) {
    return service({
      url: `/article/label/${id}`,
      method: 'get'
    })
  },
  updata(data) {
    return service({
      url: '/article/label',
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return service({
      url: `/article/label/${id}`,
      method: 'delete'
    })
  }
}