import service from '@/utils/request'

export default {
  getList(query) {
    return service({
      url: '/system/menu/search',
      method: 'post',
      data: query
    })
  },
  // 新增
  add (data) {
    return service({
      url: '/system/menu',
      method: 'post',
      data
    })
  },
  getById(id) {
    return service({
      url: `/system/menu/${id}`,
      method: 'get'
    })
  },
  update(data) {
    return service({
      url: `/system/menu`,
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return service({
      url: `/system/menu/${id}`,
      method: 'delete'
    })
  }
}