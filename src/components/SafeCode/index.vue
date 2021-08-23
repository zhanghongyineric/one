<template>
  <div>
    <div :id="id" class="safe-code" />
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'SafeCode',
  props: {
    // 必须唯一
    id: {
      required: true,
      type: String
    },
    width: {
      required: false,
      type: Number,
      default: 40
    },
    height: {
      required: false,
      type: Number,
      default: 40
    },
    // 二维码内容
    text: {
      required: true,
      type: String
    },
    color: {
      required: true,
      type: String,
      default: '#000'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.qrcode()
    })
  },
  methods: {
    qrcode() {
      new QRCode(this.id, {
        width: this.width,
        height: this.height,
        text: this.text,
        colorDark: this.color,
        colorLight: '#fff'
      })
    }
  }
}
</script>
<style lang="scss">
</style>
