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
  // 更新数据
  update(data) {
    return service({
      url: `/article/category`,
      method: 'put',
      data
    })
  },
  // 删除数据
  deleteById(id) {
    return service({
      url: `/article/category/${id}`,
      method: 'delete'
    })
  },
  // 在标签页查询分类数据
  getNormalList() {
    return service({
      url: '/article/category/list',
      method: 'get'
    })
  },
  // 获取所有正常状态下的分类和标签
  getCategoryAndLabel() {
    return service({
      url: '/article/category/label/list',
      method: 'get'
    })
  }
}
