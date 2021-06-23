<!--
  - FileName: 角色管理
  - @author: ZhouJiaXing
  - @date: 2021/6/8 上午10:52
  -->

<template>
  <div class="layout-content role-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="关键字:">
                <el-input v-model="listQuery.keyword" placeholder="请输入角色名" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>

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
        <el-table-column label="角色名" prop="roleName" />
        <el-table-column label="角色标识" prop="roleCode" />
        <el-table-column label="角色描述" prop="roleDesc" />
        <el-table-column label="创建时间" prop="createTime" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
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
        :close-on-click-modal="false"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <el-form-item label="角色名:" prop="roleName">
            <el-input v-model="createFormData.roleName" placeholder="请输入角色名" />
          </el-form-item>
          <el-form-item label="角色标识:" prop="roleCode">
            <el-input v-model="createFormData.roleCode" placeholder="请输入角色标识" :disabled="dialogStatus==='update'" />
          </el-form-item>
          <el-form-item label="角色描述:" prop="roleDesc">
            <el-input v-model="createFormData.roleDesc" placeholder="请输入角色描述" />
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree
              ref="menu-tree"
              :data="optionGroup.menuOptions"
              show-checkbox
              node-key="value"
              style="margin-top: 6px;"
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

// import { fetchList, createAccount, updateAccount } from '@/api/role-manage.js' fixme:替换为你的接口地址
import Pagination from '@/components/Pagination'
import { addRole, deleteRole, editRole, editRoleMenu, getList } from '@/api/system-manage/role-manage'
import { getMenuByRole, getMenuList } from '@/api/system-manage/menu-manage' // 分页

export default {
  name: 'RoleManage',
  components: { Pagination },
  filters: {},
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        keyword: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        menuOptions: []
      }, // 存放选项的数据
      createFormData: {
        roleName: '',
        roleCode: '',
        roleDesc: '',
        menuIds: ''// 角色的菜单权限
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        roleName: '',
        roleCode: '',
        roleDesc: '',
        menuIds: []// 角色的菜单权限
      }, // 用于重置新增的数据
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '角色标识不能为空', trigger: 'blur' }
        ],
        menuIds: [
          { required: true, message: '菜单不能为空', trigger: 'blur' }
        ]
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
    this.initMenuOptions()
  },

  methods: {
    // 初始化菜单树
    initMenuOptions() {
      getMenuList().then(res => {
        // 格式化数据
        const formatMenu = (menu) => {
          return menu.map(item => {
            const temp_item = {
              label: item.title,
              value: item.id
            }

            if (item.children && item.children.length) {
              item.children = formatMenu(item.children)
            }
            if (item.children && item.children.length) {
              temp_item.children = item.children
            }

            return temp_item
          })
        }
        // 格式化菜单
        this.optionGroup.menuOptions = formatMenu(res.data)
      })
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.total.list
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
    // 重置表单状态
    resetForm() {
      this.$refs['menu-tree'].setCheckedKeys([])// 清空选中节点
      this.closeTree()// 折叠节点
      this.$refs['dataForm'].clearValidate()
    },
    // 点击新增按钮
    handleCreate() {
      this.resetCreateFormData()

      // 如果弹窗已经渲染好了，直接初始化表单
      if (this.$refs['menu-tree']) {
        this.resetForm()
        // 避免打开弹窗后树突然折叠
        setTimeout(item => {
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
        }, 100)
      } else {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.resetForm()
        })
      }
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

          // 获取选中和半选中的菜单id
          const menuIds = this.$refs['menu-tree'].getCheckedKeys().concat(this.$refs['menu-tree'].getHalfCheckedKeys()).join(',')
          // 新增角色
          addRole({ ...this.createFormData, menuIds }).then(() => {
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
      // 如果弹窗已经渲染好了，直接初始化表单
      if (this.$refs['menu-tree']) {
        this.resetForm()
        // 避免打开弹窗后树突然折叠
        setTimeout(item => {
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        }, 100)
      } else {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.resetForm()
        })
      }
      // 获取当前角色的选中菜单
      getMenuByRole(row.id).then(res => {
        this.createFormData = { ...row } // copy obj
        const checked = res.data
        checked.forEach((v) => {
          this.$nextTick(() => {
            this.$refs['menu-tree'].setChecked(v, true, false)
          })
        })
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true

          // 获取选中和半选中的菜单id
          const menuIds = this.$refs['menu-tree'].getCheckedKeys().concat(this.$refs['menu-tree'].getHalfCheckedKeys()).join(',')

          editRole({ ...this.createFormData, menuIds }).then(() => {
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
      deleteRole(row.id).then(() => {
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
    // 折叠所有节点
    closeTree() {
      const treeList = this.optionGroup.menuOptions
      for (let i = 0; i < treeList.length; i++) {
        this.$refs['menu-tree'].store.nodesMap[treeList[i].value].expanded = false
      }
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

</style>