import service from '@/utils/request'
export default {
  getList(query, current = 1, size = 20) {
    return service({
      url: '/system/role/search',
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
      url: '/system/role',
      method: 'post',
      data
    })
  },
  getById(id) {
    return service({
      url: `/system/role/${id}`,
      method: 'get'
    })
  },
  update(data) {
    return service({
      url: '/system/role',
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return service({
      url: `/system/role/${id}`,
      method: 'delete'
    })
  },
  getMenuIdsByRoleId(id) {
    return service({
      url: `/system/role/${id}/menu/ids`,
      method: 'get'
    })
  },
  // 保存角色拥有的菜单
  updateRolePermission(id, menuIds) {
    return service({
      url: `/system/role/${id}/menu/save`,
      method: 'post',
      data: menuIds
    })
  }
}