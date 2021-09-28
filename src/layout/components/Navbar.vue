<template>
  <div class="navbar clearfix">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div v-if="role" class="right-menu">
      <img src="../../assets/to-gu.png" class="icon-to-gu" @click="setCookie">
      <a v-if="showLink" target="_blank" class="to-gu" @click="setCookie">政府·企业端</a>
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="f-c-c" style="cursor:pointer;height: 100%">
          <span style="font-weight: bold;margin-right: 15px">当前身份:{{ roleName }}</span>
          <i class="el-icon-s-custom" style="font-size: 16px;margin-right: 5px" />
          <span class="username">{{ name || '-' }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="handleUpdate">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <ChangePassword
        ref="password"
        :visible.sync="dialogFormVisible"
      />
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import ChangePassword from './ChangePassword'
import Hamburger from '@/components/Hamburger'
import connect from '@/utils/mqtt'
import Cookies from 'js-cookie'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ChangePassword
  },
  data() {
    return {
      dialogFormVisible: false,
      showLink: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'role',
      'roleName',
      'unitName',
      'area'
    ])
  },
  mounted() {
    this.showLink = this.role === 'admin'
  },
  methods: {
    setCookie() {
      Cookies.set('pc_safe_code', Cookies.get('monitor'), { domain: 'myzx.sc.cn' })
      setTimeout(() => {
        // window.open('http://localhost:9529/#/home')
        window.open('http://www.fk.myzx.sc.cn/#/home')
      })
    },
    initMqtt() {
      this.client = connect()
      this.client.on('connect', () => {
        console.log('连接成功')
        // 订阅多个主题,必须先订阅才能在 message 中 收到消息
        this.client.subscribe(
          ['test'], // 订阅主题
          { qos: 1 }, // 保证消息传递次数
          (err) => {
            console.log(err || '订阅成功')
          }
        )
      })
      // 失败重连
      this.client.on('reconnect', (error) => {
        console.log('正在重连:', error)
      })
      // 连接失败
      this.client.on('error', (error) => {
        console.log('连接失败:', error)
      })
      // 接收消息
      this.client.on('message', (topic, message) => {
        console.log('收到消息：', topic, message.toString())
        this.$notify({
          type: 'success',
          title: '收到消息',
          duration: 0,
          message: message.toString()
        })
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      const loading = this.$loading({
        lock: true,
        text: '正在退出登录...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        await this.$store.dispatch('user/logout')
        loading.close()
        this.$router.push(`/login?redirect=${this.$route.path}&query=${JSON.stringify(this.$route.query)}`)
      } catch (e) {
        loading.close()
      }
    },
    handleUpdate() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['password'].$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  //height: 50px;
  //overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    display: flex;
    height: 100%;
    line-height: 50px;

    .icon-to-gu {
      width: 25px;
      height: 25px;
      margin-top:13px;
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }

    .to-gu {
      font-size: 14px;
      font-weight: 700;
      color: #4ea1db;
      text-decoration: none;
      margin-right: 20px;
    }

    .role {
      margin-right: 10px;
      font-size: 14px;
      font-weight: bold;
      color: rgb(96, 98, 102)
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .username {
        display: flex;
        font-weight: bold;
      }

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
