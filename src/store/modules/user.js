import { login, logout, getInfo } from '@/api/acl/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入创建的异步路由 asyncRoutes, 任意路由 anyRoute, 常量路由 constantRoutes, 
import { resetRouter, allAsyncRoutes, anyRoute, constantRoutes } from '@/router'
import { cloneDeep } from 'lodash'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), // 登录时所携带的 token 值
    name: '', // 用户名
    avatar: '',// 用户头像
    // 预设资源, 以下数据都是后台返回的数据, 并将数据存放这些资源当中
    roles: [], // 用户的角色
    routes: [], // 菜单路由的数组清单
    buttons: [], // 按钮权限清单
    asyncRoutes: [], // 异步路由

  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 登录后设置用户的 token 并将 token 存放于 state 中
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 获取用户信息 并将 userInfo 存放于 state 中
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    // 将后台返回的用户登录信息放入 state 中
    state.roles = userInfo.roles
    state.buttons = userInfo.buttons
  },
  // 设置 routers 函数
  SET_ROUTES(state, asyncRoutes) {
    /* 
      将得到的显示菜单路由存放于 state 中的 asyncRoutes 中
      但是和任意路由, 常量路由没有任何关系; 下一步需要将他们进行关联 
    */
    state.asyncRoutes = asyncRoutes;
    /*
      !! 使用 数组方法 concat 将 常量路由, 异步路由, 任意路由, 合拼成新的数组
      !! 此时合并的路由只是放在 state 中的一个数组而已, 并不是路由对象, 最终state.routes 只是用作菜单显示作用

    */
    state.routes = constantRoutes.concat(asyncRoutes, [anyRoute]);
    router.addRoutes([...asyncRoutes, anyRoute]);
  }
}

/* 
    !! 现在需要将现有的异步路由与后台返回的 routes 进行对比操作
    !! 需要两个参数: 异步路由 asyncRoutes, 路由名称数组
*/
function filterAsyncRoutes(allAsyncRoutes, routeNames) {
  // 过滤异步路由 allAsyncRoutes 数组, 过滤路由里的 name 属性
  const asyncRoutes = allAsyncRoutes.filter((item) => {
    // 因为路由名称数组是一堆数组, 里面包含的内容就是路由的名称, 所以他和异步路由的 name 属性去做对比
    // 当路由名称数组里包含异步路由的 name 属性时进入 if 判断
    if (routeNames.indexOf(item.name !== -1)) {
      // 这里进行双重判断是因为路由里面包含子路由 children
      // 当路由里包含 children 并 children 数组的长度不为 0    
      if (item.children && item.children.length) {
        // 递归调用, 将 children 数组里的路由对象进行再次过滤, 调用自身并传值
        item.children = filterAsyncRoutes(item.children, routeNames)
      }
      // 没有 children 直接返回
      return true
    }
  })
  // 将最终过滤的结果进行返回
  return asyncRoutes
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        // 将 token 提交到 mutations 中
        commit('SET_TOKEN', data.token)
        // 将 token 存放于 Cookies 中
        setToken(data.token)
        resolve()
        // 捕获到的错误
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, avatar } = data

        /* commit('SET_', name)
        commit('SET_AVATAR', avatar) */
        // 同一提交到 mutations 中
        commit('SET_USERINFO', data)
        // 调用过滤异步路由函数, 最终的得到显示菜单的异步路由, 并存放于 state 中
        commit("SET_ROUTES", filterAsyncRoutes(cloneDeep(allAsyncRoutes), data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

