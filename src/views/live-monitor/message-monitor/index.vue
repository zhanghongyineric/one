<template>
  <div class="container">
    <div id="container" class="map" :style="styleSize" />
    <div class="left-box">
      <div class="static-box">
        <div class="statistics-num">
          <span class="number">16015</span>
          <span class="text">入网车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">15001</span>
          <span class="text">上线车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">5641</span>
          <span class="text">在线车辆</span>
        </div>
        <div class="statistics-num">
          <span class="number">8</span>
          <span class="text">报警车辆</span>
        </div>
      </div>
      <div class="divide" />
      <div style="padding-top: 20px;padding-bottom: 20px">
        <el-input size="small" placeholder="请输入车牌号码" />
      </div>
      <div style="margin-bottom: 10px">
        <el-checkbox v-model="allCheck">四川省</el-checkbox>
        <span class="check-text first-span">已选企业：313家</span>
        <span class="check-text second-span">已选车辆：6015辆</span>
      </div>
      <div class="company-list">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="{item, index} in 10" :key="index" :name="item">
            <template slot="title">
              <el-checkbox v-model="company" @change="handleCheck('1')">四川明亚智行有限公司</el-checkbox>
            </template>
            <el-checkbox-group v-model="checkList">
              <el-checkbox style="display:block;margin-left: 20px" label="川A12345 黄" />
              <el-checkbox style="display:block;margin-left: 20px" label="川A23456 黄" />
              <el-checkbox style="display:block;margin-left: 20px" label="川A34567 黄" />
            </el-checkbox-group>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        fit
        style="width: 100%;height:100%;"
      >
        <el-table-column type="index" />
        <el-table-column prop="number" label="车牌号" />
        <el-table-column prop="number" label="所属企业" />
        <el-table-column prop="number" label="车辆类型" />
        <el-table-column prop="number" label="是否双驾" />
        <el-table-column prop="number" label="定位时间" />
        <el-table-column prop="number" label="捡收时间" />
        <el-table-column prop="number" label="卫星速度" />
        <el-table-column prop="number" label="记录仪速度" />
        <el-table-column prop="number" label="限速" />
        <el-table-column prop="number" label="位置" />
        <el-table-column prop="number" label="状态" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageMonitor',
  data() {
    return {
      styleSize: {
        height: '',
        width: ''
      },
      map: '',
      allCheck: false,
      activeNames: [],
      company: false,
      checkList: [],
      tableData: []
    }
  },
  created() {
    // 事件监听，实时获取屏幕宽高
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  mounted() {
    this.getmap()
  },
  methods: {
    getHeight() {
      this.styleSize.height = window.innerHeight - 84 + 'px'
      this.styleSize.width = window.innerWidth + 'px'
    },
    getmap() {
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: [104.06632, 30.572903],
        zoom: 12,
        mapStyle: 'amap://styles/grey'
      })
      this.map.setFitView()
    },
    handleChange(val) {}
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.left-box {
  width: 350px;
  height: 100%;
  background-color: #1C2F41;
  position: absolute;
  left: 0;
  top: 0;
  padding-left: 10px;
  padding-right: 10px;

  .divide {
    height: 1px;
    width: 100%;
    background-color: #fff;
    transform:scaleY(0.5)
  }
}

::v-deep .amap-logo {
  display: none !important;
}

::v-deep .amap-copyright {
  display: none !important;
}

.static-box {
  width: 100%;
  height: 90px;
  padding: 10px 0 0 10px;

  div {
    display: inline-block;
  }
}

  .statistics-num {
    display: flex;
    flex-direction: column;
    margin: 8px;

    span {
      display: block;
      color: #ccc;
      text-align: center;
    }

    .number {
      font-size: 25px;
      margin-bottom: 3px;
    }

    .text {
      font-size: 12px;
    }
}

.check-text {
  font-size: 12px;
  color: #a9a9a9;
}

.first-span {
  margin-left: 60px;
}

.second-span {
  margin-left: 10px;
}

.company-list {
  padding-left: 20px;
  padding-right: 20px;
}

.company-list ::v-deep .el-checkbox__label {
  color: #ccc !important;
}

::v-deep .el-checkbox__label {
  color: #fff !important;
}

::v-deep .el-collapse-item__wrap {
  background-color: #1C2F41 !important;
  border: 0 !important;
}

::v-deep .el-collapse-item__header {
  background-color: #1C2F41 !important;
}

::v-deep .el-collapse-item__arrow {
  color: #fff;
}

::v-deep .el-collapse {
  border: 0 !important;
}

::v-deep .el-collapse-item__header {
  border: 0 !important;
}

.table-box {
  width: calc(100% - 350px);
  height: 200px;
  position: absolute;
  bottom: 0;
  right: 0;
}

</style>
