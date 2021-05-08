import service from "@/utils/request";

export default {
  getList(query, current = 1, size = 20) {
    return service({
      url: '/article/advert/search',
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
      url: '/article/advert',
      method: 'post',
      data
    })
  },
  getById(id) {
    return service({
      url: `/article/advert/${id}`,
      method: 'get'
    })
  },
  update(data) {
    return service({
      url: `/article/advert`,
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return service({
      url: `/article/advert/${id}`,
      method: 'delete'
    })
  }
}