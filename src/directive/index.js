// 引入所有要注册的全局指令
import permission from './permission'
export default (Vue) => {
  // 第一个参数是指令名，通过v-permission引用
  Vue.directive('permission', permission)
}