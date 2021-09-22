<template>
  <div class="layout-content">
    <el-card>
      <div class="table-page-search-wrapper">
        <el-form
          class="table-page-search-wrapper search"
          label-width="75px"
          size="small"
        >
          <el-row :gutter="48">
            <el-col :md="8" :sm="24">
              <el-form-item label="区域名称:">
                <el-input
                  v-model="listQuery.unitName"
                  placeholder="请输入行政区域关键字"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <div class="table-page-search-submitButtons">
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button type="primary" size="small" @click="resetQuery">所有区域</el-button>
                <el-button type="primary" size="small" @click="addRegion">添加</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        border
        fit
        highlight-current-row
        style="width:100%;"
        stripe
      >
        <el-table-column
          label="编号"
          type="index"
          width="50"
          align="center"
        />
        <el-table-column label="行政区域名称" prop="unitName" min-width="100" show-overflow-tooltip align="center" />
        <el-table-column label="行政区域编码" prop="zoneId" min-width="100" show-overflow-tooltip align="center" />
        <el-table-column label="上级区域" prop="upUnitName" min-width="100" show-overflow-tooltip align="center" />
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getTableData"
      />

      <el-dialog
        :before-close="closeDialog"
        custom-class="base-dialog dialog-col-1"
        :visible.sync="visible"
        :title="update ? '修改' : '新增'"
        :close-on-click-modal="false"
      >
        <el-form
          ref="dialogForm"
          :rules="rules"
          :model="dialogData"
          label-width="150px"
        >
          <el-form-item label="行政区域名称：" prop="unitName">
            <el-input v-model="dialogData.unitName" placeholder="请输入行政区域名称" size="small" clearable />
          </el-form-item>
          <el-form-item label="行政区域编码：" prop="zoneId">
            <el-input v-model="dialogData.zoneId" placeholder="请输入行政区域编码" size="small" clearable />
          </el-form-item>
          <el-form-item label="上级区域：" prop="upUnitName">
            <el-cascader
              v-model="dialogData.upUnitName"
              :options="cityOptions"
              size="small"
              :props="props"
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  selectRegionCode,
  save,
  deleteRegions,
  upUnitName
} from '@/api/information-manage/regions'
import Pagination from '@/components/Pagination'

export default {
  name: 'AdministrativeRegions',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      tableData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitName: ''
      },
      total: 0,
      update: false,
      visible: false,
      rules: {
        unitName: [{ required: true, message: '请输入行政区域名称', trigger: 'blur' }],
        zoneId: [{ required: true, message: '请输入行政区域编码', trigger: 'blur' }],
        upUnitName: [{ required: true, message: '请选择上级区域', trigger: 'change' }]
      },
      cityOptions: [],
      dialogData: {},
      upUnitData: [],
      currentRow: {},
      props: {
        label: 'unitName',
        value: 'unitName',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  mounted() {
    this.getTableData()
    this.getUpUnitName()
  },
  methods: {
    search() {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      this.getTableData()
    },
    getTableData() {
      this.listLoading = true
      selectRegionCode({ ...this.listQuery })
        .then(res => {
          const { data: { list, total }} = res
          this.total = total
          this.tableData = list
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    handleUpdate(row) {
      this.update = true
      this.dialogData = { ...row }
      this.currentRow = row
      this.visible = true
      this.$nextTick(_ => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除该条数据？')
        .then(_ => {
          this.listLoading = true
          const { unitId } = row
          deleteRegions({ unitId })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              if (this.tableData.length === 1 && this.listQuery.pageNum !== 1) {
                this.listQuery.pageNum--
              }
              this.getTableData()
            })
            .catch(err => {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
              throw err
            })
        })
        .catch(err => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
          throw err
        })
    },
    getUpUnitName() {
      upUnitName()
        .then(res => {
          const { data } = res
          this.deleteEmptyChildren(data[0])
          this.upUnitData = data
          this.cityOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    deleteEmptyChildren(value) {
      if (!value.children.length) value.children = null
      else {
        value.children.forEach(item => {
          this.deleteEmptyChildren(item)
        })
      }
    },
    resetQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        unitName: ''
      }
      this.getTableData()
    },
    addRegion() {
      this.update = false
      this.visible = true
      this.$nextTick(_ => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    closeDialog() {
      this.visible = false
      setTimeout(() => {
        this.dialogData = {}
      }, 500)
    },
    submit() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.listloading = true
          if (Array.isArray(this.dialogData.upUnitName)) {
            const { length } = this.dialogData.upUnitName
            this.dialogData.upUnitName = this.dialogData.upUnitName[length - 1]
          }
          this.dialogData.aptitudeLevel = '15'
          this.dialogData.upUnitId = this.getUpUnitId(this.dialogData.upUnitName)

          if (this.update) {
            this.dialogData.id = this.currentRow.id.toString()
            this.dialogData.unitId = this.currentRow.unitId
          }
          save({ ...this.dialogData })
            .then(_ => {
              this.getTableData()
              this.$message({
                message: this.update ? '修改成功' : '新增成功',
                type: 'success'
              })
              setTimeout(() => {
                this.dialogData = {}
              }, 500)
            })
            .catch(err => {
              this.listloading = false
              this.$message({
                message: this.update ? '修改失败' : '新增失败',
                type: 'error'
              })
              throw err
            })
          this.visible = false
        }
      })
    },
    getUpUnitId(name) {
      let unitId = ''
      if (name === this.cityOptions[0].unitName) return this.cityOptions[0].unitId
      else unitId = this.recursionUnitData(this.cityOptions[0].children, name)
      return unitId
    },
    recursionUnitData(children, name) {
      if (children) {
        let id = ''
        children.forEach(v => {
          if (v.unitName === name) id = v.unitId
          else this.recursionUnitData(v.children, name)
        })
        return id
      }
    }
  }
}
</script>
