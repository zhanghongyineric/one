<template>
  <div class="layout-content">
    <el-card>
      <div class="table-page-search-wrapper">
        <el-row :gutter="24">
          <el-form
            :model="listQuery"
            label-width="80px"
          >
            <el-col :md="6" :sm="24">
              <el-form-item label="规则名称:">
                <el-input v-model="listQuery.violationName" size="small" placeholder="请输入规则名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-form-item label="规则类型:">
                <el-select
                  v-model="listQuery.typeFlag"
                  size="small"
                  placeholder="请选择类型"
                  clearable
                >
                  <el-option
                    v-for="{label,value} in ruleTypeOptions"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-form-item label="规则编码:">
                <el-input v-model="listQuery.violationCode" size="small" placeholder="请输入规则编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="24">
              <el-button
                size="small"
                style="margin-bottom: 10px"
                @click="resetQuery"
              >重置</el-button>
              <el-button
                type="primary"
                size="small"
                style="margin-bottom: 10px"
                @click="search"
              >查询</el-button>
              <el-button
                type="primary"
                size="small"
                style="margin-bottom: 10px"
                @click="addRule"
              >新增规则</el-button>
            </el-col>
          </el-form>
        </el-row>

      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        border
        highlight-current-row
        style="width: 100%"
        stripe
      >
        <el-table-column type="index" label="编号" width="60" align="center" />
        <el-table-column prop="violationName" label="规则名称" min-width="150px" align="center" show-overflow-tooltip />
        <el-table-column prop="typeFlag" label="规则类型" min-width="120px" align="center">
          <template v-slot="{row}">
            {{ row.typeFlag | typeFlagFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="script" label="规则描述" min-width="200px" align="center" show-overflow-tooltip />
        <el-table-column prop="violationCode" label="规则编码" min-width="100px" align="center" />
        <el-table-column label="操作" align="center" width="330px">
          <template v-slot="{row}">
            <el-button type="warning" size="mini" @click="updateData(row)">编辑规则</el-button>
            <el-button type="primary" size="mini" :disabled="row.typeFlag !== '2'" @click="updateDegree(row)">违章程度</el-button>
            <el-button type="success" size="mini" @click="ruleDetail(row)">详情</el-button>
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

      <!-- 新增和修改规则弹窗 -->
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
          <el-form-item label="类型：" prop="typeFlag">
            <el-select v-model="formData.typeFlag" placeholder="请选择规则类型" :disabled="status === 'update'">
              <el-option
                v-for="{label,value} in ruleTypeOptions"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="规则名称：" prop="violationName">
            <el-input v-model="formData.violationName" :disabled="status === 'update'" clearable placeholder="请输入规则名称" />
          </el-form-item>
          <el-form-item label="规则编码：" prop="violationCode">
            <el-input v-model="formData.violationCode" :disabled="status === 'update'" clearable placeholder="请输入规则编码" />
          </el-form-item>
          <el-form-item label="规则描述：" prop="script">
            <el-input
              v-model="formData.script"
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

      <!-- 编辑违章程度弹框 -->
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

      <!-- 规则详情弹框 -->
      <el-dialog
        title="详情"
        :visible.sync="detailVisible"
        :close-on-click-modal="false"
        :before-close="closeDialog"
        custom-class="base-dialog dialog-col-1"
        top="100px"
      >
        <el-row :gutter="48">
          <el-col :md="12" class="col-spacing" :style="{color: theme ? '' : '#606266'}">
            <span class="title">规则编码：</span>
            <span>{{ detailData.violationCode }}</span>
          </el-col>
          <el-col :md="12" class="col-spacing" :style="{color: theme ? '' : '#606266'}">
            <span class="title">类型：</span>
            <span>{{ ruleTypeMap[detailData.typeFlag] }}</span>
          </el-col>
          <el-col :md="24" class="col-spacing" :style="{color: theme ? '' : '#606266'}">
            <span class="title">规则名称：</span>
            <span>{{ detailData.violationName }}</span>
          </el-col>
          <el-col :md="24" class="col-spacing" :style="{color: theme ? '' : '#606266'}">
            <span class="title">规则描述：</span>
            <span>{{ detailData.script || '无' }}</span>
          </el-col>
          <el-col
            v-for="{value,label} in degreeOptions"
            :key="value"
            :md="24"
            class="col-spacing"
            :style="{color: theme ? '' : '#606266'}"
          >
            <span class="title">{{ label }}：</span>
            <span>{{ getExpress(value) }}</span>
          </el-col>
        </el-row>
        <div slot="footer">
          <el-button type="primary" @click="detailVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

// 获取字典
const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

import {
  selectList,
  save,
  deleteData,
  selectEdit,
  insertViolationDegree,
  updateViolationDegree,
  deleteViolationDegreeValue,
  violationDetails
} from '@/api/business-manage/rules-manage'
import Pagination from '@/components/Pagination'

let that

export default {
  name: 'RulesManage',
  components: { Pagination },
  filters: {
    typeFlagFilter(type) {
      let text = ''
      that.ruleTypeOptions.forEach(v => {
        if (v.value === type) text = v.label
      })
      return text
    }
  },
  data() {
    return {
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        violationCode: '',
        violationName: '',
        typeFlag: ''
      },
      total: 0,
      listLoading: false,
      visible: false,
      degreeVisible: false,
      detailVisible: false,
      formData: {
        expresion: '',
        lessValue: '',
        lessNo: '',
        conditionNo: '',
        degreeLabel: '',
        violationName: '',
        violationCode: '',
        typeFlag: ''
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
      degreeOptions: [],
      violationOptions: [], // 违章条件 list
      violationMap: {}, // 违章条件 map
      symbols: [], // 运算符 list
      symbolsMap: {}, // 运算符 map
      ruleTypeOptions: [], // 规则类型 list
      ruleTypeMap: null, // 规则类型 map
      degreeValue: '',
      degreeLabel: '',
      type: {
        'update': '更新',
        'add': '新增'
      },
      status: '',
      currentRow: {}, // 当前操作的行数据

      symbolText: '',
      currentUnit: '',
      currentUnit2: '',
      currentUnit3: '',
      showCol2: true,
      showCol3: true,
      showCol: true,
      expresion: '',
      oneRule: {
        violationName: [{ required: true, trigger: 'blur', message: '请输入规则名称' }],
        // script: [{ required: true, trigger: 'blur', message: '请输入规则描述' }],
        typeFlag: [{ required: true, trigger: 'change', message: '请选择规则类型' }],
        violationCode: [{ required: true, trigger: 'blur', message: '请输入规则编码' }]
      },
      degreeRule: {
        expresion: [{ required: true, trigger: 'blur', message: '请配置违章条件' }]
      },
      update: false,
      currentId: '',
      detailData: {}, // 规则详情
      minorViolationExpress: '', // 轻微违章描述
      generalViolationExpress: '', // 一般违章描述
      seriousViolationExpress: '' // 严重违章描述
    }
  },
  computed: {
    theme() {
      const localTheme = localStorage.getItem('theme')
      const stateTheme = this.$store.state.settings.theme
      if (stateTheme !== localTheme) {
        this.$store.commit('settings/CHANGE_THEME', localTheme)
      }
      console.log(localStorage.getItem('theme') === 'dark')
      return localStorage.getItem('theme') === 'dark'
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
    that = this
    this.getList()
    this.symbols = onlineOption['计算符号'].list
    this.symbolsMap = onlineOption['计算符号'].map
    this.degreeOptions = onlineOption['违章严重程度编码'].list
    this.violationOptions = onlineOption['违章条件'].list
    this.violationMap = onlineOption['违章条件'].map
    this.ruleTypeOptions = onlineOption['rule_of_arm_type'].list
    this.ruleTypeMap = onlineOption['rule_of_arm_type'].map
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
    updateDegree(row) {
      this.degreeVisible = true
      this.currentRow = row
      this.showCol2 = true
      this.showCol3 = true
      this.showCol = true
      selectEdit({
        violationCode: row.violationCode,
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
    // 删除违章规则
    delData(row) {
      this.$confirm('确定删除该条数据？')
        .then(_ => {
          this.listLoading = true
          deleteData({ violationCode: row.violationCode })
            .then(_ => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.getList()
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
    // 关闭弹框
    closeDialog() {
      this.visible = false
      this.degreeVisible = false
      this.detailVisible = false
      this.showCol = true
      this.showCol2 = true
      this.showCol3 = true
      this.resetFormData()
    },
    // 切换违章条件
    changeDegree(value, label) {
      this.degreeValue = label
      this.degreeLabel = value
      this.showCol = true
      this.showCol2 = true
      this.showCol3 = true
      this.resetFormData()
      selectEdit({
        violationCode: this.currentRow.violationCode,
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
    // 打开新增规则弹框
    addRule() {
      this.status = 'add'
      this.visible = true
      this.$nextTick(_ => {
        this.$refs['formData'].clearValidate()
      })
    },
    // 保存新增或修改规则
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
              this.$message({
                type: 'error',
                message: `${this.type[this.status]}失败！`
              })
              throw err
            })
        }
      })
    },
    // 重置表数据
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
          this.formData.violationCode = this.currentRow.violationCode
          this.formData2.violationCode = this.currentRow.violationCode
          this.formData3.violationCode = this.currentRow.violationCode

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
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        violationCode: '',
        violationName: '',
        typeFlag: ''
      }
      this.getList()
    },
    // 查询
    search() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 查看规则详情
    ruleDetail(row) {
      violationDetails({ violationCode: row.violationCode })
        .then(res => {
          const { data } = res
          if (data.length > 0) {
            this.detailData = data[0]
            this.setDegreeExpress(data[0])
          }
          this.detailVisible = true
        })
        .catch(err => {
          throw err
        })
    },
    // 通过返回的值，拼出详情中各个违章程度的描述
    setDegreeExpress(data) {
      this.minorViolationExpress = ''
      this.generalViolationExpress = ''
      this.seriousViolationExpress = ''
      data.violationDegreeValues.forEach(item => {
        this.getUnit(item.conditionNo)
        let ans = this.violationMap[item.conditionNo] + ' ' +
          this.symbolsMap[item.lessNo] + ' ' +
          item.lessValue +
          this.currentUnit

        switch (item.degreeNo) {
          case '621000':
            if (this.minorViolationExpress) ans = ' 且 ' + ans
            this.minorViolationExpress += ans
            break
          case '622000':
            if (this.generalViolationExpress) ans = ' 且 ' + ans
            this.generalViolationExpress += ans
            break
          case '623000':
            if (this.seriousViolationExpress) ans = ' 且 ' + ans
            this.seriousViolationExpress += ans
            break
          default: break
        }
      })
    },
    // 获取对应的违章描述
    getExpress(value) {
      switch (value) {
        case '621000':
          return this.minorViolationExpress
        case '622000':
          return this.generalViolationExpress
        case '623000':
          return this.seriousViolationExpress
        default: return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-icon-delete {
  cursor: pointer !important;
  margin-left: 10px !important;
  color: #F56C6C !important;
}

.col-spacing {
  margin-bottom: 20px;
  color: #fff;
  font-weight: 700;

  .title {
    font-size: 15px;
  }
}
</style>
