<!--
  - FileName: 规则划分
  - @author: ZhouJiaXing
  - @date: 2021/4/26 上午10:39
  -->

<template>
  <div class="layout-content divide-rule">
    <el-card class="box-card">
      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :lg="8" :md="12" :sm="12" :xs="12">
              <el-form-item label="监测中心:">
                <el-select v-model="listQuery.monitorId" placeholder="请选择监测中心" @change="handleAreaChange">
                  <el-option
                    v-for="item in monitorList"
                    :key="item.id"
                    :label="item.companyName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" :sm="12" :xs="12">
              <el-form-item label="违章程度:">
                <el-select v-model="listQuery.ruleType" @change="getDividedList">
                  <el-option
                    v-for="item in optionList.violation"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="divide f jc-sa ai-c">
        <el-card class="rule-card f-1">
          <div slot="header" class="f jc-sb">
            <span>{{ ruleTitle }}已分配规则</span>
            <div class="search">
              <span>关键字：</span>
              <el-input
                v-model="dividedListQuery.keyword"
                placeholder="请输入关键字"
                size="small"
                style="margin-right: 10px;"
                clearable
                @keyup.enter.native="getDividedList"
              />
              <el-button type="primary" size="small" @click="getDividedList">查询</el-button>
            </div>
          </div>
          <div class="card-content f fd-c jc-sb">
            <el-table
              v-loading="dividedLoading"
              class="main-table"
              :data="dividedTableList"
              style="width: 100%;"
              border
              fit
              highlight-current-row
              @selection-change="handleDividedChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column prop="ruleName" type="index" label="编号" width="55" />
              <el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip />
            </el-table>
          </div>
        </el-card>
        <el-button-group style="padding-left: 15px;padding-right: 15px;">
          <el-button type="primary" icon="el-icon-arrow-left" @click="bindRules">移入</el-button>
          <el-button type="primary" @click="unbindRules">移出<i class="el-icon-arrow-right el-icon--right" /></el-button>
        </el-button-group>
        <el-card class="rule-card f-1">
          <div slot="header" class="f jc-sb">
            <span>未分配规则</span>
            <div class="search">
              <span>关键字：</span>
              <el-input
                v-model="unDividedListQuery.keyword"
                placeholder="请输入关键字"
                size="small"
                style="margin-right: 10px;"
                clearable
                @keyup.enter.native="getUnDividedList"
              />
              <el-button type="primary" size="small" @click="getUnDividedList">查询</el-button>
            </div>
          </div>
          <div class="card-content f fd-c jc-sb">
            <el-table
              v-loading="unDividedLoading"
              class="main-table"
              :data="unDividedTableList"
              style="width: 100%;"
              border
              fit
              highlight-current-row
              @selection-change="handleUnDividedChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column prop="ruleName" type="index" label="编号" width="55" />
              <el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip />
            </el-table>
          </div>
        </el-card>

      </div>
    </el-card>
  </div>
</template>

<script>
import { getUnDividedList, getDividedList, bindRule, unBindRule, getMonitorList } from '@/api/safe-code/divide-rule'

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'Level',
  data() {
    return {
      dividedLoading: false,
      unDividedLoading: false,
      dividedSelections: [],
      unDividedSelections: [],
      dividedTableList: [], // 已分配数据
      unDividedTableList: [], // 未分配数据
      monitorList: [], // 监测中心列表
      dividedTotal: 0,
      unDividedTotal: 0,
      dividedListQuery: {
        keyword: ''
      },
      unDividedListQuery: {
        keyword: ''
      },
      listLoading: false,
      listQuery: {
        monitorId: '',
        monitorName: '',
        ruleType: '0'
      },
      optionList: {
        violation: onlineOption.violation_type.list
      }
    }
  },
  computed: {
    ruleTitle() {
      return onlineOption.violation_type.map[this.listQuery.ruleType]
    }
  },
  created() {
    getMonitorList().then(res => {
      this.monitorList = res.data || []
    }).catch(e => {

    })
  },
  mounted() {
  },
  methods: {
    // 绑定规则
    bindRules() {
      const ruleCodeList = this.unDividedSelections.map(item => {
        return item.ruleCode
      })

      if (ruleCodeList.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择未分配规则'
        })
        return
      }

      this.dividedLoading = true
      this.unDividedLoading = true

      bindRule({
        ...this.listQuery,
        ruleCodeList
      }).then(res => {
        this.unDividedSelections = []
        this.$notify({
          title: '成功',
          message: '绑定成功',
          type: 'success',
          duration: 2000
        })
        this.getDividedList()
        this.getUnDividedList()
      }).catch(e => {
        this.dividedLoading = false
        this.unDividedLoading = false
      })
    },
    // 解绑规则
    unbindRules() {
      const matchIds = this.dividedSelections.map(item => {
        return item.matchId
      })

      if (matchIds.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择已分配规则'
        })
        return
      }

      this.dividedLoading = true
      this.unDividedLoading = true

      unBindRule({
        matchIds
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '解绑成功',
          type: 'success',
          duration: 2000
        })
        this.unDividedSelections = []
        this.getDividedList()
        this.getUnDividedList()
      }).catch(e => {
        this.dividedLoading = false
        this.unDividedLoading = false
      })
    },
    // 已分配选择处理
    handleDividedChange(val) {
      this.dividedSelections = val
    },
    // 未分配选择处理
    handleUnDividedChange(val) {
      this.unDividedSelections = val
    },

    // 获取已分配规则列表
    getDividedList() {
      if (!this.listQuery.monitorId) {
        this.$message({
          type: 'error',
          message: '请先选择监测中心'
        })
        return
      }

      this.dividedLoading = true

      getDividedList({
        ...this.listQuery,
        keyword: this.dividedListQuery.keyword
      }).then(({ data }) => {
        this.dividedTableList = data
        this.dividedLoading = false
      }).catch(e => {
        console.log(e)
        this.dividedLoading = false
      })
    },
    // 获取未分配规则列表
    getUnDividedList() {
      if (!this.listQuery.monitorId) {
        this.$message({
          type: 'error',
          message: '请先选择监测中心'
        })
        return
      }

      this.unDividedLoading = true

      getUnDividedList({
        ...this.listQuery,
        keyword: this.unDividedListQuery.keyword
      }).then(({ data }) => {
        this.unDividedTableList = data
        this.unDividedLoading = false
      }).catch(e => {
        this.unDividedLoading = false
        console.log(e)
      })
    },
    // 重置页面搜索数据
    resetAllParams() {
      this.listQuery.ruleType = '0'
      this.dividedListQuery.keyword = ''
      this.unDividedListQuery.keyword = ''
      this.dividedTableList = []
      this.unDividedTableList = []
    },
    // 区域改变
    handleAreaChange(id) {
      this.listQuery.monitorName = this.monitorList.find(item => {
        return item.id === id
      }).companyName
      this.resetAllParams()
      this.$nextTick(() => {
        // 区域代码不为空再获取已分配列表
        if (!this.listQuery.monitorId) {
          this.dividedTableList = []
          this.unDividedTableList = []
          return
        }
        this.getDividedList()
        this.getUnDividedList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.divide-rule {
  overflow: auto;
  height: 800px;

  > .box-card {
    height: 100%;
    min-width: 1400px;

    .divide {
      ::v-deep .el-card__body {
        padding: 0 !important;
      }

      .search {
        margin-top: -6px;
        display: flex;
        align-items: center;

        span {
          width: 120px;
        }
      }

      .card-content {
        height: 650px;

        .el-table {
          border: none;
          overflow: auto !important;
          border-bottom: 1px solid #EBEEF5;

          &::before {
            height: 0;
          }
        }
      }

    }

  }

  .pagination-container {
    //padding-bottom: 0;
  }
}

</style>

