import { login, logout, getInfo, fetchAllDictionary } from '@/api/user/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    role: '',
    province: '',
    city: '',
    region: '',
    area: '',
    unitId: '',
    userId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_UNIT_ID: (state, unitId) => {
    state.unitId = unitId
  },
  SET_LOCATION: (state, { province, city, region, area }) => {
    state.province = province
    state.city = city
    state.region = region
    state.area = area
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo

    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve(data.role)// 由于需要判断当前角色是否能访问首页，在此提前获取一次role
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息和字典
  getInfo({ commit, state }) {
    return Promise.allSettled([getInfo(state.token), fetchAllDictionary()]).then(([userRes, dictRes]) => {
      if (dictRes.status === 'fulfilled') {
        // 存储字典数据
        localStorage.setItem('onlineOption', JSON.stringify(dictRes.value.data))
        console.log('字典数据', dictRes.value.data)
      }
      if (userRes.status === 'fulfilled') {
        // 设置用户信息
        const { data } = userRes.value

        if (!data) {
          return Promise.reject(new Error('Verification failed, please Login again.'))
        }

        const { username, role, unitId, province, city, region, area, userId } = data

        commit('SET_NAME', username)
        commit('SET_ROLE', role)
        commit('SET_UNIT_ID', unitId)
        commit('SET_LOCATION', { province, city, region, area })
        commit('SET_USER_ID', userId)

        return data
      } else {
        return Promise.reject(new Error('获取用户信息失败'))
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
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

