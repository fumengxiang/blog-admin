import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import store from '@/store'
import { Message } from 'element-ui'

// 导入cookie.js工具
import { PcCookie, Key } from '@/utils/cookie';

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 不许登录就可以访问的页面白名单
const whiteList = ['/login'] // no redirect whitelist

/**
 * 1. 从cookie获取token
 * 2. 如果有token，在访问/login, 则跳转到首页，如果访问其他路由，则进一步从cookie中获取用户信息，然后跳转到目标路由
 * 3，若果没有token，则判断访问的页面是否是白名单中的页面，如果是就直接跳转，否则，重定向到/login登录界面
 */

// 导航守卫
router.beforeEach(async(to, from, next) => {
  // 网页刷新进度条
  NProgress.start()

  // 获取访问路由的标题
  document.title = getPageTitle(to.meta.title)

  // 通过token判断用户是否登录
  // 从cookie中获取令牌
  const hasToken = PcCookie.get(Key.accessTokenKey)

  if (hasToken) {
    if (to.path === '/login') { // 判断已经登录，但还行访问登录界面，就让他冲定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断是否获取用户信息，从cookie中获取用户信息
      const hasGetUserInfo = PcCookie.get(Key.userInfoKey)
      if (hasGetUserInfo) {
        // 如果有用户信息，则通过用户id获取当前用户所拥有的菜单和按钮
        if (store.getters.init === false) { // 判断是否已经加载用户权限，没有才发送请求权限
          store.dispatch('menu/GetUserMenuButtonList').then(() => {
            // 继续访问目标路由，且不会留下history记录，直接替换路由
            next({...to, replace: true})
          }).catch((err) => { // 获取权限请求异常
            Message({
              message: '获取用户权限信息失败',
              type: 'error'
            })
          })
        } else { // 已经初始化就直接访问
          next() // 直接跳转路由
        }
      } else {
        // 没有用户信息，则没有登录，跳转到登录页，即跳转到认证客户端
        // vue根据环境自动选择开发环境与生产环境
        window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/?redirectURL=${window.location.href}`
      }
    }
  } else { // 没有登录

    if (whiteList.indexOf(to.path) !== -1) { // 判断是否在白名单中，如果是，就直接放行
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/?redirectURL=${window.location.href}`
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
