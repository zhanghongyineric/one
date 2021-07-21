<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">
            <!-- <el-col :md="8" :sm="24">
              <el-form-item label="版本号:">
                <el-input v-model="listQuery.number" placeholder="请输入版本号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="所属系统:">
                <el-select
                  v-model="listQuery.port"
                  placeholder="请选择所属系统"
                >
                  <el-option
                    v-for="{label,value} in sysOptions"
                    :key="label"
                    :label="value"
                    :value="label"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :md="8" :sm="24">
              <div
                class="table-page-search-submitButtons"
                style="margin-top: -4px"
              >
                <!-- <el-button size="small" @click="resetQuery">重置</el-button> -->
                <!-- <el-button type="primary" size="small" @click="getTableData">查询</el-button> -->
                <!-- <el-button type="primary" size="small" @click="openDialog">新增</el-button> -->
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="版本号" prop="number" width="130px" />
        <el-table-column label="所属系统" prop="port" width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.port | portFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本描述" prop="content" show-overflow-tooltip />
        <!-- <el-table-column label="状态" prop="status" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'" style="color:green">启用</span>
            <span v-else style="color:red">禁用</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="120px" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="primary"
              @click="handlePush(scope.row)"
            >发布
            </el-button> -->
            <el-button
              size="mini"
              type="warning"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getTableData"
      /> -->

      <el-dialog
        :title="titles[type]"
        :visible.sync="visible"
        :before-close="closeDialog"
        :close-on-click-modal="false"
        top="50px"
      >
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-width="120px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="版本号:" prop="number">
                <el-input
                  v-model="formData.number"
                  placeholder="请输入版本号"
                  size="small"
                  clearable
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="当前版本描述:" prop="content">
                <quill-editor
                  ref="myQuillEditor"
                  v-model="formData.content"
                  :options="editorOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="历史版本描述:" prop="historyContent">
                <quill-editor
                  ref="historyQuillEditor"
                  v-model="formData.historyContent"
                  :options="editorOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属系统:" prop="port">
                <el-select
                  v-model="formData.port"
                  placeholder="请选择所属系统"
                  size="small"
                >
                  <el-option
                    v-for="{label,value} in sysOptions"
                    :key="label"
                    :label="value"
                    :value="label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col v-if="type === 'update'" :span="24">
              <el-form-item label="状态:" prop="status">
                <el-select
                  v-model="formData.status"
                  placeholder="请选择状态"
                  size="small"
                >
                  <el-option
                    v-for="{label,value} in statusOptions"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog">
            取消
          </el-button>
          <el-button type="primary" size="small" @click="addVersion()">
            确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import {
  selectFind,
  save,
  sysPort,
  deleteData,
  release
} from '@/api/system-manage/version-manage'

let that

export default {
  name: 'VersionManage',
  components: { quillEditor },
  filters: {
    portFilter(sys) {
      if (sys) {
        let text
        that.sysOptions.forEach(item => {
          if (sys === item.label) text = item.value
        })
        return text
      }
    }
  },
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      sysOptions: [],
      total: 0,
      visible: false,
      formData: {},
      statusOptions: [
        {
          label: '禁用',
          value: '0'
        },
        {
          label: '启用',
          value: '1'
        }
      ],
      rules: {
        number: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        content: [{ required: true, message: '请输入版本描述', trigger: 'blur' }],
        port: [{ required: true, message: '请选择所属系统', trigger: 'change' }]
      },
      type: 'add',
      titles: {
        add: '新增',
        update: '修改'
      },
      currentRow: {},
      editorOption: {}
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.getSysPort()
    this.getTableData()
  },
  methods: {
    closeDialog() {
      this.visible = false
      this.formData = {}
    },
    getTableData() {
      this.listLoading = true
      selectFind({ ...this.listQuery })
        .then(res => {
          this.list = res.data
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    getSysPort() {
      sysPort()
        .then(res => {
          this.sysOptions = res.data
        })
        .catch(err => {
          throw err
        })
    },
    addVersion() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.type === 'update') this.formData.id = this.currentRow.id
          save({ ...this.formData })
            .then(res => {
              this.visible = false
              this.getTableData()
              this.$message({
                message: this.type === 'add' ? '新增成功' : '修改成功',
                type: 'success'
              })
              this.formData = {}
            })
            .catch(err => {
              this.$message({
                message: this.type === 'add' ? '新增失败' : '修改失败',
                type: 'error'
              })
              throw err
            })
        }
      })
    },
    openDialog() {
      this.visible = true
      this.type = 'add'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handlePush(row) {
      this.$confirm('确定发布该条数据？')
        .then(_ => {
          release({ status: '1', id: parseInt(row.id) })
            .then(_ => {
              this.getTableData()
              this.$message({
                type: 'success',
                message: '发布成功！'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '发布失败！'
              })
              throw err
            })
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          })
        })
    },
    handleDelete(row) {
      this.$confirm('确定删除该条数据？')
        .then(_ => {
          deleteData({ id: parseInt(row.id) })
            .then(_ => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              if (this.listQuery.pageNum !== 1 && this.list.length === 1) {
                this.listQuery.pageNum--
              }
              this.getTableData()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '删除失败！'
              })
              throw err
            })
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSearch() {

    },
    handleUpdate(row) {
      this.type = 'update'
      this.visible = true
      this.formData = { ...row }
      this.currentRow = row
    },
    resetQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10
      }
      this.getTableData()
    }
  }
}
</script>
<style scoped lang="scss">
.addbtn {
    margin-bottom: 20px;
}

.dialog-footer {
    margin-top: -20px;
}
</style>
