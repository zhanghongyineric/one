<!--
  - FileName: 登录
  - @author: ZhouJiaXing
  - @date: 2021/4/30 下午4:40
  -->

<template>
  <div class="login-container">
    <div class="outer_box">
      <span class="el-icon-close" style="opacity: 0;height: 0" />
      <div class="title-container">
        <h3 class="title">四川省交通安全风控大数据平台</h3>
        <h2 class="subtitle">监测·管理</h2>
      </div>
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

        <div style="overflow: hidden">
          <el-button
            :loading="loading"
            size="medium"
            style="width:150px;margin-bottom:0;padding:14px 20px;float: right;color: #606266;"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>
        </div>

        <svg-icon icon-class="code" class="code code_1" />
        <svg-icon icon-class="code" class="code code_2" />
        <svg-icon icon-class="code" class="code code_3" />
        <svg-icon icon-class="code" class="code code_4" />

      </el-form>
      <div class="footer">
        <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/recordQuery" style="margin-right: 20px;">蜀ICP备2020030187号</a>
        <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/recordQuery" style="margin-right: 80px;">蜀ICP备2020030187号-1</a>
        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51019002003222">
          <img src="@/assets/login_images/police.png" style="width: 20px;height: 20px">
          川公网安备 51019002003222 号
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import './libs/jigsaw'
import './libs/jigsaw.css'

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
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      query: undefined // 重定向页面携带过来的参数
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
  mounted() {
    let isInSlider = false // 鼠标是否在拼图区域
    let isMouseDown = false // 鼠标是否处于按下状态
    const _this = this

    // 初始化滑动验证
    window.jigsaw.init({
      el: document.getElementById('captcha'),
      width: 428,
      height: 200,
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
            this.$store.dispatch('user/login', this.loginForm).then((role) => {
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
.login-container {
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
    margin-bottom: 34px;
    border: 1px solid rgba(255, 255, 255, 0.1);
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

.login-container {
  display: flex;
  position: relative;
  height: 100%;
  min-height: 650px;
  min-width: 850px;
  width: 100%;
  background: rgb(0, 31, 72) url("../../assets/login_images/login_bg.png") no-repeat; //先显示背景颜色，再显示背景图
  background-size: cover;
  overflow: hidden;
  justify-content: center;
  align-items: center;

  .outer_box {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: -100px;
    width: 900px;
    max-width: 100%;
  }

  .login-form {
    position: relative;
    width: 560px;
    padding: 65px 65px 25px 65px;
    background: rgb(1, 27, 57);
    box-shadow: 0px 1px 25px 13px rgba(95, 82, 168, 100);
    @include borderd_h(white, 1, 5);

    ::v-deep.el-form-item__content {
      background: white;
      border-radius: 4px;
    }

    .code {
      position: absolute;
      width: 25px;
      height: 25px;
      color: white;
    }

    .code_1 {
      left: 0;
      top: 0;
    }

    .code_2 {
      right: 0;
      top: 0;
    }

    .code_3 {
      left: 0;
      bottom: 0;
    }

    .code_4 {
      bottom: 0;
      right: 0;
    }
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
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 46px;
      color: $light_gray;
      margin: 0px auto ;
      text-align: center;
      font-weight: bold;
    }
    .subtitle{
      font-size: 30px;
      text-align: center;
      font-weight: bold;
      color: $light_gray;
      margin-bottom: 80px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
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
    bottom: 107px;
    left: 65px;

    ::v-deep.sliderContainer {
      border: none !important;
    }
  }

  #captcha.showSliderImage {
    bottom: 86px;
    height: 275px;
  }

  #captcha.hideSliderImage {
    height: 50px;

    > :not(.sliderContainer) {
      display: none !important;
    }
  }
}

.footer {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 20px;
  height: 50px;
  a{
    display: flex;
    align-items: center;
    height: 16px;
    line-height: 16px;
    color: white;

    img{
      margin-right: 4px;
    }
  }
}
</style>
