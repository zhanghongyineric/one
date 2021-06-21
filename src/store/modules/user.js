import { getInfo, fetchAllDictionary } from '@/api/system-manage/account-manage'
import { login, logout } from '@/api/user/oauth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '', // 账号名
    unitName: '', // 企业名称 不一定有
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
  SET_NAME: (state, { alias, deptName }) => {
    state.name = alias
    state.unitName = deptName
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
      const formData = new FormData()
      formData.append('username', username.trim())
      formData.append('password', password)
      formData.append('grant_type', 'password')
      formData.append('client_id', 'admin')
      formData.append('client_secret', 'admin')
      login(formData).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.accessToken)
        setToken(data.accessToken)
        resolve()
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

        const { sysUser } = data
        const { alias, deptId, deptName, id } = sysUser
        commit('SET_NAME', { alias, deptName })
        commit('SET_ROLE', 'admin')
        commit('SET_UNIT_ID', deptId)
        // commit('SET_LOCATION', { province, city, region, area })
        commit('SET_USER_ID', id)

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

