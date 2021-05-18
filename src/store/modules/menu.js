import { getUserMenuButtonList } from '@/api/user'
import { PcCookie, Key } from '@/utils/cookie'

// 定义状态
const state = {
  init: false, // 是否已经加载用户权限信息
  menuList: [], // 当前用户拥有的菜单权限
  buttonList: [] // 当前用户拥有的按钮权限
}

// 改变状态值
const mutations = {
  SET_SYSTEM_MENU: (state, data) => {
    state.init = true // 已加载用户权限
    state.menuList = data.menuTreeList
    state.buttonList = data.buttonList
  }
}

// 定义行为，异步方法
const actions = {
  // 获取用户菜单和按钮权限
  GetUserMenuButtonList({commit}) {
    return new Promise((resolve, reject) => {
      // 获取用户id
      const userId = PcCookie.get(Key.userInfoKey) ? JSON.parse(PcCookie.get(Key.userInfoKey)).uid : null
      if (userId) {
        getUserMenuButtonList(userId).then(res => {
          // 得到数据, 将获取的菜单和按钮数据保存到vuex状态中
          commit('SET_SYSTEM_MENU', res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      }
    })
  }
}

export default {
  namespaced: true, // 引用里需要指定模块名， /menu/GetUserMenuButtonList
  state,
  mutations,
  actions
}