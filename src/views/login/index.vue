<template>
  <div class="login-page f-col ai-c jc-sb">
    <div class="for-justify-content" />
    <div class="login-box">
      <div class="left">
        <div class="description">
          <h1>{{ title }}</h1>
          <h2>助力政府监管，降低安全隐患</h2>
          <el-tooltip
            placement="bottom"
            effect="dark"
          >
            <div slot="content">{{ versionDesc }}</div>
            <h2 class="version-text" @click="toHistoryVersion">v{{ version }}</h2>
          </el-tooltip>
          <h3>监测·管理端</h3>
        </div>
      </div>
      <div class="right">
        <h2 class="welcome">欢迎登录</h2>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          size="small"
          label-position="left"
        >
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="off"
              clearable
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              clearable
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="off"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <!--滑动验证-->
          <div id="captcha" :class="showSliderImage?'showSliderImage':'hideSliderImage'" />
          <p class="slider-placeholder">
            向右滑动填充拼图
            <span v-show="showFinishSliderTip" class="finishSlider">请先完成拼图</span>
          </p>

          <div style="overflow: hidden;text-align: center">
            <el-button
              :loading="loading"
              type="primary"
              size="large"
              class="login-button"
              @click.native.prevent="handleLogin"
            >
              登录
            </el-button>
          </div>
        </el-form>

      </div>
    </div>

    <div class="footer">
      <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/recordQuery" style="margin-right: 20px;">蜀ICP备20014004号</a>
      <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/recordQuery" style="margin-right: 80px;">蜀ICP备20014004号-2</a>
      <!-- <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51019002003222">
        <img src="@/assets/login_images/police.png" style="width: 20px;height: 20px">
        川公网安备 51019002003222 号
      </a> -->
    </div>
  </div>
</template>

<script>
import './libs/jigsaw'
import './libs/jigsaw.css'
import { selectVersion, sysPort } from '@/api/system-manage/version-manage'

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码必须超过6位'))
      } else {
        callback()
      }
    }
    return {
      client: null,
      passed: false, // 是否通过验证
      showSliderImage: false, // 是否显示图片
      showFinishSliderTip: false, // 拼图提示
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'change', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      query: undefined, // 重定向页面携带过来的参数
      systemCode: '',
      version: '',
      versionDesc: ''
    }
  },
  computed: {
    title() {
      return this.$store.state.settings.title
    }
    // version() {
    //   return process.env.VUE_APP_SYSTEM_VERSION
    // }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        this.query = route.query && route.query.query && JSON.parse(route.query.query)
      },
      immediate: true
    }
  },
  created() {
    this.getSysPort()
  },
  mounted() {
    let isInSlider = false // 鼠标是否在拼图区域
    let isMouseDown = false // 鼠标是否处于按下状态
    const _this = this

    // 初始化滑动验证
    window.jigsaw.init({
      el: document.getElementById('captcha'),
      width: 318,
      height: 180,
      onSuccess: function() {
        _this.passed = true
        _this.handleLogin()
      },
      onFail: function() {
        _this.passed = false
      },
      onRefresh: function() {
        _this.passed = false
      }
    })
    const slider = document.querySelector('.slider') // 轨道中的滑块
    const sliderBlock = document.querySelector('#captcha .block') // 拼图中的裁切图片
    const sliderContainer = document.querySelector('#captcha')

    // 在滑块中按下鼠标
    slider.onmousedown = function() {
      isMouseDown = true
    }
    // 按裁切图中下鼠标
    sliderBlock.onmousedown = function() {
      isMouseDown = true
    }
    // 鼠标弹起
    document.onmouseup = function() {
      isMouseDown = false
      // 鼠标弹起时如果不在拼图区域，则隐藏拼图
      if (!isInSlider) {
        _this.showSliderImage = false
      }
    }

    // 鼠标移动到滑块上显示拼图
    slider.onmouseenter = function() {
      _this.showSliderImage = true
      _this.showFinishSliderTip = false
    }

    // 鼠标进入拼图
    sliderContainer.onmouseenter = function() {
      isInSlider = true
    }

    // 鼠标离开拼图区域隐藏拼图
    sliderContainer.onmouseleave = function() {
      isInSlider = false
      // 如果鼠标已经弹起才隐藏拼图
      if (!isMouseDown) {
        _this.showSliderImage = false
      }
    }
  },
  methods: {
    getSysPort() {
      sysPort()
        .then(res => {
          res.data.forEach(item => {
            if (item.value === '管理端·检测端') {
              this.systemCode = item.label
            }
          })
          selectVersion({ port: this.systemCode })
            .then(res => {
              const { data: { number, content }} = res
              this.version = number
              this.versionDesc = content
            })
            .catch(err => {
              throw err
            })
        })
        .catch(err => {
          throw err
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.passed) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.query })
              this.loading = false
            }).catch((e) => {
              console.log(e)
              document.querySelector('#captcha .refreshIcon').click()
              this.loading = false
            })
          } else {
            this.showFinishSliderTip = true
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toHistoryVersion() {
      this.$router.push({ path: '/HistoryVersions', query: { code: this.systemCode }})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: black; //光标颜色
$color: #000; //input字体颜色
$input_bg: #fff; //input背景颜色
$input_font_size: 14px;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-page {
  .el-input {
    display: inline-block;
    height: 37px;
    width: 75%;
    font-size: $input_font_size;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $color;
      height: 37px;
      caret-color: $cursor;
      font-size: $input_font_size;

      //自动填充的样式
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $input_bg inset !important;
        -webkit-text-fill-color: $color !important;
        color: $color;
        font-size: $input_font_size;
      }
    }
  }

  .el-form-item {
    margin-bottom: 47px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-size: 20px;
    color: $color;
  }
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

body {
  height: 100%;
  overflow: hidden;
}

.login-page {
  min-width: 1180px;
  min-height: 750px;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background: rgb(227, 240, 255) url("../../assets/login_images/bg.png") no-repeat center; //先显示背景颜色，再显示背景图

  .logo {
    position: absolute;
    top: 10px;
    left: 10px;

    img {
      width: 70px;
    }
  }

  .login-box {
    display: flex;
    width: 1156px;
    height: 600px;
    margin:  0 auto -50px;
    overflow: hidden;
    box-shadow: 0px 0px 13px 5px rgb(14 25 80 / 20%);
    border-radius: 10px;

    .left {
      width: 716px;
      height: 600px;
      overflow: hidden;
      background: rgb(227, 240, 255) url("../../assets/login_images/traffic.jpg") no-repeat center;
      background-size: auto 100%;

      .description {
        height: 600px;
        padding-top: 190px;
        background-image: linear-gradient(to bottom, rgba(47, 213, 201, 0.8), rgba(71, 148, 230, 0.8));

        h1, h2, h3 {
          margin: 0;
          text-align: center;
          color: white;
          font-weight: normal;
        }

        h1 {
          font-size: 40px;
          line-height: 90px;
          font-family: 'SimSun,Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu ';
        }

        h2 {
          font-size: 26px;
          line-height: 70px;
          letter-spacing: 3px;
        }

        h3 {
          padding-top: 90px;
          font-size: 24px;
          line-height: 70px;
          letter-spacing: 3px;
        }
      }
    }

    .right {
      flex: 1;
      height: 100%;
      background: white;
      padding-top: 60px;

      .welcome {
        letter-spacing: 2px;
        margin: 0 0 50px;
        display: block;
        text-align: center;
        color: #0092e7;
        font-size: 30px;
        font-weight: normal;
      }

      .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .svg-container {
        padding: 6px 5px 6px 15px;
        color: #0092e7;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }

      .login-form {
        position: relative;
        height: 329px;
        padding: 0 60px 25px;

        ::v-deep.el-form-item__content {
          background: white;
          border-radius: 4px;
        }

        .login-button {
          width: 100%;
          height: 50px;
          padding: 0;
          line-height: 50px;
          border: none;
          border-radius: 60px;
          background: #14a7ff;
          color: #fff;
          font-size: 18px;
          letter-spacing: 2px;
          cursor: pointer;
        }

      }

      .show-pwd {
        position: absolute;
        right: 10px;
        top: 3px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }

      .slider-placeholder {
        position: relative;
        margin-bottom: 34px;
        height: 38px;
        text-align: center;
        line-height: 38px;
        margin-top: 15px;
        background: #f7f9fa;
        color: #45494c;
        border: 1px solid transparent;

        .finishSlider {
          position: absolute;
          left: 0;
          bottom: -32px;
          color: #F56C6C;
          font-size: 12px;
        }
      }

      #captcha {
        position: absolute !important;
        z-index: 1;
        bottom: 110px;
        left: 60px;

        ::v-deep.sliderContainer {
          border: none !important;
        }
      }

      //显示图片时
      #captcha.showSliderImage {
        bottom: 110px;
        height: 234px;
      }

      #captcha.hideSliderImage {
        height: 50px;

        > :not(.sliderContainer) {
          display: none !important;
        }
      }
    }
  }
}

.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;

  a {
    display: flex;
    align-items: center;
    height: 16px;
    line-height: 16px;
    color: white;

    img {
      margin-right: 4px;
    }
  }
}

.version-text {
  cursor: pointer;
}
</style>
