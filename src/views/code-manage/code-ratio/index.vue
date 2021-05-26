<!--
  - FileName: 企业安全码规则
  - @author: ZhouJiaXing
  - @date: 2021/4/9 下午3:52
  -->

<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <!--<div class="table-page-search-wrapper">-->
      <!--  <el-form :model="listQuery" label-width="80px" size="small">-->
      <!--    <el-row :gutter="48">-->
      <!--      <el-col :md="24" :sm="24">-->
      <!--        <div-->
      <!--          class="table-page-search-submitButtons"-->
      <!--          style="float: right"-->
      <!--        >-->
      <!--          <el-button type="primary" size="small" @click="handleCreate">新增比例</el-button>-->

      <!--        </div>-->
      <!--      </el-col>-->
      <!--    </el-row>-->
      <!--  </el-form>-->
      <!--</div>-->

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
          align="center"
        />
        <el-table-column label="安全码名称" prop="levelName" align="center" />
        <el-table-column v-slot="{row}" label="安全码权重比例" prop="codeWeight" align="center">
          {{ row.codeWeight }}%
        </el-table-column>
        <el-table-column label="权重描述" prop="weightDescription" align="center" show-overflow-tooltip min-width="360px" />
        <!--<el-table-column v-slot="{row}" fixed="right" label="状态" prop="status" align="center">-->
        <!--  <span :style="{color:row.status===0?'red':'green'}">-->
        <!--    {{ row.status | statusFilter }}-->
        <!--  </span>-->
        <!--</el-table-column>-->

        <!--表格操作列-->
        <el-table-column fixed="right" label="操作" align="center" width="90" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              修改
            </el-button>
            <!--<el-popconfirm-->
            <!--  title="确认删除吗？"-->
            <!--  style="margin-left:10px;margin-right:10px;"-->
            <!--  @confirm="handleDelete(row)"-->
            <!--&gt;-->
            <!--  <el-button slot="reference" size="mini" type="danger">-->
            <!--    删除-->
            <!--  </el-button>-->
            <!--</el-popconfirm>-->
            <!--<el-button-->
            <!--  v-if="row.status === 1"-->
            <!--  size="mini"-->
            <!--  type="warning"-->
            <!--  @click="handleToggle(row, false)"-->
            <!--&gt;-->
            <!--  停用-->
            <!--</el-button>-->
            <!--<el-button v-else size="mini" type="success" @click="handleToggle(row, true)">-->
            <!--  启用-->
            <!--</el-button>-->
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <Pagination
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit="listQuery.pageSize"
        @pagination="getList"
      />
      <!--新增共用弹窗-->
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
          label-width="150px"
        >
          <el-form-item label="安全码名称:" prop="levelName">
            <el-input
              v-model="createFormData.levelName"
              placeholder="请输入安全码名称"
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item label="安全码权重比例:" prop="codeWeight">
            <el-input v-model.number="createFormData.codeWeight" placeholder="请输入安全码占比权重">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="权重描述:" prop="weightDescription">
            <el-input
              v-model="createFormData.weightDescription"
              type="textarea"
              placeholder="请输入权重描述"
              auto-complete="off"
            />
          </el-form-item>
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

import { fetchSafeCodeRatio, fetchCreate, fetchRevise, fetchDelete, fetchChange } from '@/api/company-manage/company-code'
import Pagination from '@/components/Pagination' // 分页
import { statusOption } from '@/options'

export default {
  name: 'CodeRatio', // 安全码比例
  components: { Pagination },
  filters: {
    statusFilter: function(status) {
      return statusOption.map[status]
    }
  },
  data() {
    const validatePasswords = (rule, value, callback) => {
      if (value <= 0 || value >= 100) {
        callback(new Error('请输入大于0小于100的数字'))
      } else {
        callback()
      }
    }
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitName: '',
        unitTel: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        unitName: '',
        unitTel: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        statusList: statusOption.list
      }, // 存放选项的数据
      createFormData: {
        levelName: '',
        codeWeight: '',
        weightDescription: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        value: '',
        codeWeight: '',
        weightDescription: ''
      }, // 用于重置新增的数据
      rules: {
        levelName: [{ required: true, message: '请输入安全码名称', trigger: 'blur' }],
        codeWeight: [{ required: true, trigger: 'blur', validator: validatePasswords }, { type: 'number', message: '安全码权重比例必须为数字' }],
        weightDescription: [{ required: true, message: '请输入权重描述', trigger: 'blur' }]
      }, // 新增和编辑框的规则
      textMap: {
        update: '修改',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchSafeCodeRatio(this.listQuery).then(response => {
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
          fetchCreate(this.createFormData).then(() => {
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

    // 点击修改
    handleUpdate(row) {
      this.createFormData = { ...row } // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存修改
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const tempData = { ...this.createFormData }
          fetchRevise(tempData).then(() => {
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
      if (row.status === 1) {
        this.$message({
          message: '你必须先停用才能删除',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.listLoading = true
      fetchDelete({
        weightId: row.weightId
      }).then(() => {
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
      this.listLoading = true
      fetchChange({
        weightId: row.weightId
      }).then(() => {
        this.dialogFormVisible = false
        this.listLoading = false
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }).catch((e) => {
        this.listLoading = false
        console.log(e)
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

</style>
