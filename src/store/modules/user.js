import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), // 登录时所携带的 token 值
    name: '', // 用户名
    avatar: '' // 用户头像
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
  }
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

        const { name, avatar } = data

        /* commit('SET_', name)
        commit('SET_AVATAR', avatar) */
        // 同一提交到 mutations 中
        commit('SET_USERINFO', data)
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

