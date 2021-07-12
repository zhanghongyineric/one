<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">
            <el-col :md="8" :sm="24">
              <el-form-item label="版本号:">
                <el-input v-model="listQuery.version" placeholder="请输入版本号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="所属系统:">
                <el-select
                  v-model="listQuery.system"
                  placeholder="请选择所属系统"
                >
                  <el-option
                    v-for="{label,value} in sysOptions"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <div
                class="table-page-search-submitButtons"
                style="margin-top: -4px"
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="visible = true">新增</el-button>
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
        <el-table-column label="版本号" prop="version" width="130px" />
        <el-table-column label="所属系统" prop="system" width="200px" />
        <el-table-column label="版本描述" prop="versionDes" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="220px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handlePush(scope.row)"
            >发布
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <el-dialog
        :title="titles[type]"
        :visible.sync="visible"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-width="100px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="版本号:" prop="version">
                <el-input v-model="formData.version" placeholder="请输入版本号" size="small" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="版本描述:" prop="versionDes">
                <el-input v-model="formData.versionDes" placeholder="请输入版本描述" size="small" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属系统:" prop="system">
                <el-select
                  v-model="formData.system"
                  placeholder="请选择所属系统"
                  size="small"
                >
                  <el-option
                    v-for="{label,value} in sysOptions"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="visible = false">
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
import Pagination from '@/components/Pagination'

export default {
  name: 'VersionManage',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      list: [
        {
          version: '1.0.0',
          versionDes: '测试',
          system: '监测端'
        }
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      sysOptions: [
        {
          label: '监测端',
          value: '0'
        },
        {
          label: '政府端',
          value: '1'
        }
      ],
      total: 0,
      visible: false,
      formData: {},
      rules: {
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        versionDes: [{ required: true, message: '请输入版本描述', trigger: 'blur' }],
        system: [{ required: true, message: '请选择所属系统', trigger: 'change' }]
      },
      type: 'add',
      titles: {
        add: '新增',
        update: '修改'
      }
    }
  },
  methods: {
    addVersion() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log('接口')
        }
      })
    },
    handlePush() {
      this.$confirm('确定发布该条数据？')
        .then(_ => {
          this.$message({
            type: 'success',
            message: '发布成功！'
          })
        })
        .catch(_ => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          })
        })
    },
    handleDelete() {
      this.$confirm('确定删除该条数据？')
        .then(_ => {
          this.$message({
            type: 'success',
            message: '删除成功！'
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
    handleUpdate() {
      this.type = 'update'
      this.visible = true
    },
    resetQuery() {
      this.listQuery = {}
    },
    getList() {

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
