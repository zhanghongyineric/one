<!--
  - FileName: 菜单管理
  - @author: ZhouJiaXing
  - @date: 2021/6/8 上午10:52
  -->

<template>
  <div class="layout-content menu-manage">
    <el-card class="box-card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" label-width="80px">
        <el-row :gutter="48">
          <!--<el-col :md="8" :sm="24">-->
          <!--  <el-form-item label="菜单名称:" prop="title">-->
          <!--    <el-input-->
          <!--      v-model="queryParams.title"-->
          <!--      placeholder="请输入菜单名称"-->
          <!--      clearable-->
          <!--      @keyup.enter.native="handleQuery"-->
          <!--    />-->
          <!--  </el-form-item>-->
          <!--</el-col>-->
          <el-col :md="8" :sm="24">
            <el-form-item label="所属系统:" prop="system">
              <el-select v-model="queryParams.system" placeholder="请选择菜单所属系统" style="width: 100%;">
                <el-option value="" label="全部" />
                <el-option
                  v-for="item in optionGroup.systemList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <div
              class="table-page-search-submitButtons"
            >
              <el-button size="small" @click="resetQuery">重置</el-button>
              <el-button size="small" type="primary" @click="handleQuery">查询</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleAdd"
              >新增
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="title" label="菜单名称" :show-overflow-tooltip="true" width="160" />
        <el-table-column prop="icon" label="图标" align="center" min-width="100">
          <template slot-scope="scope">
            <i v-if="scope.row.icon.includes('el-icon')" :class="[scope.row.icon,'sub-el-icon']" />
            <svg-icon v-else-if="scope.row.icon" :icon-class="scope.row.icon" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column v-slot="{row}" prop="system" label="所属系统" min-width="80">{{ row.system|systemFilter }}</el-table-column>
        <el-table-column prop="sort" label="排序" min-width="60" />
        <el-table-column v-slot="{row}" prop="permission" label="权限标识" :show-overflow-tooltip="true">
          {{ row.permission || '-' }}
        </el-table-column>
        <el-table-column prop="component" label="组件" :show-overflow-tooltip="true" min-width="180" />
        <el-table-column v-slot="{row}" prop="name" label="路由名称" :show-overflow-tooltip="true">
          {{ row.name || '-' }}
        </el-table-column>
        <el-table-column prop="path" label="路由地址" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleAdd(scope.row)"
            >新增
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

      <!-- 添加或修改菜单对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="上级菜单">
                <el-cascader
                  v-model="form.parentId"
                  :options="menuOptions"
                  placeholder="选择上级菜单"
                  :props="{ checkStrictly: true }"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单类型" prop="menuType">
                <el-radio-group v-model="form.type">
                  <el-radio label="2">目录</el-radio>
                  <el-radio label="0">菜单</el-radio>
                  <el-radio label="1">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.type === '2'" label="目录图标" prop="icon">
                <el-popover
                  placement="bottom-start"
                  width="460"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
                >
                  <IconSelect ref="iconSelect" @selected="selected" />
                  <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                    <svg-icon
                      v-if="form.icon"
                      slot="prefix"
                      :icon-class="form.icon"
                      class="el-input__icon"
                      style="height: 32px;width: 16px;margin-top: 4px;"
                    />
                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                  </el-input>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="title">
                <el-input v-model="form.title" placeholder="请输入菜单名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序" prop="orderNum">
                <el-input-number v-model="form.sort" :min="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.type !== '1'" label="路由地址" prop="path">
                <el-input v-model="form.path" placeholder="请输入路由地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.type === '0'" label="路由名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入路由名称" />
              </el-form-item>
            </el-col>
            <el-col v-if="form.type !== '1'" :span="24">
              <el-form-item label="组件" prop="component">
                <el-input v-model="form.component" placeholder="请输入组件路径或者组件名" />
              </el-form-item>
            </el-col>
            <el-col v-if="form.type === '2'" :span="24">
              <el-form-item label="所属系统" prop="system" :disabled="title==='修改菜单'">
                <el-select v-model="form.system" placeholder="请选择菜单所属系统" style="width: 100%;">
                  <el-option
                    v-for="item in optionGroup.systemList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.type === '1'" label="权限标识" prop="permission">
                <el-input v-model="form.permission" placeholder="请输入权限标识" maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.type !== '1'" label="显示状态">
                <el-radio-group v-model="form.hidden">
                  <el-radio
                    v-for="dict in optionGroup.hideMenu"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.type === '0'" label="是否缓存">
                <el-radio-group v-model="form.noCache">
                  <el-radio label="1">缓存</el-radio>
                  <el-radio label="0">不缓存</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { addMenu, deleteMenu, getMenuList, updateMenu } from '@/api/system-manage/menu-manage'
import IconSelect from '@/components/IconSelect'

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'MenuManage',
  components: { IconSelect },
  filters: {
    systemFilter: function(value) {
      return onlineOption.system.map[value] || '未分配'
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        title: '',
        system: ''
      },
      queryParams_temp: {
        title: '',
        system: ''
      },
      // 表单参数
      form: {
        parentId: [-1],
        name: '',
        path: '',
        hidden: '1',
        component: 'Layout',
        title: '',
        icon: '',
        noCache: '1',
        permission: '',
        sort: 1,
        type: '2'
      },
      form_temp: {
        parentId: [-1],
        name: '',
        path: '',
        hidden: '1',
        component: 'Layout',
        title: '',
        icon: '',
        noCache: '1',
        permission: '',
        sort: 1,
        type: '2'
      },
      optionGroup: {
        hideMenu: onlineOption.hide_menu.list,
        systemList: onlineOption.system.list
      },
      // 表单校验
      rules: {
        icon: [
          { required: true, message: '目录图标不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '组件不能为空', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ],
        system: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // 菜单树
    menuOptions() {
      const menu = [{
        value: -1,
        label: '根目录',
        children: []
      }]

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
      menu[0].children = formatMenu(JSON.parse(JSON.stringify(this.menuList)))

      return menu
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      getMenuList(this.queryParams).then(res => {
        this.menuList = res.data
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        ...this.form_temp
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = { ...this.queryParams_temp }
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()

      // 点击已有菜单新增子菜单
      if (row.id) {
        this.form.parentId = row.id
        this.form.type = '0' // 默认选中菜单
      }

      this.open = true
      this.title = '添加菜单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = { ...row }
      this.open = true
      this.title = '修改菜单'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateMenu(this.form).then(response => {
              this.$notify({
                type: 'success',
                message: '修改成功'
              })
              this.getList()
              this.open = false
            })
          } else {
            const parentId = Array.isArray(this.form.parentId) ? this.form.parentId[this.form.parentId.length - 1] : this.form.parentId
            addMenu({ ...this.form, parentId }).then(response => {
              this.$notify({
                type: 'success',
                message: '新增成功'
              })
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.title + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deleteMenu(row.id)
      }).then(() => {
        this.getList()
        this.$notify({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
      })
    }
  }
}
</script>
