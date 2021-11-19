<template>
  <div class="layout-content">
    <el-card>
      <el-form
        :model="listQuery"
        label-width="80px"
        size="small"
      >
        <el-row :gutter="48">
          <el-col :md="6" :sm="24">
            <el-form-item label="车辆类型:">
              <el-select
                v-model="listQuery.vehicleType"
                size="small"
                placeholder="请选择车辆类型"
                style="width:100%"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button
                type="warning"
                size="small"
                style="margin-bottom: 10px"
                @click="reset"
              >重置
              </el-button>
              <el-button
                type="primary"
                size="small"
                style="margin-bottom: 10px"
                @click="addVehicle"
              >新增车辆
              </el-button>
              <el-button
                type="primary"
                size="small"
                style="margin-bottom: 10px"
                @click="search"
              >查询
              </el-button>

            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        border
        style="width: 100%"
        :stripe="true"
      >
        <el-table-column type="index" label="编号" width="60" align="center" />
        <el-table-column prop="plateNum" label="车牌号码" min-width="150px" align="center" />
        <el-table-column prop="plateColor" label="车牌颜色" min-width="150px" align="center">
          <template slot-scope="scope">
            {{ scope.row.plateColor | plateColorFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="vehicleType" label="车辆类型" min-width="200px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.vehicleType | vehicleTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="safecodeScore" label="安全码得分" min-width="120px" align="center" />
        <el-table-column prop="safecodeColor" label="安全码颜色" align="center" min-width="120px" show-overflow-tooltip>
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.safecodeColor == 1" icon-class="safecode" style="width:23px;height: 23px;background-color:#018E60;" />
            <svg-icon v-else-if="scope.row.safecodeColor == 2" icon-class="safecode" style="width:23px;height: 23px;background-color:#4ea1db;" />
            <svg-icon v-else-if="scope.row.safecodeColor == 3" icon-class="safecode" style="width:23px;height: 23px;background-color:#E6A23C;" />
            <svg-icon v-else icon-class="safecode" style="width:23px;height: 23px;background-color:#F56C6C;" />
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="企业名称" min-width="180px" align="center" show-overflow-tooltip />
        <el-table-column prop="creator" label="平台名称" min-width="180px" align="center" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="更新日期" min-width="200px" align="center" />
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template v-slot="{row}">
            <el-button type="warning" size="mini" @click="updateData(row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delData(row)">删除</el-button>
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
        :close-on-click-modal="false"
        :before-close="closeDialog"
        custom-class="dialog-col-1"
        top="100px"
      >
        <el-form
          ref="dialogForm"
          :model="formData"
          label-width="100px"
          :rules="rules"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="车牌号:" prop="plateNum">
                <el-autocomplete
                  v-model="formData.plateNum"
                  :fetch-suggestions="searchType"
                  placeholder="请输入车牌号关键字"
                  :debounce="500"
                  clearable
                  size="small"
                  @select="selectPlateNum"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="车牌颜色:" prop="plateColor">
                <el-select v-model="formData.plateColor" size="small" placeholder="请选择车牌颜色">
                  <el-option
                    v-for="item in colorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="车辆类型:" prop="vehicleType">
                <el-select v-model="formData.vehicleType" size="small" placeholder="请选择车辆类型">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="安全码得分:" prop="safecodeScore">
                <el-input v-model="formData.safecodeScore" clearable size="small" placeholder="请输入安全码得分" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="安全码颜色:" prop="safecodeColor">
                <el-select v-model="formData.safecodeColor" size="small" placeholder="请选择安全码颜色">
                  <el-option
                    v-for="item in codeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="平台名称:" prop="creator">
                <el-input v-model="formData.creator" clearable size="small" placeholder="请输入平台名称" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submit()">确认</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  focusVehicles,
  save,
  deleteVehicle,
  selectPlateNum
} from '@/api/business-manage/focus-on-vehicles'
import Pagination from '@/components/Pagination'

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
let that

export default {
  name: 'FocusOnVehicles',
  components: { Pagination },
  filters: {
    plateColorFilter(color) {
      const text = that.colorMap[color]
      return text
    },
    vehicleTypeFilter(type) {
      const text = that.typeMap[type]
      return text
    },
    safecodeColorFilter(color) {
      const text = that.codeMap[color]
      return text
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        vehicleType: ''
      },
      total: 0,
      type: 'add',
      titles: {
        'add': '新增',
        'update': '修改'
      },
      visible: false,
      formData: {},
      rules: {
        safecodeColor: [{ required: true, trigger: 'change', message: '请选择安全码颜色' }],
        safecodeScore: [{ required: true, trigger: 'blur', message: '请输入安全码得分' }],
        vehicleType: [{ required: true, trigger: 'change', message: '请选择车辆类型' }],
        plateColor: [{ required: true, trigger: 'change', message: '请选择车牌颜色' }],
        plateNum: [{ required: true, trigger: 'blur', message: '请输入车牌号' }],
        creator: [{ required: true, trigger: 'blur', message: '请输入平台名称' }]
      },
      colorOptions: [],
      colorMap: {},
      typeOptions: [],
      typeMap: {},
      codeOptions: [],
      codeMap: {},
      currentRow: {},
      codeColorStyle: ''
    }
  },
  mounted() {
    that = this
    this.getList()
    this.colorOptions = onlineOption['车牌颜色编码'].list
    this.colorMap = onlineOption['车牌颜色编码'].map
    this.typeOptions = onlineOption['vehicle_type_code'].list
    this.typeMap = onlineOption['vehicle_type_code'].map
    this.codeMap = onlineOption['safe_code'].map
    this.codeOptions = onlineOption['safe_code'].list
  },
  methods: {
    addVehicle() {
      this.type = 'add'
      this.visible = true
      this.formData = {}
      this.clearForm()
    },
    clearForm() {
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate()
      })
    },
    getList() {
      this.listLoading = true
      focusVehicles({ ...this.listQuery })
        .then(({ data }) => {
          this.list = data.list
          this.total = data.total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    delData(row) {
      this.$confirm('确定删除该条数据吗？')
        .then(() => {
          this.listLoading = true
          deleteVehicle(row.vehicleId)
            .then(_ => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList()
              this.listLoading = false
            })
            .catch(err => {
              this.listLoading = false
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
    closeDialog() {
      this.visible = false
      this.formData = {}
    },
    updateData(row) {
      this.type = 'update'
      this.visible = true
      this.currentRow = row
      this.formData = { ...row }
      this.clearForm()
    },
    search() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    reset() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        vehicleType: ''
      }
      this.getList()
    },
    searchType(queryString, cb) {
      if (queryString) {
        if (queryString.length !== 7) {
          selectPlateNum(queryString)
            .then(res => {
              const { data } = res
              const arr = []
              data.forEach(item => {
                arr.push({
                  label: item,
                  value: item
                })
              })
              cb(arr)
            })
            .catch(err => {
              throw err
            })
        }
      } else {
        cb([])
        return
      }
    },
    selectPlateNum(item) {
      this.formData.plateNum = item.value
    },
    submit() {
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          if (this.type === 'update') this.formData.id = this.currentRow.id
          save({ ...this.formData })
            .then(_ => {
              this.$message({
                message: this.titles[this.type] + '成功！',
                type: 'success'
              })
              this.visible = false
              this.listLoading = false
              this.getList()
            })
            .catch(err => {
              this.listLoading = false
              this.$message({
                message: this.titles[this.type] + '失败！',
                type: 'error'
              })
              throw err
            })
        }
      })
    }
  }
}
</script>
