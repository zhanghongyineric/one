<template>
  <div class="single-bar">
    <!--<el-progress :percentage="add" :format="format" />-->
    <div class="progress-con">
      <div class="progress" :style="{borderColor: color}">
        <div class="progress-bar" :style="{width, backgroundColor: color}" />
      </div>
      <div class="progress-text-inside">{{ information.value }}个</div>
    </div>
    <div :class="['num', isUp ? 'red' : 'green']">
      <span v-if="isUp" class="el-icon-top" />
      <span v-if="!isUp" class="el-icon-bottom" />
      {{ add }}个
    </div>
    <div class="progress-text">环比{{ isUp ? '上升' : '下降' }}{{ info.progress }}%</div>
    <span class="detail" @click="toWhite">详情<i class="el-icon-arrow-right" /></span>
  </div>
</template>

<script>
export default {
  name: 'SingleBar',
  props: {
    // color: {
    //   type: String,
    //   default: '#409EFF'
    // },
    information: {
      type: Object,
      default() {
        return {}
      }
    },
    maxCode: {
      type: Number
    }
  },
  data() {
    return {
      add: 15,
      isUp: true,
      width: 0,
      color: 'rgba(66, 185, 131, 1)',
      colors: {
        红码: 'rgba(66, 185, 131, 1)',
        绿码: 'rgba(66, 185, 131, 1)',
        蓝码: 'rgba(64, 158, 255, 1)',
        黄码: 'rgba(230, 162, 60, 1)'
      },
      info: {
        num: 15,
        add: -5,
        progress: 5,
        totalProgress: 60
      }
    }
  },
  watch: {
    maxCode(val) {
      this.parseInfo(this.information, val)
    },
    information(val) {
      this.parseInfo(val, this.maxCode)
    }
  },
  created() {
    this.parseInfo(this.information, this.maxCode)
  },
  methods: {
    format() {
      return `${this.num}个`
    },
    toWhite() {
      this.$message({
        message: '功能开发中，敬请期待',
        type: 'warning'
      })
    },
    parseInfo(info, max) {
      max = max || 1
      this.width = info.value / max * 100 + '%'
      this.color = this.colors[info.name]
      const add = this.info.add
      if (add >= 0) {
        this.add = add
        this.isUp = true
      } else {
        this.add = -add
        this.isUp = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.single-bar {
  display: flex;
  font-size: 14.4px;
  margin: 10px 0;
  .progress-con {
    flex: 1;
    display: flex;
    margin-right: 8px;
    .progress {
      flex: 1;
      height: 10px;
      margin-top: 2px;
      margin-right: 5px;
      border-width: 1px;
      border-style: solid;
      .progress-bar {
        height: 100%;
        background-color: #fff;
        opacity: 0.5;
      }
    }
  }
  .num {
    width: 60px;
    &.green {
      color: green;
    }
    &.red {
      color: red;
    }
  }
  .progress-text {
    width: 100px;
  }
  .detail {
    color: #409EFF;
    cursor: pointer;
  }
}
</style>
