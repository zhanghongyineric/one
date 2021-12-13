import { getInfo, fetchAllDictionary } from '@/api/system-manage/account-manage'
import { login, logout } from '@/api/user/oauth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import CityTextToCode from '@/utils/AreaTextToCode'
import { platformName } from '@/api/home'
import { unitVehicle } from '@/api/live-monitor/message'
import yuxStorage from 'yux-storage'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '', // 账号名
    unitName: '', // 企业名称 不一定有
    role: '',
    roleName: '',
    province: '',
    city: '',
    region: '',
    area: '',
    unitId: '',
    userId: '',
    cityCode: '',
    monitorTreeData: 0
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
  SET_ROLE_NAME: (state, roleName) => {
    state.roleName = roleName
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
  },
  SET_CITY_CODE: (state, cityCode) => {
    state.cityCode = cityCode
  },
  CHANGE_TREE_DATA: (state) => {
    state.monitorTreeData++
  }
}

// 定时请求实时监测树
let timer

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    timer = setInterval(() => {
      unitVehicle()
        .then(({ data }) => {
          yuxStorage.setItem('monitorTree', data)
            .then(() => {
              commit('CHANGE_TREE_DATA')
              console.log('更新实时数据成功')
            })
        })
        .catch(err => {
          throw err
        })
    }, 300000)
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('username', username.trim())
      formData.append('password', password)
      formData.append('system', process.env.VUE_APP_SYSTEM_TAG)
      formData.append('grant_type', 'password')
      formData.append('client_id', 'admin')
      formData.append('client_secret', 'admin')
      login(formData).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.accessToken)
        setToken(data.accessToken)
        unitVehicle()
          .then(({ data }) => {
            yuxStorage.setItem('monitorTree', data)
              .then(() => {
                commit('CHANGE_TREE_DATA')
                console.log('更新实时数据成功')
              })
          })
          .catch(err => {
            throw err
          })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取城市编码
  getCityCode({ commit, state }) {
    platformName({ plarformId: state.unitId })
      .then(({ data }) => {
        commit('SET_CITY_CODE', CityTextToCode.get(data))
      })
      .catch(err => {
        throw err
      })
  },

  // 获取用户信息和字典
  getInfo({ commit, state }) {
    timer = setInterval(() => {
      unitVehicle()
        .then(({ data }) => {
          yuxStorage.setItem('monitorTree', data)
            .then(() => {
              commit('CHANGE_TREE_DATA')
              console.log('更新实时数据成功')
            })
        })
        .catch(err => {
          throw err
        })
    }, 300000)
    return Promise.allSettled([getInfo(state.token), fetchAllDictionary()]).then(([userRes, dictRes]) => {
      if (dictRes.status === 'fulfilled') {
        // 存储字典数据
        localStorage.setItem('onlineOption', JSON.stringify(dictRes.value.data))
      }
      if (userRes.status === 'fulfilled') {
        // 设置用户信息
        const { data } = userRes.value

        if (!data) {
          return Promise.reject(new Error('Verification failed, please Login again.'))
        }

        const { sysUser, roles } = data
        const { alias, deptId, deptName, id } = sysUser

        if (roles.length === 0) {
          return Promise.reject('未获取到账号角色,请联系管理员进行分配')
        }

        commit('SET_NAME', { alias, deptName })
        commit('SET_ROLE', roles[0].roleCode) // 系统暂时使用单角色，将配置的第一个角色作为账号角色
        commit('SET_ROLE_NAME', roles[0].roleName) // 系统暂时使用单角色，将配置的第一个角色作为账号角色
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
    clearInterval(timer)
    yuxStorage.removeItem('monitorTree')
      .then(_ => {
        console.log('移除数据成功')
      })
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

  //
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

