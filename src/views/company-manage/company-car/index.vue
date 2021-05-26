<template>
  <div class="layout-content company-car">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px">
          <el-row :gutter="48">
            <!--基本搜索条件-->
            <el-col :md="5" :sm="24" style="margin-top: -5px;">
              <el-input v-model="input" placeholder="请输入车牌号搜索" clearable size="small" />
            </el-col>
            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >

                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>

              </div>
            </el-col>

          </el-row>
        </el-form>
      </div>

      <!--表格-->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >

        <el-table-column
          label="编号"
          type="index"
          width="50"
          align="center"
        />
        <el-table-column label="车牌号" prop="vehiIdno" align="center" />
        <el-table-column label="企业名称" prop="unitName" align="center" width="180px" show-overflow-tooltip />
        <el-table-column v-slot="{row}" label="车牌类型" prop="plateType" align="center">

          <!--          {{ getCodeText(row.plateType) }}-->
          {{ row.plateType | statusFilter2 }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="车辆颜色" prop="vehiColor" align="center">
          {{ row.vehiColor||'-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="车辆类别" prop="vehicleType" show-overflow-tooltip align="center">
          {{ getCodeText(row.vehicleType) }}
        </el-table-column>
        <el-table-column label="限速值" prop="speedLimit" align="center" />
        <el-table-column v-slot="{row}" label="驾驶员1名字" prop="driverName" align="center">
          {{ row.driverName||'-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="驾驶员2名字" prop="driver2Name" align="center">
          {{ row.driver2Name||'-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="车辆状态" prop="status" align="center">
          <span :style="{color:row.status===0?'red':'green'}">
            {{ row.status | statusFilter }}
          </span>
        </el-table-column>
        <el-table-column label="行驶总里程公里" prop="totalMils" align="center" />
      </el-table>
      <!--分页-->
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>

import { fetchCar } from '@/api/company-manage/company-code'
import Pagination from '@/components/Pagination' // 分页
import { statusOption1, carCategare, carCategare1, statusOption2 } from '@/options'

export default {
  name: 'CompanyCode',
  components: { Pagination },
  filters: {
    statusFilter: function(status) {
      return statusOption1.map[status]
    },
    statusFilter2: function(status) {
      return statusOption2.map[status]
    }
  },
  data() {
    return {
      input: '',
      checkAll: false,
      list: [], // 表格数据
      multipleSelection: [],
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      // 存储新增和编辑框的数据
      optionGroup: {
        codeText: carCategare.list,
        codeText1: carCategare1.list
      } // 存放选项的数据
    }
  },
  computed: {
    unitId() {
      return this.$store.state.user.unitId
    }
  },
  created() {
    // this.listLoading = false// fixme:对好接口后移除这行代码
    this.getList()
  },

  methods: {
    // 获取车牌类型
    getCodeText(id) {
      const a = this.optionGroup.codeText.find(item => item.value === id)
      return a === undefined ? '未知' : a.label
    },
    // 获取车辆类型
    getCodeText1(id) {
      const a = this.optionGroup.codeText1.find(item => item.value === id)
      return a === undefined ? '未知' : a.label
    },
    // focusContent() {
    //   this.list = this.list.filter(item => item.markNum === this.input)
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchCar({ ...this.listQuery, unitId: this.unitId }).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.company-car ::v-deep{
  table .safe-code{
    position: absolute;
    left: 50%;
    top:50%;
    width: 40px;
    height: 40px;
    transform: translate(-50%,-50%);
  }
}
.code-list{
  flex-wrap: wrap;
  .code-item{
    width: 300px;
    flex-direction: column;
    align-items: center;
    >div{
      display: flex;
    }
    .safe-code{
      width: 200px;
      height: 200px;
    }
  }
}

</style>
