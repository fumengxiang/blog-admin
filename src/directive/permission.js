// 自定义权限指令
import store from '@/store'

export default {
  // 指令钩子
  inserted(el, binding) {
    // el 指定作用的元素
    // 获取使用指令时传递的值
    const { value } = binding

    // 获取用户当前所拥有的按钮权限
    const buttonList = store.getters && store.getters.buttonList
    if (value) { // 自定义指令中传入了值
      // some 遇到true时，会直接结束数组遍历
      const hasPermission = buttonList.some(button => {
        return button === value
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else { // 自定义指令中没有传值
      throw new Error(`需要指定权限标识！比如 v-permission="article:delete"`)
    }
  }
}
