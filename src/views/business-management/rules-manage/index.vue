<template>
  <div class="layout-content">
    <el-card>
      <div class="table-page-search-wrapper">
        <el-button
          type="primary"
          size="small"
          style="margin-bottom: 10px"
          @click="addRule"
        >新增规则</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" label="编号" width="60" align="center" />
        <el-table-column prop="violationName" label="规则名称" min-width="150px" />
        <el-table-column prop="script" label="规则描述" min-width="200px" />
        <!-- <el-table-column prop="degreeScript" label="违章程度描述" min-width="200px" /> -->
        <el-table-column label="操作" align="center" width="300px">
          <template v-slot="{row}">
            <el-button type="warning" size="mini" @click="updateData(row)">编辑规则</el-button>
            <el-button type="primary" size="mini" @click="updateDegree(row)">违章程度</el-button>
            <el-button type="danger" size="mini" @click="delData(row)">删除</el-button>
            <!-- <el-button type="primary" size="mini" @click="addViolation(row)">新增违章</el-button> -->
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
        :title="type[status]"
        :visible.sync="visible"
        :close-on-click-modal="false"
        :before-close="closeDialog"
        custom-class="base-dialog dialog-col-1"
        top="100px"
      >
        <el-form
          ref="formData"
          :model="formData"
          label-width="100px"
          :rules="oneRule"
        >
          <el-form-item label="规则名称：" prop="violationName">
            <el-select v-model="formData.violationCode" placeholder="请选择规则名称">
              <el-option
                v-for="{label,value} in ruleOptions"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="规则描述：" prop="script">
            <el-input
              v-model="formData.script"
              size="small"
              placeholder="请输入规则描述"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="closeDialog">关闭</el-button>
          <el-button type="primary" @click="saveRule">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="违章程度"
        :visible.sync="degreeVisible"
        :close-on-click-modal="false"
        :before-close="closeDialog"
        custom-class="base-dialog dialog-col-1"
        top="100px"
      >
        <el-form
          ref="degreeForm"
          :model="formData"
          label-width="120px"
          :rules="degreeRule"
        >
          <el-form-item label="违章程度：" prop="degreeLabel">
            <el-select
              v-model="degreeLabel"
              size="small"
            >
              <el-option
                v-for="{value,label} in degreeOptions"
                :key="value"
                :value="value"
                :label="label"
                @click.native="changeDegree(value,label)"
              />
            </el-select>

          </el-form-item>
          <el-form-item :label="`${degreeValue}条件：`" prop="script">
            <el-row>
              <el-col v-show="showCol">
                <el-select
                  v-model="formData.conditionNo"
                  size="small"
                  style="width: 150px"
                  @change="getUnit"
                >
                  <el-option
                    v-for="{label, value, remark} in violationOptions"
                    :key="value"
                    :label="`${label}(${remark})`"
                    :value="value"
                  />
                </el-select>

                <el-select v-model="formData.lessNo" size="small" style="width: 100px" @change="changeSymbol">
                  <el-option
                    v-for="{label, value} in symbols"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
                <el-input v-model="formData.lessValue" size="small" style="width: 100px" placeholder="请输入" />
                <i class="el-icon-delete" @click="deleteCol(1)" />
              </el-col>
              <el-col v-show="showCol2">
                <el-select v-model="formData2.conditionNo" size="small" style="width: 150px" @change="getUnit2">
                  <el-option
                    v-for="{label, value, remark} in violationOptions"
                    :key="value"
                    :label="`${label}(${remark})`"
                    :value="value"
                  />
                </el-select>

                <el-select v-model="formData2.lessNo" size="small" style="width: 100px">
                  <el-option
                    v-for="{label, value} in symbols"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
                <el-input v-model="formData2.lessValue" size="small" style="width: 100px" placeholder="请输入" />
                <i class="el-icon-delete" @click="deleteCol(2)" />
              </el-col>
              <el-col v-show="showCol3">
                <el-select v-model="formData3.conditionNo" size="small" style="width: 150px" @change="getUnit3">
                  <el-option
                    v-for="{label, value, remark} in violationOptions"
                    :key="value"
                    :label="`${label}(${remark})`"
                    :value="value"
                  />
                </el-select>

                <el-select v-model="formData3.lessNo" size="small" style="width: 100px">
                  <el-option
                    v-for="{label, value} in symbols"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
                <el-input v-model="formData3.lessValue" size="small" style="width: 100px" placeholder="请输入" />
                <i class="el-icon-delete" @click="deleteCol(3)" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="描述：" prop="expresion">
            <el-input v-model="expresion" disabled type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="closeDialog">关闭</el-button>
          <el-button type="primary" @click="saveVio">确定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

import {
  selectList,
  save,
  deleteData,
  selectEdit,
  insertViolationDegree,
  updateViolationDegree,
  deleteViolationDegreeValue
} from '@/api/business-manage/rules-manage'
import Pagination from '@/components/Pagination'

export default {
  name: 'RulesManage',
  components: { Pagination },
  data() {
    return {
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listLoading: false,
      symbols: [],
      visible: false,
      degreeVisible: false,
      formData: {
        expresion: '',
        lessValue: '',
        lessNo: '',
        conditionNo: '',
        degreeLabel: '',
        violationName: '',
        violationCode: ''
      },
      formData2: {
        expresion: '',
        lessValue: '',
        lessNo: '',
        conditionNo: ''
      },
      formData3: {
        expresion: '',
        lessValue: '',
        lessNo: '',
        conditionNo: ''
      },
      degreeFormData: {},
      ruleOptions: [],
      degreeOptions: [],
      violationOptions: [],
      degreeValue: '',
      degreeLabel: '',
      type: {
        'update': '更新',
        'add': '新增'
      },
      status: '',
      currentRow: {},

      symbolText: '',
      currentUnit: '',
      currentUnit2: '',
      currentUnit3: '',
      showCol2: true,
      showCol3: true,
      showCol: true,
      expresion: '',
      degreeReq: {
        violationDegrees: []
      },
      oneRule: {
        violationCode: [{ required: true, trigger: 'change', message: '请选择规则名称' }],
        script: [{ required: true, trigger: 'blur', message: '请输入规则描述' }]
      },
      degreeRule: {
        expresion: [{ required: true, trigger: 'blur', message: '请配置违章条件' }]
      },
      update: false,
      currentId: ''
    }
  },
  watch: {
    formData: {
      handler(newVal, oldVal) {
        this.getUnit(newVal.conditionNo)
        let sym = ''; let conditionNo = ''
        this.symbols.forEach(({ label, value }) => {
          if (value === newVal.lessNo) sym = label
        })
        this.violationOptions.forEach(({ label, value }) => {
          if (value === newVal.conditionNo) conditionNo = label
        })
        if (newVal.conditionNo) {
          this.formData.expresion =
        conditionNo + sym + newVal.lessValue + this.currentUnit
        }
        if (this.formData2.expresion) this.expresion = this.formData.expresion + '\xa0' + '且' + '\xa0' + this.formData2.expresion
        else this.expresion = this.formData.expresion
      },
      deep: true
    },
    formData2: {
      handler(newVal, ov) {
        this.getUnit2(newVal.conditionNo)
        let sym = ''; let conditionNo = ''
        this.symbols.forEach(({ label, value }) => {
          if (value === newVal.lessNo) sym = label
        })
        this.violationOptions.forEach(({ label, value }) => {
          if (value === newVal.conditionNo) conditionNo = label
        })
        if (newVal.conditionNo) {
          this.formData2.expresion =
        conditionNo + sym + newVal.lessValue + this.currentUnit2
        }

        if (this.formData.expresion) this.expresion = this.formData.expresion + '\xa0\xa0' + '且' + '\xa0\xa0' + this.formData2.expresion
        else this.expresion = this.formData2.expresion
      },
      deep: true
    },
    formData3: {
      handler(newVal, ov) {
        this.getUnit3(newVal.conditionNo)
        let sym = ''; let conditionNo = ''
        this.symbols.forEach(({ label, value }) => {
          if (value === newVal.lessNo) sym = label
        })
        this.violationOptions.forEach(({ label, value }) => {
          if (value === newVal.conditionNo) conditionNo = label
        })
        if (newVal.conditionNo) {
          this.formData3.expresion =
        conditionNo + sym + newVal.lessValue + this.currentUnit3
        }

        if (this.formData.expresion && this.formData2.expresion) {
          this.expresion =
        this.formData.expresion +
        '\xa0\xa0' + '且' + '\xa0\xa0' +
        this.formData2.expresion +
        '\xa0\xa0' + '且' + '\xa0\xa0' +
        this.formData3.expresion
        } else if (this.formData.expresion && !this.formData2.expresion) {
          this.expresion =
        this.formData.expresion +
        '\xa0\xa0' + '且' + '\xa0\xa0' +
        this.formData3.expresion
        } else if (!this.formData.expresion && this.formData2.expresion) {
          this.expresion =
        this.formData2.expresion +
        '\xa0\xa0' + '且' + '\xa0\xa0' +
        this.formData3.expresion
        } else this.expresion = this.formData3.expresion
      },
      deep: true
    }
  },
  created() {
    this.getList()
    this.symbols = onlineOption['计算符号'].list
    this.ruleOptions = onlineOption['违章类型编码'].list
    this.degreeOptions = onlineOption['违章严重程度编码'].list
    this.violationOptions = onlineOption['违章条件'].list
    this.degreeValue = this.degreeOptions[0].label
    this.degreeLabel = this.degreeOptions[0].value
  },
  methods: {
    getList() {
      this.listLoading = true
      selectList({ ...this.listQuery })
        .then(res => {
          const { data: { list, total }} = res
          this.list = list
          this.total = total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    getUnit(val) {
      this.violationOptions.forEach(({ value, remark }) => {
        if (value === val) this.currentUnit = remark
      })
    },
    getUnit2(val) {
      this.violationOptions.forEach(({ value, remark }) => {
        if (value === val) this.currentUnit2 = remark
      })
    },
    getUnit3(val) {
      this.violationOptions.forEach(({ value, remark }) => {
        if (value === val) this.currentUnit3 = remark
      })
    },
    updateData(row) {
      this.status = 'update'
      this.currentRow = row
      this.formData = { ...row }
      this.visible = true
      this.$nextTick(_ => {
        this.$refs['formData'].clearValidate()
      })
    },
    spliceUnit(str) {
      let unit = ''
      for (let i = str.length - 1; i >= 0; i--) {
        if (!isNaN(str[i])) break
        unit = str[i] + unit
      }
      return unit
    },
    updateDegree(row) {
      this.degreeVisible = true
      this.currentRow = row
      this.showCol2 = true
      this.showCol3 = true
      this.showCol = true
      selectEdit({
        violationId: row.id.toString(),
        degreeNo: this.degreeLabel
      })
        .then(res => {
          const { data } = res
          if (data.length) {
            this.update = true
            this.currentId = data[0].id.toString()
            this.formData.lessNo = data[0].lessNo
            this.formData.lessValue = data[0].lessValue
            this.formData.conditionNo = data[0].conditionNo
            this.formData.id = data[0].id.toString()
            if (data.length > 1) {
              this.formData2.lessNo = data[1].lessNo
              this.formData2.lessValue = data[1].lessValue
              this.formData2.conditionNo = data[1].conditionNo
              this.formData2.id = data[1].id.toString()
            }
            if (data.length > 2) {
              this.formData3.lessNo = data[2].lessNo
              this.formData3.lessValue = data[2].lessValue
              this.formData3.conditionNo = data[2].conditionNo
              this.formData3.id = data[2].id.toString()
            }
          } else {
            this.update = false
            this.resetFormData()
          }
        })
        .catch(err => {
          throw err
        })
    },
    changeSymbol(val) {
      this.symbols.forEach(({ value, remark }) => {
        if (value === val) this.symbolText = remark
      })
    },
    delData(row) {
      this.$confirm('确定删除该条数据？')
        .then(_ => {
          this.listLoading = true
          deleteData({ id: parseInt(row.id) })
            .then(_ => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.getList()
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
      this.degreeVisible = false
      this.showCol = true
      this.showCol2 = true
      this.showCol3 = true
      this.resetFormData()
    },
    changeDegree(value, label) {
      this.degreeValue = label
      this.degreeLabel = value
      this.showCol = true
      this.showCol2 = true
      this.showCol3 = true
      this.resetFormData()
      selectEdit({
        violationId: this.currentRow.id.toString(),
        degreeNo: value
      })
        .then(res => {
          const { data } = res
          if (data.length) {
            this.update = true
            this.currentId = data[0].id.toString()
            this.formData.lessNo = data[0].lessNo
            this.formData.lessValue = data[0].lessValue
            this.formData.conditionNo = data[0].conditionNo
            this.formData.id = data[0].id.toString()
            if (data.length > 1) {
              this.formData2.lessNo = data[1].lessNo
              this.formData2.lessValue = data[1].lessValue
              this.formData2.conditionNo = data[1].conditionNo
              this.formData2.id = data[1].id.toString()
            }
            if (data.length > 2) {
              this.formData3.lessNo = data[2].lessNo
              this.formData3.lessValue = data[2].lessValue
              this.formData3.conditionNo = data[2].conditionNo
              this.formData3.id = data[2].id.toString()
            }
          } else {
            this.update = false
            this.resetFormData()
          }
        })
        .catch(err => {
          throw err
        })
    },
    addRule() {
      this.status = 'add'
      this.visible = true
      this.$nextTick(_ => {
        this.$refs['formData'].clearValidate()
      })
    },
    saveRule() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          const ruleMap = onlineOption['违章类型编码'].map
          this.formData.violationName = ruleMap[this.formData.violationCode]
          if (this.status === 'update') this.formData.id = this.currentRow.id
          save({ ...this.formData })
            .then(_ => {
              this.visible = false
              this.$message({
                type: 'success',
                message: `${this.type[this.status]}成功！`
              })
              this.resetFormData()
              this.getList()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: `${this.type[this.status]}失败！`
              })
              throw err
            })
        }
      })
    },
    resetFormData() {
      this.formData = {
        expresion: '',
        lessValue: '',
        lessNo: '',
        conditionNo: ''
      }
      this.formData2 = {
        expresion: '',
        lessValue: '',
        lessNo: '',
        conditionNo: ''
      }
      this.formData3 = {
        expresion: '',
        lessValue: '',
        lessNo: '',
        conditionNo: ''
      }
      this.expresion = ''
    },
    saveVio() {
      this.$refs['degreeForm'].validate(valid => {
        if (valid) {
          const req = { violationDegreeValue: [] }
          this.formData.violationId = this.currentRow.id.toString()
          this.formData2.violationId = this.currentRow.id.toString()
          this.formData3.violationId = this.currentRow.id.toString()

          this.formData.degreeNo = this.degreeLabel
          this.formData2.degreeNo = this.degreeLabel
          this.formData3.degreeNo = this.degreeLabel

          if (this.formData.conditionNo) req.violationDegreeValue.push(this.formData)
          if (this.formData2.conditionNo) req.violationDegreeValue.push(this.formData2)
          if (this.formData3.conditionNo) req.violationDegreeValue.push(this.formData3)
          if (this.update) {
            req.id = this.currentId
            updateViolationDegree(req.violationDegreeValue)
              .then(_ => {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
              })
              .catch(err => {
                this.$message({
                  type: 'error',
                  message: '修改失败！'
                })
                throw err
              })
            this.degreeReq.violationDegrees = []
          } else {
            insertViolationDegree(req.violationDegreeValue)
              .then(_ => {
                this.$message({
                  type: 'success',
                  message: '新增成功！'
                })
              })
              .catch(err => {
                this.$message({
                  type: 'error',
                  message: '新增失败！'
                })
                throw err
              })
            this.degreeReq.violationDegrees = []
          }
        }
      })
    },
    deleteCol(index) {
      const arr = this.expresion.split('且').splice(index - 2, 1)
      arr.length > 1 ? this.expresion = arr.join('且') : this.expresion = arr[0]
      if (index === 1) {
        this.showCol = false
        if (this.formData.id) this.deleteVio(parseInt(this.formData.id))
      } else if (index === 2) {
        this.showCol2 = false
        if (this.formData2.id) this.deleteVio(parseInt(this.formData2.id))
      } else {
        this.showCol3 = false
        if (this.formData3.id) this.deleteVio(parseInt(this.formData3.id))
      }
    },
    deleteVio(id) {
      deleteViolationDegreeValue({ id })
        .then(_ => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          throw err
        })
    }
  }
}
</script>
<style scoped>
::v-deep .el-icon-delete {
  cursor: pointer !important;
  margin-left: 10px !important;
  color: #F56C6C !important;
}
</style>
