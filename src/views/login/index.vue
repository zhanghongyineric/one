<template>
  <div class="login-page">
    <div id="contPar" class="contPar">
      <div id="page1" style="z-index:1;">
        <div class="title0">四川省交通安全风控大数据平台</div>
        <div class="title1">助力政府监管，降低安全隐患</div>
        <div class="imgGroug">
          <ul>
            <img alt="" class="img0 png" draggable="false" src="./img/page1_0.png">
            <img alt="" class="img1 png" draggable="false" src="./img/page1_1.png">
            <img alt="" class="img2 png" draggable="false" src="./img/page1_2.png">
          </ul>
        </div>
        <img alt="" class="img3 png" draggable="false" src="./img/page1_3.jpg">
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
            <div style="overflow: hidden;text-align: center;margin-top:50px;">
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
          <h3 class="welcome system-text">监测·管理端</h3>
          <h2>
            <span style="cursor: pointer" @click="drawer = true">v{{ version }}</span>
          </h2>

          <el-drawer
            custom-class="version-drawer ql-editor"
            :visible.sync="drawer"
            :direction="direction"
            :with-header="false"
            :modal="false"
            size="20%"
          />
          <span v-if="drawer" class="history-version-text">历史版本信息</span>
        </div>
      </div>
    </div>

    <div :class="[drawer ? 'close-symbol' : 'expand-symbol']" @click="switchDrawer">
      <div :class="[drawer ? 'left-arrow' : 'right-arrow']" />
    </div>
    <div class="footer">
      <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/recordQuery" style="margin-right: 20px;">蜀ICP备20014004号</a>
      <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/recordQuery" style="margin-right: 80px;">蜀ICP备20014004号-2</a>
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51010702002449">
        <img src="@/assets/login_images/police.png" style="width: 20px;height: 20px">
        川公网安备 51010702002449 号
      </a>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import './libs/jigsaw'
import './libs/jigsaw.css'
import { historicVersion, sysPort } from '@/api/system-manage/version-manage'

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
      drawer: false,
      direction: 'ltr',
      arrowStyle: 'right-arrow'
    }
  },
  computed: {
    title() {
      return this.$store.state.settings.title
    }
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
    this.startAnimation()
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
    startAnimation() {
      const mainObj = {
        $par: $('#contPar'),
        init: function() {
          if (this.is_pc()) {
            const a = this.$par.children().eq(0)
            const b = a.find('.img1,.img2')
            const d = a.find('.img3')
            const g = {
              margin_left: parseInt(a.find('.img1').css('margin-left')),
              margin_top: parseInt(a.find('.img1').css('margin-top'))
            }
            const i = {
              margin_left: parseInt(a.find('.img3').css('margin-left')),
              margin_top: parseInt(a.find('.img3').css('margin-top'))
            }
            a.mousemove(function(a) {
              const l = mainObj.getWinW()
              const m = mainObj.getWinH()
              const n = a.screenX
              const o = a.screenY
              const p = 0.03 * (n - l / 2)
              const q = 0.02 * (o - m / 2)
              b.css({ 'margin-left': g.margin_left - 0.3 * p + 'px', 'margin-top': g.margin_top - 0.3 * q + 'px' })
              d.css({ 'margin-left': i.margin_left + 1.2 * p + 'px', 'margin-top': i.margin_top + 1.2 * q + 'px' })
            })
          } else {
            $(document).bind('touchmove', function(a) { a.preventDefault() })
            $('img').bind('touchend', function(a) { a.preventDefault() })
          }
          $('img').each(function() {
            const a = $(this).attr('data-src')
            a != null && $(this).attr('src', a).removeAttr('data-src').addClass('png')
          })
        },
        getWinW: function() { return $(window).width() },
        getWinH: function() { return $(window).height() },
        is_pc: function() {
          for (let a = ['Android', 'iPhone', 'Windows Phone', 'iPod', 'iPad', 'BlackBerry', 'MeeGo', 'SymbianOS'],
            b = navigator.userAgent, c = a.length, d = 0; c > d;
            d++) { if (b.indexOf(a[d]) > 0) return !1 } return !0
        }
      }
      mainObj.init()
    },
    getSysPort() {
      sysPort()
        .then(res => {
          res.data.forEach(item => {
            if (item.label === '管理端·检测端') {
              this.systemCode = item.value
            }
          })
          historicVersion({ port: this.systemCode })
            .then(res => {
              if (res.data) {
                const { data: { number, content, historyContent }} = res
                this.version = number
                const eleItem = document.getElementsByClassName('version-drawer')[0]
                historyContent ? eleItem.innerHTML = content + historyContent : eleItem.innerHTML = content
              }
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
    switchDrawer() {
      this.drawer = !this.drawer
      this.drawer ? this.arrowStyle = 'left-arrow' : this.arrowStyle = 'right-arrow'
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
  .login-page .el-input input {
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
    // margin-bottom: 47px;
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
@import './css/style.css';

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

// .login-page {
//   width: 100%;
//   min-width: 1300px;
// }

    .right {
      flex: 1;
      height: 500px;
      width: 440px;
      // background: white;
      border: 2px solid;
      padding-top: 30px;
      // position: absolute;
      // right: 17%;
      // top: 20%;
      border-radius: 10px;
      z-index: 999;

      .welcome {
        letter-spacing: 2px;
        margin: 0 0 20px;
        display: block;
        text-align: center;
        color: #2ec0f6;
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
        color: #2ec0f6;
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
        margin-top: 40px;
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

        ::v-deep .sliderContainer {
          border: none !important;
        }
      }

      //显示图片时
      #captcha.showSliderImage {
        bottom: 110px;
        height: 232px;
      }

      #captcha.hideSliderImage {
        height: 50px;

        > :not(.sliderContainer) {
          display: none !important;
        }
      }

      h2 {
        font-size: 16px;
        line-height: 50px;
        letter-spacing: 3px;
        text-align: center;
        color: #2ec0f6;
        font-weight: normal;
        margin-top: -10px;
      }
    }

::v-deep .version-drawer {
  padding: 70px 20px 20px !important;
  min-width: 250px !important;
  background-color:transparent !important;
  overflow-y: auto !important;
}

.history-version-text {
  position: fixed;
  left: 6%;
  top: 20px;
  z-index: 3000;
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #2ec0f6;
}
.expand-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color: transparent  transparent  transparent #2ec0f6;
  position: fixed;
  top: 48%;
  left: 0;
  cursor: pointer;
  transition: left .3s;
}

.close-symbol {
  width: 60px;
  height: 60px;
  background: transparent;
  border-width: 15px;
  border-style: solid;
  border-color: transparent  transparent  transparent #2ec0f6;
  position: fixed;
  top: 48%;
  left: 20%;
  cursor: pointer;
  transition: left .3s;
}

.right-arrow {
  width: 10px;
  height: 10px;
  border-top: 2px solid #0092e7;
  border-right: 2px solid #0092e7;
  transform: rotate(45deg);
  position: relative;
  top: 10px;
  right: 15px;
}

.left-arrow {
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #0092e7;
  border-left: 2px solid #0092e7;
  transform: rotate(45deg);
  position: relative;
  top: 10px;
  right: 10px;
}
.system-text {
  text-align: center;
  color: #2ec0f6;
  // font-size: 20px;
  margin-top: -20px !important;
  font-size: 25px !important;
}
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  position:fixed;
  bottom: 0;

  a {
    display: flex;
    align-items: center;
    height: 16px;
    line-height: 16px;
    color: #2ec0f6;

    img {
      margin-right: 4px;
    }
  }
}
</style>
