import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getList(query, current = 1, size = 20) {
  return request({
    url: '/system/user/search',
    method: 'post',
    data: {
      ...query,
      current,
      size
    }
  })
}

export function add(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export function getById(id) {
  return request({
    url: `/system/user/${id}`,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: `/system/user`,
    method: 'put',
    data
  })
}

export function deleteById(id) {
  return request({
    url: `/system/user/${id}`,
    method: 'delete'
  })
}
// 查询用户搜拥有的角色ID
export function getRoleIdsByUserId(id) {
  return request({
    url: `/system/user/${id}/roel/ids`,
    method: 'get'
  })
}

export function saveUserRole(id, roleIds) {
  return request({
    url: `/system/user/${id}/role/save`,
    method: 'post',
    data: roleIds
  })
}