import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo, title } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  tagsView: true,
  theme: 'dark',
  title,
  monitorTreeData: 0
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  CHANGE_THEME: (state, theme) => {
    state.theme = theme
  },
  CHANGE_TREE_DATA: (state) => {
    state.monitorTreeData++
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

