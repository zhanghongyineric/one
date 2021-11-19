<template>
  <div class="layout-content demo-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="6" :sm="24">
              <el-form-item label="关键字:">
                <el-input v-model="listQuery.keyword" placeholder="请输入用户名或别名或电话关键字" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-form-item label="状态:">
                <el-select v-model="listQuery.status" placeholder="请选择状态">
                  <el-option label="全部" value="" />
                  <el-option
                    v-for="{label,value} in optionGroup.statusList"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-form-item label="角色名:">
                <el-input v-model="listQuery.roleName" clearable placeholder="请输入角色名" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-button size="small" @click="resetQuery">重置</el-button>
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
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
        <el-table-column label="用户名" prop="username" min-width="120px" />
        <el-table-column label="别名" prop="alias" width="250px" show-overflow-tooltip />
        <el-table-column v-slot="{row}" label="角色名" prop="roles" min-width="120px">
          {{ row.roleList | rolesFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="状态" prop="status">
          <!-- <span :style="{color:row.status==='0'?'#67C23A':'#F56C6C'}">
            {{ row.status | statusFilter }}
          </span> -->
          <el-switch
            :value="row.status"
            active-value="0"
            inactive-value="9"
            :disabled="row.type === '0'"
            @change="statusChange(row)"
          />
        </el-table-column>
        <el-table-column label="电话" prop="phone" min-width="120px" />
        <el-table-column label="创建日期" prop="createTime" min-width="200px" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="warning" size="mini" @click="handleReset(row)">
              重置
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              style="margin-left:10px;"
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
      <pagination
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
        custom-class="base-dialog dialog-col-1"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="createFormData.username" placeholder="请输入用户名" :disabled="dialogStatus === 'update'" />
          </el-form-item>
          <el-form-item label="别名	:" prop="alias">
            <el-input v-model="createFormData.alias" placeholder="请输入别名	" />
          </el-form-item>
          <el-form-item label="角色:" prop="roleIds">
            <el-select
              v-model="createFormData.roleIds"
              placeholder="请选择角色"
              clearable
              multiple
            >
              <el-option
                v-for="item in optionGroup.roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门:" prop="deptId">
            <el-cascader
              v-model="createFormData.deptId"
              placeholder="输入关键字查询部门"
              :options="optionGroup.deptList"
              filterable
              clearable
              style="width: 100%;"
              :props="{
                checkStrictly: true
              }"
            />
          </el-form-item>
          <el-form-item label="电话:" prop="phone">
            <el-input v-model="createFormData.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select v-model="createFormData.status" placeholder="请选择状态">
              <el-option v-for="{label,value} in optionGroup.statusList" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogStatus === 'create'" label="密码:" prop="password">
            <el-input v-model="createFormData.password" show-password placeholder="请输入密码" />
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

import {
  fetchList,
  fetchDeptTree,
  fetchRoleList,
  updateCount,
  resetPassword,
  addCount, deleteCount, changeStatus
} from '@/api/system-manage/account-manage'
import Pagination from '@/components/Pagination'
import { isPhoneNumber } from '@/utils' // 分页
const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'AccountManage',
  components: { Pagination },
  filters: {
    rolesFilter: function(roles) {
      return roles.map(role => {
        return role.roleName
      }).join(',') || '未分配'
    },
    statusFilter: function(status) {
      return onlineOption.account_status.map[status]
    }
  },
  data() {
    const validateUnitTel = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (!isPhoneNumber(value)) {
        callback(new Error('请输入正确电话'))
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
        keyword: '',
        status: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        status: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        statusList: onlineOption.account_status.list,
        deptList: [],
        roleList: []
      }, // 存放选项的数据
      createFormData: {
        username: '',
        alias: '',
        roleIds: '',
        status: '0',
        phone: '',
        deptId: '',
        password: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        username: '',
        alias: '',
        roleIds: '',
        status: '0',
        phone: '',
        deptId: '',
        password: ''
      }, // 用于重置新增的数据
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        alias: [{ required: true, message: '请输入别名	', trigger: 'blur' }],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        phone: [{ required: false, trigger: 'blur', validator: validateUnitTel }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码长度必须大于6位', trigger: 'blur' }]
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
    this.getList()
    this.getRoleList()
    this.getDeptList()
  },
  methods: {
    // 重置密码
    handleReset({ userId }) {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputPattern: /^.{6,}$/,
        inputType: 'password',
        inputErrorMessage: '密码需要大于6位',
        closeOnClickModal: false
      }).then(({ value }) => {
        resetPassword({ userId, newPassword: value }).then(_ => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      }).catch(_ => {
        console.log('操作取消')
      })
    },
    // 切换账号启用停用
    statusChange(row) {
      this.listLoading = true
      changeStatus({ id: row.userId }).then(res => {
        this.getList().then(_ => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch((e) => {
        this.listLoading = false
        console.log(e)
      })
    },
    // 获取角色列表
    getRoleList() {
      fetchRoleList().then(res => {
        this.optionGroup.roleList = res.data.map(role => {
          return {
            label: role.roleName,
            value: role.id
          }
        })
      })
    },
    // 获取部门列表
    getDeptList() {
      const formatDept = (menu) => {
        return menu.map(item => {
          const temp_item = {
            label: item.name,
            value: item.id
          }

          if (item.children && item.children.length) {
            item.children = formatDept(item.children)
          }
          if (item.children && item.children.length) {
            temp_item.children = item.children
          }

          return temp_item
        })
      }

      fetchDeptTree().then(res => {
        // 格式化数据
        this.optionGroup.deptList = formatDept(res.data)
      })
    },
    // 切换启用停用
    handleToggle() {
      this.$message('暂无接口')
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

          const { deptId } = this.createFormData
          const deptId_format = Array.isArray(deptId) ? deptId[deptId.length - 1] : deptId

          addCount({ ...this.createFormData, deptId: deptId_format }).then(() => {
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
      // 格式化角色id
      const roleIds = row.roleList.map(role => {
        return role.id
      })

      this.createFormData = { ...row, roleIds } // copy obj
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
          const { deptId } = this.createFormData
          const deptId_format = Array.isArray(deptId) ? deptId[deptId.length - 1] : deptId
          const tempData = { ...this.createFormData, deptId: deptId_format, id: this.createFormData.userId }

          updateCount(tempData).then(() => {
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
      deleteCount({ id: row.userId }).then(_ => {
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
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

</style>
