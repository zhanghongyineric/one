<!--
  - FileName: 字典管理
  - @author: ZhouJiaXing
  - @date: 2021/5/7 上午11:40
  -->

<template>
  <div class="layout-content dictionary">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="关键字:">
                <el-input v-model="listQuery.keyword" placeholder="请输入关键字" @keyup.enter.native="handleSearch" />
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
        :row-key="row=>row.id"
        :expand-row-keys="expandRowKeys"
        @expand-change="expandChange"
      >

        <!--展开表格-->
        <el-table-column type="expand">
          <template>
            <el-table
              v-loading="itemListLoading"
              :data="itemList"
              border
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column label="字典值" prop="value" />
              <el-table-column label="字典标签" prop="label" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="排序" prop="sort" />
              <el-table-column label="备注" prop="remarks" />

              <!--表格操作列-->
              <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
                <template v-slot="{row}">
                  <el-button type="text" size="mini" @click="handleItemUpdate(row)">
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确认删除吗？"
                    style="margin-left:10px;"
                    @confirm="handleItemDelete(row)"
                  >
                    <el-button slot="reference" size="mini" type="text">
                      删除
                    </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>

            </el-table>
          </template>
        </el-table-column>

        <el-table-column label="字段" prop="type" />
        <el-table-column label="含义" prop="description" />
        <el-table-column label="备注" prop="remarks" />
        <el-table-column v-slot="{row}" label="创建日期" prop="createTime" min-width="100px">
          {{ row.createTime| dateFilter }}
        </el-table-column>

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="primary" size="mini" @click="handleItemCreate(row.id)">
              创建字典项
            </el-button>
            <el-popconfirm
              title="确认删除吗？如果该字段正在使用中会导致系统运行异常！"
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
          <el-form-item label="字段:" prop="type">
            <el-input v-model="createFormData.type" placeholder="请输入字段,例：account_status" :disabled="dialogStatus === 'update'" />
          </el-form-item>
          <el-form-item label="含义:" prop="description">
            <el-input v-model="createFormData.description" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item label="备注:" prop="remarks">
            <el-input v-model="createFormData.remarks" placeholder="请输入描述" />
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

      <!--字典项新增共用弹窗-->
      <el-dialog
        :title="textMap[itemDialogStatus]"
        :visible.sync="itemDialogFormVisible"
        custom-class="base-dialog dialog-col-1"
      >
        <el-form
          ref="itemDataForm"
          :rules="itemRules"
          :model="itemCreateFormData"
          label-width="90px"
        >
          <el-form-item label="字典值:" prop="value">
            <el-input v-model="itemCreateFormData.value" placeholder="请输入字典值" />
          </el-form-item>
          <el-form-item label="字典标签:" prop="label">
            <el-input v-model="itemCreateFormData.label" placeholder="请输入字典标签" />
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input v-model="itemCreateFormData.description" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="排序:" prop="sort">
            <el-input v-model.number="itemCreateFormData.sort" placeholder="请输入排序" />
          </el-form-item>
          <el-form-item label="备注:" prop="remarks">
            <el-input v-model="itemCreateFormData.remarks" placeholder="请输入备注" />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="itemDialogFormVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            :loading="itemButtonLoading"
            @click="itemDialogStatus==='create'?createItemData():updateItemData()"
          >
            确认
          </el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>

import {
  fetchDictionary,
  addDictionary,
  addDictionaryItem,
  updateDictionary,
  deleteDictionary,
  fetchDictionaryItem,
  updateDictionaryItem,
  deleteDictionaryItem
} from '@/api/system-manage/account-manage'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils' // 分页

export default {
  name: 'DemoPage',
  components: { Pagination },
  filters: {
    dateFilter: function(date) {
      return parseTime(new Date(date))
    }
  },

  data() {
    return {
      expandRowKeys: [], // 展开行
      list: [], // 字典表格数据
      itemList: [], // 字典项表格数据
      listLoading: true, // 表格加载状态
      itemListLoading: false, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      itemButtonLoading: false, // 弹窗按钮加载状态
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
      createFormData: {
        type: '',
        description: '',
        remarks: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        type: '',
        description: '',
        remarks: ''
      }, // 用于重置新增的数据
      rules: {
        type: [{ required: true, message: '请输入类型字段', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      }, // 新增和编辑框的规则

      itemCreateFormData: {
        value: '',
        label: '',
        description: '',
        sort: 0,
        remarks: ''
      }, // 存储新增和编辑框的数据
      itemCreateFormDataTemp: {
        value: '',
        label: '',
        description: '',
        sort: 0,
        remarks: ''
      }, // 用于重置新增的数据
      itemRules: {
        value: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
        label: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }, // 新增和编辑框的规则

      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: '',
      itemDialogFormVisible: false,
      itemDialogStatus: ''
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 展开事件
    expandChange(row, expanded) {
      // 清空表格数据
      this.itemList = []

      if (expanded.length > 1) {
        // 只允许展开一行
        this.expandRowKeys = [expanded[1].id]
      } else if (expanded.length === 1) {
        this.expandRowKeys = [expanded[0].id]
      } else {
        this.expandRowKeys = []
      }

      // 查询字典项数据
      if (this.expandRowKeys.length > 0) {
        this.getItemList(this.expandRowKeys[0])
      }
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchDictionary(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 获取子项列表
    getItemList() {
      if (!this.expandRowKeys[0]) {
        return
      }
      this.itemListLoading = true
      fetchDictionaryItem({ id: this.expandRowKeys[0] }).then(response => {
        this.itemList = response.data.list
        this.itemListLoading = false
      }).catch(() => {
        this.itemListLoading = false
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
          addDictionary(this.createFormData).then(() => {
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
      this.createFormData = { ...row } // copy obj
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
          updateDictionary(tempData).then(() => {
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
      deleteDictionary({ id: row.id }).then(() => {
        this.dialogFormVisible = false
        this.listLoading = false
        if (this.list.length === 1 && this.listQuery.pageNum !== 1) {
          this.listQuery.pageNum--
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

    // 字典项点击新增按钮
    handleItemCreate(id) {
      this.resetItemCreateFormData()
      this.itemCreateFormData.dictId = id
      this.itemDialogStatus = 'create'
      this.itemDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['itemDataForm'].clearValidate()
      })
    },
    // 字典项重置新增表单数据
    resetItemCreateFormData() {
      this.itemCreateFormData = { ...this.itemCreateFormDataTemp }
    },
    // 字典项新增数据
    createItemData() {
      this.$refs['itemDataForm'].validate((valid) => {
        if (valid) {
          this.itemButtonLoading = true
          addDictionaryItem(this.itemCreateFormData).then(() => {
            this.itemDialogFormVisible = false
            this.itemButtonLoading = false
            this.getItemList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.itemButtonLoading = false
            console.log(e)
          })
        }
      })
    },

    // 字典项点击编辑
    handleItemUpdate(row) {
      this.itemCreateFormData = { ...row } // copy obj
      this.itemDialogStatus = 'update'
      this.itemDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['itemDataForm'].clearValidate()
      })
    },
    // 字典项保存编辑
    updateItemData() {
      this.$refs['itemDataForm'].validate((valid) => {
        if (valid) {
          this.itemButtonLoading = true
          const tempData = { ...this.itemCreateFormData }
          updateDictionaryItem(tempData).then(() => {
            this.itemDialogFormVisible = false
            this.itemButtonLoading = false
            this.getItemList(this.itemCreateFormData.dictId)
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.itemButtonLoading = false
            console.log(e)
          })
        }
      })
    },
    // 字典项删除数据
    handleItemDelete(row) {
      this.itemListLoading = true
      deleteDictionaryItem({ id: row.id }).then(() => {
        this.itemDialogFormVisible = false
        this.itemListLoading = false
        this.getItemList(this.itemCreateFormData.dictId)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        this.itemListLoading = false
        console.log(e)
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

</style>
