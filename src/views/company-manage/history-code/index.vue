<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="日期区间:">
                <el-date-picker
                  v-model="operationTimeRange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="安全码:">
                <el-select v-model="listQuery.codes" placeholder="请选择安全码" multiple>
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

            <!--查询操作按钮-->
            <el-col :md=" 8 || 24" :sm="24">
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

      <div class="code-list f">
        <div v-for="item in filterList" :key="item.codeId" class="code-item">
          <SafeCode :id="item.codeId" :text="item.safeImageUrl" :color="getCodeColor(item.safeScore)" :width="100" :height="100" />
          <div class="dateRange">
            2020/1/1-2020/5/5
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

// import { fetchList, createAccount, updateAccount } from '@/api/demo-page.js' fixme:替换为你的接口地址
import SafeCode from '@/components/SafeCode' // 分页
import { statusOption } from '@/options'

export default {
  name: 'HistoryCode',
  components: { SafeCode },
  filters: {
    stateFilter: function(state) {
      return statusOption.map[state]
    }
  },

  data() {
    return {
      list: [
        {
          codeId: '1',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '红色',
          safeScore: 20,
          vehicleOnline: '',
          createTime: '',
          state: 1
        },
        {
          codeId: '2',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '橙色',
          safeScore: 70,
          vehicleOnline: '',
          createTime: '',
          state: 1
        },
        {
          codeId: '3',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '绿色',
          safeScore: 100,
          vehicleOnline: '',
          createTime: '',
          state: 0
        },
        {
          codeId: '4',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '',
          safeScore: '',
          vehicleOnline: '',
          createTime: '',
          state: 0
        }, {
          codeId: '11',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '红色',
          safeScore: 20,
          vehicleOnline: '',
          createTime: '',
          state: 1
        },
        {
          codeId: '21',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '橙色',
          safeScore: 70,
          vehicleOnline: '',
          createTime: '',
          state: 1
        },
        {
          codeId: '31',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '绿色',
          safeScore: 100,
          vehicleOnline: '',
          createTime: '',
          state: 0
        },
        {
          codeId: '41',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '',
          safeScore: '',
          vehicleOnline: '',
          createTime: '',
          state: 0
        }, {
          codeId: '12',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '红色',
          safeScore: 20,
          vehicleOnline: '',
          createTime: '',
          state: 1
        },
        {
          codeId: '22',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '橙色',
          safeScore: 70,
          vehicleOnline: '',
          createTime: '',
          state: 1
        },
        {
          codeId: '32',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '绿色',
          safeScore: 100,
          vehicleOnline: '',
          createTime: '',
          state: 0
        },
        {
          codeId: '42',
          unitName: '',
          unitPlace: '',
          legalPerson: '',
          unitTel: '',
          unitCategory: '',
          safeImageUrl: '',
          safeScore: '',
          vehicleOnline: '',
          createTime: '',
          state: 0
        }
      ], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitPlace: '',
        codes: [],
        unitName: '',
        startAt: '',
        endAt: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        unitPlace: '',
        unitName: '',
        startAt: '',
        endAt: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      optionGroup: {
        codeList: [
          {
            label: '红码',
            value: '1',
            min: 0,
            max: 60,
            color: 'red'
          },
          {
            label: '黄码',
            value: '2',
            min: 61,
            max: 70,
            color: '#dec674'
          },
          {
            label: '绿码',
            value: '3',
            min: 71,
            max: 100,
            color: 'green'
          }
        ]
      }, // 存放选项的数据,
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
    },
    filterList() {
      return this.list.filter((item) => {
        return item.safeImageUrl !== ''
      })
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    // this.getList()
  },

  methods: {
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
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
  //::v-deep table .safe-code{
  //  position: absolute;
  //  left: 50%;
  //  top:50%;
  //  transform: translate(-50%,-50%);
  //  background: red;
  //}
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
