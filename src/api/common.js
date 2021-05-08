import service from "@/utils/request";

export default {
  uploadFile(data) {
    return service({
      url: '/article/file/upload',
      method: 'post',
      data
    })
  },
  deleteImg(imageUrl) {
    return service({
      url: '/article/file/delete',
      method: 'delete',
      params: {
        'fileUrl': imageUrl
      }
    })
  }
}