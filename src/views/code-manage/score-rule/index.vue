<template>
  <div class="layout-content score-rule">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="违章程度:">
                <el-select
                  v-model="listQuery.ruleTypeId"
                  placeholder="请选择违章程度"
                >
                  <el-option label="全部" value="" />
                  <el-option
                    v-for="{label,value} in optionGroup.violationList"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--查询操作按钮-->
            <el-col :md="16" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style=" { float: 'right', overflow: 'hidden' }"
              >
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="primary" size="small" @click="handleSearch">分配规则</el-button>

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
          width="100"
          align="left"
        />
        <el-table-column v-slot="{row}" label="违章程度" prop="ruleTypeId">
          {{ row.ruleTypeId | violationFilter }}
        </el-table-column>
        <el-table-column label="规则名称" prop="armName" min-width="250px" show-overflow-tooltip />
        <el-table-column label="规则描述" prop="ruleDesc" min-width="250px" show-overflow-tooltip />
        <el-table-column label="违章扣分" prop="score" />
        <el-table-column v-slot="{row}" label="创建日期" prop="createTime" min-width="160px">
          {{ row.createTime| dateFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" fixed="right" label="状态" prop="status">
          <span :style="{color:row.status===0?'#F56C6C':'#67C23A'}">
            {{ row.status | statusFilter }}
          </span>
        </el-table-column>

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="170" class-name="small-padding fixed-width" fixed="right">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              style="margin-left:10px;margin-right:10px;"
              @confirm="handleDelete(row)"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--编辑新增共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class="base-dialog dialog-col-1"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="140px"
        >
          <el-row>
            <el-form-item label="行政区域:" prop="areaCode">
              <AreaSelect v-model="createFormData.areaCode" size="large" />
            </el-form-item>
            <el-col :span="24">
              <el-form-item label="违章程度:" prop="ruleTypeId">
                <el-select
                  v-model="createFormData.ruleTypeId"
                  placeholder="请选择违章程度"
                >
                  <el-option
                    v-for="{label,value} in optionGroup.violationList"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="违章名称:" prop="armName">
                <RemoteSearch
                  v-model="createFormData.armName"
                  :disabled="dialogStatus === 'update'"
                  :api-method="searchType"
                  label="类型"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="违章描述:" prop="ruleDesc">
                <el-input
                  v-model="createFormData.ruleDesc"
                  type="textarea"
                  placeholder="请输入违章描述"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="违章扣分:" prop="score">
                <el-input
                  v-model="createFormData.score"
                >
                  <template slot="append">分</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="生效次数:" prop="effectTimes">
                <el-input
                  v-model="createFormData.effectTimes"
                >
                  <template slot="append">次</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" :loading="buttonLoading" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import { fetchList, fetchType, addRule, updateRule, deleteRule, toggleStatus } from '@/api/safe-code/score-rule'
import AreaSelect from '@/components/AreaSelect'
import Pagination from '@/components/Pagination' // 分页
import RemoteSearch from '../../../components/RemoteSearch/select'
import { statusOption, violationOption, violationTypeOption } from '@/options'
import { parseTime } from '@/utils'

export default {
  name: 'ScoreRule',
  components: { Pagination, RemoteSearch, AreaSelect },
  filters: {
    statusFilter: function(status) {
      return statusOption.map[status]
    },
    violationFilter: function(violation) {
      return violationOption.map[violation]
    },
    dateFilter: function(date) {
      return parseTime(new Date(date))
    }
  },
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        ruleTypeId: '', // 规则类别
        armName: ''// 违章类型
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        ruleTypeId: '', // 规则类别
        armName: ''// 违章类型
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        statusList: statusOption.list,
        violationTypeList: violationTypeOption.list,
        violationList: violationOption.list
      }, // 存放选项的数据
      createFormData: {
        ruleTypeId: 0,
        armName: '',
        ruleDesc: '',
        score: '',
        effectTimes: '',
        areaCode: ['510000', '510100', '']
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        ruleTypeId: 0,
        armName: '',
        ruleDesc: '',
        score: '',
        effectTimes: '',
        areaCode: ['510000', '510100', '']
      }, // 用于重置新增的数据
      rules: {
        armName: [{ required: true, message: '请选择规则类型', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        score: [{ required: true, message: '请输入分值', trigger: 'blur' }],
        effectTimes: [{ required: true, message: '请输入几次后生效', trigger: 'blur' }]
      }, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    this.getList()
  },

  methods: {
    // 查询违章类型
    searchType(query) {
      return fetchType(query)
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
    // 点击新增按钮
    handleCreate() {
      this.resetCreateFormData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          addRule(this.createFormData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },

    // 点击编辑
    handleUpdate(row) {
      this.createFormData = { ...row }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const tempData = { ...this.createFormData }
          updateRule(tempData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },
    // 删除数据
    handleDelete(row) {
      this.listLoading = true
      deleteRule({ ruleId: row.ruleId }).then(() => {
        this.dialogFormVisible = false
        this.listLoading = false
        if (this.list.length === 1 && this.listQuery.pageNumber !== 1) {
          this.listQuery.pageNumber--
        }
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        this.listLoading = false
        console.log(e)
      })
    },
    // 状态切换
    handleToggle(row, index) {
      toggleStatus({ ruleId: row.ruleId }).then(() => {
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

</style>
