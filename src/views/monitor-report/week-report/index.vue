<!--周报管理-->
<template>
  <div class="layout-content history-code">
    <el-card class="box-card">
      <!--搜索栏-->
      <header class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :xs="24" :sm="12" :md="6">
              <el-form-item label="选择平台:">
                <ChoosePlatform v-model="listQuery.platform"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-form-item label="统计周期:">
                <el-date-picker
                  v-model="listQuery.period"
                  type="week"
                  format="yyyy 第 WW 周"
                  placeholder="选择周"
                  :picker-options="{firstDayOfWeek:1}"
                />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :xs="12" :sm="12" :md="6">
              <div
                class="table-page-search-submitButtons"
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>

              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6">
              <el-button type="primary" size="small" plain class="to-report-manage"
                         @click="$router.push({name:'ReportManage',params:{type:'week'}})"
              >
                周报管理
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </header>

      <main class="main">
        <div v-show="!listQuery.platform" class="choose-platform"><i class="el-icon-warning"/>请先选择平台</div>

        <el-row v-show="listQuery.platform" :gutter="10">
          <el-col :span="12">
            <RegionVehicle ref="regionVehicle" :data="regionVehicleData" :loading="listLoading"/>
          </el-col>
        </el-row>
      </main>
    </el-card>
  </div>
</template>

<script>

import ChoosePlatform from '@/components/ChoosePlatform'
import RegionVehicle from '@/views/monitor-report/components/RegionVehicle'

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
export default {
  name: 'WeekReport',
  components: { RegionVehicle, ChoosePlatform },
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      // 查询条件
      listQuery: {
        platform: -999, // 平台
        period: new Date() // 统计周期
      },
      // 用于重置查询条件
      listQueryTemp: {
        platform: null, // 平台
        period: new Date() // 统计周期
      },
      regionVehicleData: []
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 点击搜索
    handleSearch() {
      console.log(this.listQuery.period.getW)
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      setTimeout(_ => {
        this.listLoading = false
        this.regionVehicleData = [
          {
            name: '巴中',
            a: 210,
            b: 421,
            c: 972,
            d: 342
          },
          {
            name: '巴中1',
            a: 130,
            b: 121,
            c: 142,
            d: 143
          },
          {
            name: '巴中2',
            a: 120,
            b: 321,
            c: 252,
            d: 123
          },
          {
            name: '巴中3',
            a: 130,
            b: 381,
            c: 342,
            d: 833
          },
          {
            name: '巴中4',
            a: 340,
            b: 441,
            c: 842,
            d: 143
          },
        ]
      }, 0)
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

.to-report-manage {
  float: right;
}

.main {
  .choose-platform {
    line-height: 150px;
    text-align: center;
  }

  ::v-deep .el-card__header {
    padding: 10px;
  }
}
</style>
