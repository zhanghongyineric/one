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
        <el-table-column type="index" label="编号" width="100" />
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
            <el-select v-model="formData.violationName" placeholder="请选择规则名称">
              <el-option
                v-for="{label, value} in ruleOptions"
                :key="label"
                :label="value"
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
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="closeDialog">取消</el-button>
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
            <!-- <el-button
              v-for="{value,label} in degreeOptions"
              :key="label"
              type="primary"
              size="small"
              icon="el-icon-setting"
              @click="changeDegree(value,label)"
            >{{ value }}</el-button> -->

            <el-select
              v-model="degreeLabel"
              size="small"
            >
              <el-option
                v-for="{value,label} in degreeOptions"
                :key="label"
                :value="label"
                :label="value"
                @click.native="changeDegree(value,label)"
              />
            </el-select>

          </el-form-item>
          <el-form-item :label="`${degreeValue}条件：`" prop="script">
            <el-row>
              <el-col>
                <el-select
                  v-model="formData.conditionNo"
                  size="small"
                  style="width: 150px"
                  @change="getUnit"
                >
                  <el-option
                    v-for="{label, value, remark} in violationOptions"
                    :key="label"
                    :label="`${value}(${remark})`"
                    :value="label"
                  />
                </el-select>

                <el-select v-model="formData.lessNo" size="small" style="width: 100px" @change="changeSymbol">
                  <el-option
                    v-for="{label, value} in symbols"
                    :key="label"
                    :label="value"
                    :value="label"
                  />
                </el-select>
                <el-input v-model="formData.lessValue" size="small" style="width: 100px" placeholder="请输入" />
              </el-col>
              <el-col v-show="showCol">
                <el-select v-model="backup.conditionNo" size="small" style="width: 150px" @change="getUnit2">
                  <el-option
                    v-for="{label, value, remark} in violationOptions"
                    :key="label"
                    :label="`${value}(${remark})`"
                    :value="label"
                  />
                </el-select>

                <el-select v-model="backup.lessNo" size="small" style="width: 100px">
                  <el-option
                    v-for="{label, value} in symbols"
                    :key="label"
                    :label="value"
                    :value="label"
                  />
                </el-select>
                <el-input v-model="backup.lessValue" size="small" style="width: 100px" placeholder="请输入" />
                <!-- <i class="el-icon-delete" @click="deleteCol" /> -->
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="描述：" prop="expresion">
            <el-input v-model="expresion" disabled type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveVio">确定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import {
  selectList,
  save,
  deleteData,
  selectEdit,
  insertViolationDegree,
  updateViolationDegree
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
        degreeLabel: ''
      },
      backup: {
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
      showCol: true,
      expresion: '',
      degreeReq: {
        violationDegrees: []
      },
      oneRule: {
        violationName: [{ required: true, trigger: 'change', message: '请选择规则名称' }],
        script: [{ required: true, trigger: 'blur', message: '请输入规则描述' }]
      },
      degreeRule: {
        // degreeLabel: [{ required: true, trigger: 'change', message: '请选择违章程度' }],
        expresion: [{ required: true, trigger: 'blur', message: '请配置违章条件' }]
      },
      update: false,
      currentId: ''
    }
  },
  watch: {
    formData: {
      handler(newVal, oldVal) {
        let sym = ''; let conditionNo = ''
        this.symbols.forEach(({ label, value }) => {
          if (label === newVal.lessNo) sym = value
        })
        this.violationOptions.forEach(({ label, value }) => {
          if (label === newVal.conditionNo) conditionNo = value
        })
        if (newVal.conditionNo) {
          this.formData.expresion =
        conditionNo + sym + newVal.lessValue + this.currentUnit
        }
        if (this.backup.expresion) this.expresion = this.formData.expresion + '\xa0' + '且' + '\xa0' + this.backup.expresion
        else this.expresion = this.formData.expresion
      },
      deep: true
    },
    backup: {
      handler(newVal, ov) {
        let sym = ''; let conditionNo = ''
        this.symbols.forEach(({ label, value }) => {
          if (label === newVal.lessNo) sym = value
        })
        this.violationOptions.forEach(({ label, value }) => {
          if (label === newVal.conditionNo) conditionNo = value
        })
        if (newVal.conditionNo) {
          this.backup.expresion =
        conditionNo + sym + newVal.lessValue + this.currentUnit2
        }

        if (this.backup.expresion) this.expresion = this.formData.expresion + '\xa0\xa0' + '且' + '\xa0\xa0' + this.backup.expresion
        else this.expresion = this.formData.expresion
      },
      deep: true
    }
  },
  created() {
    this.getList()
    this.symbols = JSON.parse(localStorage.getItem('onlineOption'))['计算符号'].list
    this.ruleOptions = JSON.parse(localStorage.getItem('onlineOption'))['违章类型编码'].list
    this.degreeOptions = JSON.parse(localStorage.getItem('onlineOption'))['违章严重程度编码'].list
    this.violationOptions = JSON.parse(localStorage.getItem('onlineOption'))['违章条件'].list
    this.degreeValue = this.degreeOptions[0].value
    this.degreeLabel = this.degreeOptions[0].label
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
      this.violationOptions.forEach(({ label, remark }) => {
        if (label === val) this.currentUnit = remark
      })
    },
    getUnit2(val) {
      this.violationOptions.forEach(({ label, remark }) => {
        if (label === val) this.currentUnit2 = remark
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
    updateDegree(row) {
      this.degreeVisible = true
      this.currentRow = row
      this.showCol = true
      selectEdit({
        violationNo: row.id.toString(),
        degreeNo: this.degreeLabel
      })
        .then(res => {
          const { data } = res
          if (data.length) {
            this.update = true
            this.expresion = data[0].expresion
            this.currentId = data[0].id.toString()
            this.formData.lessNo = data[0].violationDegreeValues[0].lessNo
            this.formData.conditionNo = data[0].violationDegreeValues[0].conditionNo
            this.formData.lessValue = data[0].violationDegreeValues[0].lessValue
            this.formData.id = data[0].violationDegreeValues[0].id.toString()
            if (data[0].violationDegreeValues.length > 1) {
              this.backup.lessNo = data[0].violationDegreeValues[1].lessNo
              this.backup.lessValue = data[0].violationDegreeValues[1].lessValue
              this.backup.conditionNo = data[0].violationDegreeValues[1].conditionNo
              this.backup.id = data[0].violationDegreeValues[1].id.toString()
            } else {
              this.showCol = false
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
      this.resetFormData()
    },
    changeDegree(value, label) {
      this.degreeValue = value
      this.degreeLabel = label
      this.showCol = true
      this.resetFormData()
      selectEdit({
        violationNo: this.currentRow.id.toString(),
        degreeNo: label
      })
        .then(res => {
          const { data } = res
          if (data.length) {
            this.update = true
            this.expresion = data[0].expresion
            this.currentId = data[0].id.toString()
            this.formData.lessNo = data[0].violationDegreeValues[0].lessNo
            this.formData.lessValue = data[0].violationDegreeValues[0].lessValue
            this.formData.conditionNo = data[0].violationDegreeValues[0].conditionNo
            this.formData.id = data[0].violationDegreeValues[0].id.toString()
            if (data[0].violationDegreeValues.length > 1) {
              this.backup.lessNo = data[0].violationDegreeValues[1].lessNo
              this.backup.lessValue = data[0].violationDegreeValues[1].lessValue
              this.backup.conditionNo = data[0].violationDegreeValues[1].conditionNo
              this.backup.id = data[0].violationDegreeValues[1].id.toString()
            } else {
              this.showCol = false
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
              // this.$message({
              //   type: 'error',
              //   message: `${this.type[this.status]}失败！`
              // })
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
      this.backup = {
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
          const req = {
            degreeNo: this.degreeLabel,
            expresion: this.expresion,
            violationNo: this.currentRow.id.toString(),
            violationDegreeValues: []
          }
          this.formData.violationNo = this.currentRow.id.toString()
          this.backup.violationNo = this.currentRow.id.toString()
          this.backup.degreeNo = this.degreeLabel
          this.formData.degreeNo = this.degreeLabel
          req.violationDegreeValues.push(this.formData)
          if (this.backup.conditionNo) req.violationDegreeValues.push(this.backup)
          this.degreeReq.violationDegrees.push(req)
          if (this.update) {
            req.id = this.currentId
            updateViolationDegree(this.degreeReq)
              .then(_ => {
                // this.degreeVisible = false
                // this.resetFormData()
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
          } else {
            insertViolationDegree(this.degreeReq)
              .then(_ => {
                // this.degreeVisible = false
                // this.resetFormData()
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
          }
        }
      })
    },
    // addViolation() {

    // },
    deleteCol() {
      this.showCol = false
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
