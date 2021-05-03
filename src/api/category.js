import service from '@/utils/request'

export default {
  // 分页条件查询分类列表
  getList(query, current = 1, size = 20) {
    return service({ // Promise
      url: `/article/category/find`, // `/article/category/search/?current=1&size=20`
      method: 'post',
      data: { // {name: '前端', status: 1, current: current, size: size}
        ...query,
        current,
        size
      }
    })
  },
  // 添加分类数据
  add (data) {
    // let json = JSON.stringify(data)
    return service({
      url: '/article/category',
      method: 'post',
      data
    })
  },
  // 根据ID查询分类数据
  getById(id) {
    return service({
      url: `/article/category/${id}`,
      method: 'get'
      // data: json
    })
  },
  // 跟新数据
  update(data) {
    return service({
      url: `/article/category`,
      method: 'put',
      data
    })
  }
}