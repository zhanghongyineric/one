<template>
  <!--地图选点弹窗-->
  <!--调用时传入对象包含的address、longitude、latitude-->
  <!--选点成功后会将修改了address、longitude、latitude的对象传回-->
  <!--pickLocation为true时显示-->
  <!--在choosePoint事件中接受数据-->
  <!--如果对象中字段与传回的数据字段名称不一致，需要手动修改-->
  <!--使用方法-->
  <!--<Map-->
  <!--  :infos="infos"-->
  <!--  :pickLocation="pickLocation"-->
  <!--  @closeMap="pickLocation = false"-->
  <!--  @choosePoint="choosePoint"-->
  <!--/>-->
  <el-dialog
    fullscreen
    title="选择地址"
    :visible.sync="showMap"
    append-to-body
    class="pick-location"
  >
    <ChoosePointMap
      :infos="infos"
      @closeMap="closeMap"
      @choosePoint="choosePoint"
    />
    <span class="close el-icon-close" @click="closeMap" />
  </el-dialog>
</template>

<script>
import ChoosePointMap from './choosePointMap'
export default {
  name: 'ChoosePoint',
  components: { ChoosePointMap },
  props: {
    pickLocation: {
      type: Boolean,
      default: false
    },
    infos: {
      type: Object
    }
  },
  data() {
    return {
      showMap: false
    }
  },
  watch: {
    pickLocation: function(val) {
      this.showMap = val
    }
  },
  methods: {
    closeMap() {
      this.showMap = false
      this.$emit('closeMap')
    },
    choosePoint(infos) {
      this.$emit('choosePoint', infos)
    }
  }
}
</script>

<style scoped lang="scss">
.pick-location {
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 26px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
  }

  ::v-deep.el-dialog {

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 0;
    }

  }
}
</style>
