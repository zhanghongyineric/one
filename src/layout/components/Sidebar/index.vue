<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :style="{'background-color':darkTheme?'':'#fff'}"
    >
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="darkTheme?variables.menuBg:'#fff'"
        :text-color="darkTheme?variables.menuText:'#606266'"
        :unique-opened="false"
        :active-text-color="darkTheme?variables.menuActiveText:'#53A8FF'"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
      <div class="footer " :style="{display:isCollapse?'none':'block' }">
        <div class="toggle-theme f jc-c ai-c" @click="toggleTheme">
          <svg-icon :icon-class="iconClass" class="theme-icon" :style="{fill: darkTheme?'#fff' : '#606266'}" />
          <span class="model-text" :style="{color: darkTheme?'' : '#606266'}">{{ modelText }}</span>
        </div>
        <div class="box f-col-sb-c">
          <!-- <div style="height:34px;overflow:hidden;" class="f-c">
            <div id="he-plugin-simple" />
          </div> -->
          <span class="time" :style="{color: darkTheme?'' : '#606266'}">{{ this.time }}</span>
          <div class="date" :style="{color: darkTheme?'' : '#606266'}">
            <span>{{ this.date }}</span>
          </div>
          <div class="company" :style="{color: darkTheme?'' : '#606266'}">
            四川明亚智行提供技术支持
          </div>
        </div>
      </div>
    </el-scrollbar>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { parseTime } from '@/utils'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      date: '-',
      time: '-',
      theme: 'dark',
      modelText: '浅色模式'
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    iconClass() {
      return this.theme === 'dark' ? 'sun' : 'moon'
    },
    darkTheme() {
      return this.$store.state.settings.theme === 'dark'
    }
  },
  watch: {
    theme() {
      this.modelText = this.theme === 'dark' ? '浅色模式' : '深色模式'
    }
  },
  async created() {
    this.setTime()
    setInterval(_ => {
      this.setTime()
    }, 1000)
  },
  mounted() {
    window.WIDGET = {
      'CONFIG': {
        'modules': '01234',
        'background': '5',
        'tmpColor': 'FFFFFF',
        'tmpSize': '16',
        'cityColor': 'FFFFFF',
        'citySize': '16',
        'aqiColor': 'FFFFFF',
        'aqiSize': '16',
        'weatherIconSize': '24',
        'alertIconSize': '18',
        'padding': '10px 10px 10px 10px',
        'shadow': '0',
        'language': 'auto',
        'fixed': 'false',
        'vertical': 'top',
        'horizontal': 'left',
        'key': 'd1f6aa034c234ecca3d998d02d94165b'
      }
    };
    (function(d) {
      const script = d.getElementsByTagName('script')[0]
      const newScript = d.createElement('script')
      newScript.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0'
      script.parentNode.insertBefore(newScript, script)
    })(document)
    const theme = localStorage.getItem('theme')
    if (theme !== 'dark') {
      window.document.body.className = ''
      this.theme = ''
    } else {
      window.document.body.className = 'dark-theme'
      this.theme = 'dark'
    }
  },
  methods: {

    // 设置日期
    setTime() {
      this.date = parseTime(new Date(), '{y}年{m}月{d}日 星期{a}')
      this.time = parseTime(new Date(), '{h}:{i}:{s}')
    },
    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      const bodyClass = window.document.body.className
      if (bodyClass) {
        window.document.body.className = ''
        this.$store.commit('settings/CHANGE_THEME', 'light')
        localStorage.setItem('theme', 'light')
      } else {
        window.document.body.className = 'dark-theme'
        this.$store.commit('settings/CHANGE_THEME', 'dark')
        localStorage.setItem('theme', 'dark')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// ::v-deep .el-submenu__title,
// ::v-deep .el-menu-item {
//   &:hover {
//     background-color: #ECF5FF !important;
//   }
// }
.footer{
  //position: absolute;
  //bottom: 0;
  //left: 0;
  width: 210px;
  height: 150px;
  padding-bottom: 20px;
  font-size: 16px;
  color:white;
  margin-bottom: 40px;

  .toggle-theme {
    height: 44px;
    cursor: pointer;
    // position: absolute;
    // margin-top: -40px;
    // margin-left: 60px;

    .theme-icon {
      margin-right: 6px !important;
      width: 28px;
      height: 28px;
    }

    .model-text {
      font-size: 14px;
      font-weight: 400;
      color: #FFF;
      line-height: 20px;
    }
  }

  .box{
    height: 100%;
    >div{
      width: 100%;
      text-align: center;
    }
    .weather{
      img{
        width: 20px;
        height: 20px;
      }
      .temperature{
      }
    }
    .time{
      font-size: 20px;
    }
    .company{
      text-align: center;
    }
  }
}
</style>
