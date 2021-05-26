<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <!--
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            &lt;!&ndash;基本搜索条件&ndash;&gt;
            <el-col :md="8" :sm="24">
              <el-form-item label="违规程度:">
                <el-select v-model="listQuery.level" placeholder="请选择违规程度" multiple>
                  <el-option
                    v-for="{label,value} in optionGroup.violationList"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="号码:">
                <el-input v-model="listQuery.number" placeholder="请输入身份证号或者手机号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            &lt;!&ndash;<el-col :md="8" :sm="24">&ndash;&gt;
            &lt;!&ndash;  <el-form-item label="日期区间:">&ndash;&gt;
            &lt;!&ndash;    <el-date-picker&ndash;&gt;
            &lt;!&ndash;      v-model="operationTimeRange"&ndash;&gt;
            &lt;!&ndash;      type="daterange"&ndash;&gt;
            &lt;!&ndash;      align="right"&ndash;&gt;
            &lt;!&ndash;      unlink-panels&ndash;&gt;
            &lt;!&ndash;      range-separator="至"&ndash;&gt;
            &lt;!&ndash;      start-placeholder="开始日期"&ndash;&gt;
            &lt;!&ndash;      end-placeholder="结束日期"&ndash;&gt;
            &lt;!&ndash;      :picker-options="pickerOptions"&ndash;&gt;
            &lt;!&ndash;    />&ndash;&gt;
            &lt;!&ndash;  </el-form-item>&ndash;&gt;
            &lt;!&ndash;</el-col>&ndash;&gt;
            &lt;!&ndash;高级搜索条件&ndash;&gt;
            <template v-if="advanced" />

            &lt;!&ndash;查询操作按钮&ndash;&gt;
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                &lt;!&ndash;<el-button type="text" @click="advanced=!advanced">&ndash;&gt;
                &lt;!&ndash;  {{ advanced ? '收起' : '展开' }}&ndash;&gt;
                &lt;!&ndash;  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />&ndash;&gt;
                &lt;!&ndash;</el-button>&ndash;&gt;
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      -->

      <!--表格-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="身份证号" prop="idCard" width="170" />
        <el-table-column label="电话" prop="driverTel" />
        <el-table-column label="所属企业" prop="unitName" />
        <el-table-column label="资格证" prop="category" />
        <el-table-column label="驾驶车辆" prop="plateInfo" />
        <el-table-column label="违章程度" prop="ruleName" />
        <el-table-column label="违规内容" prop="armName" width="200" show-overflow-tooltip />
        <el-table-column label="加减分值" prop="score" />
        <!--<el-table-column label="违规地点" prop="statusStart" />-->
        <el-table-column v-slot="{row}" label="违规开始时间" prop="armTimeStart" width="180">
          {{ row.armTimeStart| dateFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="违规结束时间" prop="armTimeStart" width="180">
          {{ row.armTimeEnd| dateFilter }}
        </el-table-column>
        <!--<el-table-column label="扣分时间" prop="vehicleOnline" />-->
        <!--<el-table-column v-slot="{row}" label="状态" prop="state">-->
        <!--  <span :style="{color: row.state===1?'green':'red'}">{{ row.state | stateFilter }}</span>-->
        <!--</el-table-column>-->

        <!--&lt;!&ndash;表格操作列&ndash;&gt;-->
        <!--<el-table-column-->
        <!--  v-if="checkPermission('edit')"-->
        <!--  label="操作"-->
        <!--  align="center"-->
        <!--  width="200"-->
        <!--  class-name="small-padding fixed-width"-->
        <!--&gt;-->
        <!--  <template v-slot="{row}">-->
        <!--    <el-button type="primary" size="mini" @click="showEvidence(row.codeId)">-->
        <!--      证据-->
        <!--    </el-button>-->
        <!--    &lt;!&ndash;<el-button type="primary" size="mini" @click="handleTableCustom(row)">&ndash;&gt;-->
        <!--    &lt;!&ndash;  历史安全码&ndash;&gt;-->
        <!--    &lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--    <el-button type="primary" size="mini" :disabled="row.state === 1" @click="handleTableCustom(row)">-->
        <!--      复核确认-->
        <!--    </el-button>-->
        <!--  </template>-->
        <!--</el-table-column>-->

      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--&lt;!&ndash;弹窗&ndash;&gt;-->
      <!--<el-dialog-->
      <!--  title="证据"-->
      <!--  :visible.sync="dialogFormVisible"-->
      <!--  :close-on-click-modal="false"-->
      <!--  custom-class="base-dialog dialog-col-1"-->
      <!--&gt;-->
      <!--  <div class="list">-->
      <!--    <div class="listItem">-->
      <!--      <span class="label">编号:</span>-->
      <!--      <span class="content">421</span>-->
      <!--    </div>-->
      <!--    <div class="listItem">-->
      <!--      <span class="label">违规起始地点:</span>-->
      <!--      <span class="content">东坡北二路</span>-->
      <!--    </div>-->
      <!--  </div>-->
      <!--</el-dialog>-->
    </el-card>
  </div>
</template>

<script>

import { fetchViolation } from '@/api/company-manage/driver-code'
import Pagination from '@/components/Pagination' // 分页
import { violationOption, violationStatusOption } from '@/options'
import { checkPermission } from '@/utils/check-permission'
import { parseTime } from '@/utils'

export default {
  name: 'DriverViolation',
  components: { Pagination },
  filters: {
    stateFilter: function(state) {
      return violationStatusOption.map[state]
    },
    dateFilter: function(date) {
      return parseTime(new Date(date))
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['driverId'],
  data() {
    return {
      list: [], // 表格数据
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
      optionGroup: {
        unitPlaceList: [
          {
            label: '条件1',
            value: '1'
          },
          {
            label: '条件2',
            value: '0'
          }
        ],
        violationList: violationOption.list
      }, // 存放选项的数据
      dialogFormVisible: true,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }

    }
  },
  computed: {
    operationTimeRange: {
      get: function() {
        return [this.listQuery.startAt, this.listQuery.endAt]
      },
      set: function(newValues) {
        if (newValues) {
          this.listQuery.startAt = newValues[0]
          this.listQuery.endAt = newValues[1]
        } else {
          this.listQuery.startAt = ''
          this.listQuery.endAt = ''
        }
      }
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    this.getList()
  },

  methods: {
    // 查看证据
    showEvidence(id) {
      console.log(id)
    },
    handleDetailClick(id) {
      this.$router.push({
        name: 'DriverDetail',
        params: { id }
      })
    },
    checkPermission,
    // 获取颜色
    getCodeColor(score) {
      for (let i = 0, len = this.optionGroup.codeList.length; i < len; i++) {
        const item = this.optionGroup.codeList[i]
        if (score <= item.max) {
          return item.color
        }
      }
      console.log('未被捕获的分数')
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchViolation({ ...this.listQuery, driverId: this.driverId }).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 自定义表格方法
    handleTableCustom() {

    },
    // 状态切换
    handleToggle(row, index) {
      toggleApi(row.id).then(() => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
::v-deep table .safe-code {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
}

.list {
  .listItem {
    display: flex;
    font-size: 18px;
    margin-bottom: 10px;

    .label {
      width: 150px;
      text-align: right;
      margin-right: 5px;
    }

    .content {
      flex: 1;
    }
  }
}
</style>
