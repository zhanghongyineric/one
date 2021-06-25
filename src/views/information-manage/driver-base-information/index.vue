<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="110px" size="small">
          <el-row :gutter="48">
            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="所属地区:">
                <el-cascader v-model="listQuery.zoneCity" size="small" :options="cityOptions" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="从业资格范围:">
                <el-select v-model="listQuery.qualificationRange" placeholder="请选择从业资格范围">
                  <el-option
                    v-for="item in qualificationRangeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="状态:">
                  <el-select v-model="listQuery.status" placeholder="请选择状态">
                    <el-option
                      v-for="item in driverStatusOption"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :md="8" :sm="24">
                <el-form-item label="从业资格证初领日期:">
                  <el-select v-model="listQuery.accountType" placeholder="请选择从业资格证初领日期">
                    <el-option
                      v-for="item in accessPlatformKinds"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col> -->
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                style="margin-top: -4px"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="getList">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="tableData"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="50" />
        <el-table-column prop="personName" label="名字" min-width="100" show-overflow-tooltip />
        <el-table-column prop="code" label="性别" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sex === '1'">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column prop="zoneCity" label="籍贯" min-width="110" show-overflow-tooltip />
        <el-table-column prop="driverVelType" label="准驾类型" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ velTypeMap.get(scope.row.driverVelType) }}
          </template>
        </el-table-column>
        <el-table-column prop="qualificationRange" label="从业资格范围" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.qualificationRange == 0">其他范围</span>
            <span v-else-if="scope.row.qualificationRange == 1">道路旅客运输</span>
            <span v-else-if="scope.row.qualificationRange == 2">道路货物运输</span>
            <span v-else-if="scope.row.qualificationRange == 3">道路危险品运输</span>
          </template>
        </el-table-column>
        <el-table-column prop="idCardNum" label="身份证号" min-width="180" />
        <!-- <el-table-column prop="unitId" label="所属企业ID" min-width="130" /> -->
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn"
              type="primary"
              size="small"
              @click="showDetails(scope.row)"
            >查看详情</el-button>
            <el-button
              class="btn"
              type="warning"
              size="small"
              @click="modifyData(scope.row)"
            >更新信息</el-button>
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
        :title="showTitle()"
        :visible.sync="dialogVisible"
        top="20px"
        :before-close="closeDialog"
      >
        <!-- 弹框上方步骤条 -->
        <el-steps :active="stepIndex" align-center>
          <el-step title="基本信息" />
          <el-step title="机动车驾驶证信息" />
          <el-step title="从业资格证信息" />
        </el-steps>

        <!-- 基本信息 -->
        <el-form
          v-show="stepIndex === 1"
          ref="oneForm"
          :rules="oneRules"
          :model="dialogData"
          label-width="120px"
          style="margin-top: 20px"
          :disabled="detail"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="姓名：" prop="personName">
                <el-input v-model="dialogData.personName" placeholder="请输入姓名" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="性别：" prop="sex">
                <!-- <el-checkbox-group
                  v-model="dialogData.sex"
                  :max="1"
                >
                  <el-checkbox label="男" />
                  <el-checkbox label="女" />
                </el-checkbox-group> -->
                <el-select
                  v-model="dialogData.sex"
                  placeholder="请选择性别"
                  size="small"
                >
                  <el-option key="1" label="男" value="1" />
                  <el-option key="2" label="女" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="民族：" prop="nation">
                <el-input v-model="dialogData.nation" placeholder="请输入民族" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="文化程度：" prop="culture">
                <el-select v-model="dialogData.culture" size="small" placeholder="请选择文化程度">
                  <el-option
                    v-for="item in cultureOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="籍贯：" prop="zoneCity">
              <el-cascader
                v-model="dialogData.zoneCity"
                size="small"
                :options="cityOptions"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="健康状况：" prop="physicalStatus">
                <el-select v-model="dialogData.physicalStatus" size="small" placeholder="请选择健康状况">
                  <el-option key="1" label="健康" value="1" />
                  <el-option key="2" label="不健康" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="身份证号码：" prop="idCardNum">
                <el-input v-model="dialogData.idCardNum" placeholder="请输入身份证号码" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="手机号码：" prop="tel">
                <el-input v-model="dialogData.tel" placeholder="请输入手机号码" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="所属运输企业：" prop="unitId">
                <el-autocomplete
                  v-model="dialogData.unitId1"
                  :fetch-suggestions="searchType"
                  placeholder="请输入企业名称关键字"
                  :debounce="500"
                  size="small"
                  @select="selectCompany"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="所属地区：" prop="qualificationCity">
              <el-cascader
                v-model="dialogData.qualificationCity"
                size="small"
                :options="cityOptions"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="居住地址：" prop="addressCity">
              <el-cascader
                v-model="dialogData.addressCity"
                size="small"
                :options="cityOptions"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="详细居住地址：" prop="addressDetail">
              <el-input v-model="dialogData.addressDetail" placeholder="请输入详细居住地址" size="small" />
            </el-form-item>
          </el-row>
          <!-- <div style="margin-left: 23px;margin-bottom: 30px">
            <p><b>上传证件照：</b></p>
            <el-upload
              ref="upload"
              action
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              :on-change="previewImg"
              :on-remove="handleRemove"
              :before-upload="previewImg"
              :file-list="fileList"
            >
              <i slot="default" class="el-icon-plus" />
            </el-upload>
          </div> -->
        </el-form>
        <!-- 机动车驾驶证信息 -->
        <el-form
          v-show="stepIndex === 2"
          ref="twoForm"
          :rules="twoRules"
          :model="dialogData"
          label-width="140px"
          style="margin-top: 20px"
          :disabled="detail"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="机动车驾驶证号：" prop="driverLicNum">
                <el-input v-model="dialogData.driverLicNum" placeholder="请输入机动车驾驶证号" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="准驾车型：" prop="driverVelType">
                <el-select v-model="dialogData.driverVelType" size="small" placeholder="请选择准驾车型">
                  <el-option
                    v-for="item in driverVelTyeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="初次领证日期：" prop="firstDate">
                <el-date-picker
                  v-model="dialogData.firstDate"
                  type="date"
                  placeholder="初次领证日期"
                  size="small"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效期开始日期：" prop="validDate">
                <el-date-picker
                  v-model="dialogData.validDate"
                  type="date"
                  placeholder="有效期开始日期"
                  size="small"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效期截止日期：" prop="loseDate">
                <el-date-picker
                  v-model="dialogData.loseDate"
                  type="date"
                  placeholder="有效期截止日期"
                  size="small"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="发证机关：" prop="licAuthor">
                <el-input v-model="dialogData.licAuthor" placeholder="请输入发证机关" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 从业资格证信息 -->
        <el-form
          v-show="stepIndex === 3"
          ref="threeForm"
          :rules="threeRules"
          :model="dialogData"
          label-width="140px"
          style="margin-top: 20px"
          :disabled="detail"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="从业资格证号：" prop="qualificationNum">
                <el-input v-model="dialogData.qualificationNum" placeholder="请输入从业资格证号" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="从业资格证类型：" prop="qualificationType">
                <el-select v-model="dialogData.qualificationType" size="small" placeholder="请选择从业资格证类型">
                  <el-option
                    v-for="item in queryQualificationOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="从业资格范围：" prop="qualificationRange">
                <el-select v-model="dialogData.qualificationRange" size="small" placeholder="请选择从业资格范围">
                  <el-option
                    v-for="item in qualificationRangeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="初次领证日期：" prop="qualificationFirstDate">
                <el-date-picker
                  v-model="dialogData.qualificationFirstDate"
                  type="date"
                  size="small"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="初次领证日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效期开始日期：" prop="qualificationValidDate">
                <el-date-picker
                  v-model="dialogData.qualificationValidDate"
                  type="date"
                  placeholder="有效期开始日期"
                  size="small"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效期截止日期：" prop="qualificationLoseDate">
                <el-date-picker
                  v-model="dialogData.qualificationLoseDate"
                  type="date"
                  placeholder="有效期截止日期"
                  size="small"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="营运状态：" prop="status">
                <el-select v-model="dialogData.status" size="small" placeholder="请选择营运状态">
                  <el-option
                    v-for="item in driverStatusOption"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="发证机关：" prop="qualificationAuthor">
                <el-input v-model="dialogData.qualificationAuthor" placeholder="请输入发证机关" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span style="margin-left: 35%">
          <el-button v-show="stepIndex !== 1" type="primary" @click="lastStep()">上一步</el-button>
          <el-button v-show="stepIndex !== 3" type="primary" @click="nextStep()">下一步</el-button>
          <el-button v-show="stepIndex === 3 && !detail" type="primary" @click="submit()">保存</el-button>
          <el-button v-show="stepIndex === 3 && detail" type="danger" @click="delData()">删除</el-button>
          <el-button type="primary" @click="closeDialog()">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
import Pagination from '@/components/Pagination'
import {
  qualificationRangeOption,
  cultureOptions,
  driverVelTyeOptions
} from '@/options'
import {
  selectList,
  driverSave,
  selectDriverLic,
  selectQualificationLic,
  deleteDriver,
  queryQualification,
  enterpriseName,
  driverStatus
} from '@/api/information-manage/driver-base-information'
import { upload } from '@/api/information-manage/service-provider'

export default {
  name: 'DriverBaseInformation',
  components: { Pagination },
  data() {
    return {
      queryQualificationOptions: [],
      driverVelTyeOptions: driverVelTyeOptions.list,
      velTypeMap: new Map(),
      cultureOptions: cultureOptions.list,
      cityOptions: regionData,
      qualificationRangeOption: qualificationRangeOption.list,
      driverStatusOption: [],
      advanced: false,
      listLoading: false,
      total: 1,
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        personName: '',
        zoneCity: null,
        status: '',
        qualificationRange: ''
      },
      dialogVisible: false,
      tableData: [],
      oneRules: {
        personName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        nation: [{ required: true, message: '请输入民族', trigger: 'blur' }],
        culture: [{ required: true, message: '请选择文化程度', trigger: 'change' }],
        zoneCity: [{ required: true, message: '请选择籍贯', trigger: 'change' }],
        physicalStatus: [{ required: true, message: '请选择健康状况', trigger: 'change' }],
        idCardNum: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }],
        tel: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        unitId1: [{ required: true, message: '请输入运输企业', trigger: 'blur' }],
        qualificationCity: [{ required: true, message: '请选择所属地区', trigger: 'change' }],
        addressCity: [{ required: true, message: '请选择居住地址', trigger: 'change' }],
        addressDetail: [{ required: true, message: '请输入详细居住地址', trigger: 'blur' }]
      },
      twoRules: {
        driverLicNum: [{ required: true, message: '请输入机动车驾驶证号', trigger: 'blur' }],
        driverVelType: [{ required: true, message: '请选择准驾车型', trigger: 'change' }],
        firstDate: [{ required: true, message: '请输入初次领证日期', trigger: 'blur' }],
        validDate: [{ required: true, message: '请输入有效期开始日期', trigger: 'blur' }],
        loseDate: [{ required: true, message: '请输入有效期截止日期', trigger: 'blur' }],
        licAuthor: [{ required: true, message: '请输入发证机关', trigger: 'blur' }]
      },
      threeRules: {
        qualificationNum: [{ required: true, message: '请输入从业资格证号', trigger: 'blur' }],
        qualificationType: [{ required: true, message: '请选择从业资格证类型', trigger: 'change' }],
        qualificationRange: [{ required: true, message: '请选择从业资格范围', trigger: 'change' }],
        status: [{ required: true, message: '请选择营运状态', trigger: 'change' }],
        qualificationFirstDate: [{ required: true, message: '请输入初次领证日期', trigger: 'blur' }],
        qualificationValidDate: [{ required: true, message: '请输入有效期开始日期', trigger: 'blur' }],
        qualificationLoseDate: [{ required: true, message: '请输入有效期截止日期', trigger: 'blur' }],
        qualificationAuthor: [{ required: true, message: '请输入发证机关', trigger: 'blur' }]
      },
      dialogData: {
        personName: '',
        sex: '',
        zoneCity: '',
        idCardNum: '',
        nation: '',
        tel: '',
        culture: '',
        status: '',
        personPic: '',
        unitId: '',
        physicalStatus: '',
        addressDetail: '',
        addressCity: '',
        qualificationCity: ''
      },
      fileList: [],
      imgsFiles: [],
      stepIndex: 1,
      detail: false,
      modify: false,
      currentRow: {},
      imgsUpload: []
    }
  },
  created() {
    this.getQueryQualification()
    this.getDriverStatus()
    this.setVelTypeMap()
  },
  mounted() {
    this.getList()
  },
  methods: {
    setVelTypeMap() {
      driverVelTyeOptions.list.forEach(item => {
        this.velTypeMap.set(item.value, item.label)
      })
    },
    getDriverStatus() {
      driverStatus()
        .then(res => {
          const { data } = res
          this.driverStatusOption = data
        })
        .catch(err => {
          throw err
        })
    },
    searchType(queryString, cb) {
      if (queryString) {
        enterpriseName({ unitName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.unitName
              item.value = item.unitName
            })
            cb(data)
          })
          .catch(err => {
            throw err
          })
      } else {
        cb([])
        return
      }
    },
    selectCompany(val) {
      this.dialogData.unitId = val.id
    },
    getQueryQualification() {
      queryQualification()
        .then(res => {
          const { data } = res
          data.forEach(item => {
            this.queryQualificationOptions.push(item)
          })
        })
        .catch(err => {
          throw err
        })
    },
    showDetails(row) {
      this.currentRow = row
      this.dialogVisible = true
      this.detail = true
      this.getLicInfo(row)
      this.clearValidate()
    },
    // 获取驾驶证和资格证信息
    getLicInfo(row) {
      const reqArr = []
      reqArr.push(selectDriverLic({ personId: JSON.stringify(row.id) }))
      reqArr.push(selectQualificationLic({ personId: JSON.stringify(row.id) }))
      Promise.all(reqArr)
        .then(res => {
          this.dialogData = { ...row, ...res[0].data, ...res[1].data }
          this.dialogData.qualificationRange = this.dialogData.qualificationRange.toString()
        })
        .catch(err => {
          throw err
        })
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs['oneForm'].clearValidate()
        this.$refs['twoForm'].clearValidate()
        this.$refs['threeForm'].clearValidate()
      })
    },
    delData() {
      this.$confirm('确定删除该条数据？删除后不可恢复')
        .then(() => {
          deleteDriver({ id: this.currentRow.id })
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.dialogVisible = false
              this.getList()
            })
            .catch(err => {
              throw err
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
        })
    },
    showTitle() {
      if (this.detail && !this.modify) return '详情'
      else if (!this.detail && this.modify) return '修改'
      else if (!this.detail && !this.modify) return '新增'
    },
    modifyData(row) {
      this.stepIndex = 1
      this.currentRow = row
      this.dialogVisible = true
      this.modify = true
      this.detail = false
      this.getLicInfo(row)
      this.clearValidate()
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.zoneCity) this.listQuery.zoneCity = parseInt(this.listQuery.zoneCity[1])
      selectList({ ...this.listQuery })
        .then(res => {
          const { data } = res
          this.tableData = data.list
          this.tableData.forEach(item => {
            if (CodeToText[item.zoneCity.toString()]) {
              item.zoneCity = CodeToText[item.zoneCity.toString()]
            }
          })
          this.total = data.total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    handleCreate() {
      this.dialogVisible = true
      this.clearValidate()
    },
    resetQuery() {
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        personName: '',
        zoneCity: null,
        status: '',
        qualificationRange: ''
      }
      this.getList()
    },
    handleSearch() {},
    previewImg(file) {
      this.imgsFiles.push(file.raw)
      this.fileList.push(file)
    },
    handleRemove(file) {
      if (!file.raw) {
        this.fileList.forEach((item, index) => {
          if (file.url === item.url) {
            this.fileList.splice(index, 1)
          }
        })
      } else {
        this.imgsFiles.forEach((item, index) => {
          if (file.raw.uid === item.uid) {
            this.imgsFiles.splice(index, 1)
          }
        })
      }
    },
    lastStep() {
      this.stepIndex -= 1
    },
    nextStep() {
      if (!this.detail) {
        if (this.stepIndex === 1) {
          this.$refs['oneForm'].validate(valid => {
            if (valid) {
              this.stepIndex += 1
            }
          })
        } else if (this.stepIndex === 2) {
          this.$refs['twoForm'].validate(valid => {
            if (valid) {
              this.stepIndex += 1
            }
          })
        }
      } else {
        this.stepIndex += 1
      }
    },
    dataChange() {
      this.dialogData.zoneCity = parseInt(this.dialogData.zoneCity[1])
      this.dialogData.addressCity = parseInt(this.dialogData.addressCity[1])
      this.dialogData.qualificationCity = parseInt(this.dialogData.qualificationCity[1])
      this.dialogData.qualificationRange = parseInt(this.dialogData.qualificationCity)
    },
    submit() {
      this.$refs['threeForm'].validate(valid => {
        if (valid) {
          this.listLoading = true

          const form = new FormData()
          form.append('fileName', this.imgsFiles[0])
          this.imgsUpload.push(upload(form))

          Promise.all(this.imgsUpload)
            .then(res => {
              this.dataChange()
              if (this.modify) {
                this.dialogData.updator = this.$store.state.user.name
                this.dialogData.id = this.currentRow.id
              }
              driverSave({ ...this.dialogData })
                .then(res => {
                  this.dialogVisible = false
                  this.$message({
                    type: 'success',
                    message: '新增成功！'
                  })
                  this.getList()
                })
                .catch(err => {
                  throw err
                })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '图片过大，上传失败'
              })
              throw err
            })
        }
      })
    },
    closeDialog() {
      this.dialogData = {}
      this.stepIndex = 1
      this.dialogVisible = false
      // 不设置延时的话，点击关闭的一瞬间，弹框标题会改变，影响观感
      setTimeout(() => {
        this.detail = false
        this.modify = false
      }, 500)
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding: 20px 20px;
}
</style>
