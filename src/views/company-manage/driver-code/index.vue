<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="安全码:">
                <el-select v-model="listQuery.colorId" placeholder="请选择安全码">
                  <el-option
                    v-for="{label,value,color} in optionGroup.codeList"
                    :key="value"
                    :label="label"
                    :value="value"
                    :style="{color:color}"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="号码:">
                <el-input v-model="listQuery.keyWord" placeholder="请输入身份证号或者手机号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--表格-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="编号"
          type="index"
          width="50"
          align="left"
        />
        <el-table-column label="姓名" prop="driverName" min-width="80" />
        <el-table-column label="身份证号" prop="idCard" min-width="170" />
        <el-table-column label="电话" prop="driverTel" min-width="110" />
        <el-table-column v-slot="{row}" label="当前安全码" prop="safeLevelId" width="100">
          <template>
            <!--暂时使用图片替换真实二维码-->
            <svg-icon
              v-if="row.safeLevelId"
              class="safe-code"
              icon-class="code"
              :style="{color: getCodeColor(row.safeLevelId)}"
            />
            <!--<SafeCode v-if="row.safeImageUrl" :id="row.codeId" :text="row.safeImageUrl" :color="getCodeColor(row.safeScore)" />-->
            <span v-else>暂无安全码</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分值"
          prop="safeScore"
          min-width="80"
          show-overflow-tooltip
        />
        <el-table-column
          label="资格类别"
          prop="category"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          label="上岗企业"
          prop="unitName"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="redNum"
          label="历史红码次数"
          min-width="110"
        />
        <el-table-column
          prop="yellowNum"
          label="历史黄码次数"
          min-width="110"
        />
        <el-table-column
          prop="blueNum"
          label="历史蓝码次数"
          min-width="110"
        />
        <el-table-column
          prop="greenNum"
          label="历史绿码次数"
          min-width="110"
        />
        <el-table-column
          prop="tel"
          label="操作"
          min-width="110"
          align="center"
        >
          <template>
            <el-button
              type="primary"
              size="small"
            >扣分记录</el-button>
          </template>
        </el-table-column>
        <!--<el-table-column label="评估周期" v-slot="{row}" >-->
        <!--  {{row.startTime}}-{{row.endTime}}-->
        <!--</el-table-column>-->
        <!-- <el-table-column label="连续未扣分天数" prop="days" /> -->

        <!--表格操作列-->
        <!-- <el-table-column
          label="操作"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleDetailClick(row.driverId)">
              详情
            </el-button>
            <el-button type="primary" size="mini" @click="handleHistory(row.driverId)">
              违规记录
            </el-button>
          </template>
        </el-table-column> -->

      </el-table>
      <!--分页-->
      <pagination
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

import { fetchList } from '@/api/company-manage/driver-code'
import Pagination from '@/components/Pagination' // 分页
import { statusOption, colorOption } from '@/options'
import { checkPermission } from '@/utils/check-permission'
import company from '@/router/modules/company'

export default {
  name: 'CompanyCode',
  components: { Pagination },
  filters: {
    stateFilter: function(state) {
      return statusOption.map[state]
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['companyId', 'codeId'],
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        colorId: '',
        keyWord: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        colorId: [],
        keyWord: ''
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
        codeList: colorOption.list
      }, // 存放选项的数据
      createFormData: {
        unitName: '',
        unitPlace: '',
        legalPerson: '',
        unitTel: '',
        unitCategory: '',
        safeImageUrl: '',
        safeScore: '',
        vehicleOnline: '',
        createTime: '',
        state: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        unitName: '',
        unitPlace: '',
        legalPerson: '',
        unitTel: '',
        unitCategory: '',
        safeImageUrl: '',
        safeScore: '',
        vehicleOnline: '',
        createTime: '',
        state: ''
      }, // 用于重置新增的数据
      rules: {}, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: '',
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
    const codeId = parseInt(this.codeId)
    codeId === 0 ? this.listQuery.colorId = '' : this.listQuery.colorId = codeId
    this.getList()
  },

  methods: {
    // 查看司机统计详情
    handleDetailClick(id) {
      this.$router.push({
        name: 'DriverDetail',
        params: { driverId: id }
      })
    },
    // 查看司机违规记录
    handleHistory(id) {
      this.$router.push({
        name: 'DriverViolation',
        params: { driverId: id }
      })
    },
    checkPermission,
    // 获取颜色
    getCodeColor(id) {
      return this.optionGroup.codeList.find(item => item.value === id).color
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(
        {
          ...this.listQuery,
          colorId: this.listQuery.colorId,
          unitId: this.companyId
        }).then(response => {
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

    }
    // 状态切换
    // handleToggle(row, index) {
    //   toggleApi(row.id).then(() => {
    //     this.dialogFormVisible = false
    //     this.getList()
    //     this.$notify({
    //       title: '成功',
    //       message: '操作成功',
    //       type: 'success',
    //       duration: 2000
    //     })
    //   }).catch((e) => {
    //     console.log(e)
    //   })
    // }
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

</style>
