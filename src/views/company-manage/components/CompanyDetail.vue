<!--
  - FileName: 企业详情页面/安全码风险看板
  - @author: ZhouJiaXing
  - @date: 2021/4/12 下午5:03
  -->

<template>
  <div
    v-loading.lock="pageLoading"
    class="outer"
  >
    <div :style="{visibility:pageLoading?'none':'visible'}" class="layout-content detail-page f jc-sb">

      <!--左侧区域-->
      <div class="left">
        <!--企业信息-->
        <el-card class="box-card unit-info">
          <div slot="header" class="title">
            <span>
              {{ companyInfo.year || '-' }}年{{ companyInfo.month || '-' }}月第{{
                companyInfo.weekOfMouth || '-'
              }}周 (10~16日)
            </span>
            <el-link class="right-link" :underline="false" @click="showMore">历史周期 ></el-link>
          </div>
          <div class="info">
            <div class="f" style="margin-bottom: 20px;">
              <div class="code">
                <svg-icon
                  class="safe-code"
                  icon-class="code"
                  :style="{color: getCodeColor(companyInfo.safeLevelWeightId)}"
                />
              </div>
              <div class="base-info">
                <p class="level-name" :style="companyInfo.safeLevelWeightId|getColorById">{{ companyInfo.safeLevelWeightId|getLevelNameById }}风险</p>
                <el-tooltip :content="companyInfo.unitName || '-'" placement="top">
                  <p
                    class="ellipsis"
                  >企业名称:{{ companyInfo.unitName || '-' }}
                  </p>
                </el-tooltip>
                <p>企业性质：{{ companyInfo.unitCategory || '-' }}</p>

                <p class="f">负责人：
                  <span style="margin-right: 15px;">{{ companyInfo.legalPerson || '-' }}</span>
                  <span>{{ companyInfo.unitTel || '-' }}</span>
                </p>
              </div>
            </div>
            <div class="other-info">
              <p>行政区域：{{ companyInfo.unitPlace || '-' }}</p>
              <p
                class="ellipsis"
              >企业地址：{{ companyInfo.address || '-' }}
              </p>

            </div>
          </div>

        </el-card>

        <!--本周期驾驶员安全码占比-->
        <el-card class="box-card week-code-radio">
          <div slot="header" class="title">
            <span>上周期驾驶员安全码统计</span>
            <el-link class="right-link" :underline="false" @click="showMore">驾驶员详情 ></el-link>
          </div>
          <div class="pie-chart">
            <p v-if="weekChartData.length === 0" class="tip">暂无数据</p>
            <PieChart height="260px" width="438px" :chart-data="weekChartData" />
          </div>
          <el-table
            ref="driverTable"
            :data="tableData"
            :show-header="false"
          >
            <el-table-column
              v-slot="{row}"
              prop="code"
              label="名称"
              width="50"
            >
              <svg-icon
                icon-class="code"
                :style="{color: getCodeColor(row.codeId),fontSize:20}"
              />
            </el-table-column>
            <el-table-column
              v-slot="{row}"
              prop="count"
              label="增减"
            >
              <span style="display:inline-block;margin-right: 5px;width: 50px;text-align: right">{{
                Math.abs(row.count)
              }}</span>
              <i v-if="row.count>0" class="el-icon-top" style="color: red" />
              <i v-else-if="row.count<0" class="el-icon-bottom" style="color: green" />
              <i v-else class="el-icon-minus" style="color: black" />
            </el-table-column>
            <el-table-column
              v-slot="{row}"
              prop="radio"
              label="比例"
              min-width="120"
            >
              {{ row.radio | radioFilter }}
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <el-link
                type="primary"
                style="width: 50px;text-align: center"
                @click="showMore"
              >
                详情 >
              </el-link>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!--中间区域-->
      <div class="medium">

        <!--安全周报-->
        <el-card class="box-card week-report">
          <div slot="header" class="title">
            <span>本周期驾驶员安全码变化</span>
            <el-link class="right-link" :underline="false" @click="showMore">更多 ></el-link>
          </div>
          <div class="content">
            <p style="margin-top: 0;">2021/05/10 00:01:00 </p>
            <p>上一周期，企业驾驶员红码占比达到21% ，企业安全码转为 红码 ，风险上升</p>
            <p>发生最多的扣分行为是 超速驾驶 。共有 10人 因此扣分</p>
            <p>上周期有10人 的安全码由低风险转为高风险，其中有 10人 安全码转为了红色。</p>
            <p>本周有10人 的安全码连续为红码，请提醒注意驾驶规范，提高安全意识。有 10人 安全码连续为绿码，继续保持，再接再励。</p>
          </div>
        </el-card>

        <!--连续红码驾驶员-->
        <el-card class="box-card red-code-driver">
          <div slot="header" class="title">
            <span>连续红码驾驶员</span>
            <el-link class="right-link" :underline="false" @click="showMore">更多 ></el-link>
          </div>
          <div class="content">
            <el-table
              :data="redCodeDriverTableData"
              style="width: 100%"
            >
              <el-table-column
                label="排序"
                type="index"
                width="50"
                align="left"
              />
              <el-table-column
                prop="driver"
                label="驾驶员"
              />
              <el-table-column
                v-slot="{row}"
                prop="continueWeek"
                label="连续周期"
              >
                {{ row.continueWeek }}周
              </el-table-column>
              <el-table-column
                v-slot="{row}"
                prop="weekIllegal"
                label="本周违章"
              >
                {{ row.weekIllegal }}条
              </el-table-column>
              <el-table-column
                v-slot="{row}"
                prop="weekPoint"
                label="本周扣分"
              >
                {{ row.weekPoint }}分
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <!--连续绿码驾驶员-->
        <el-card class="box-card green-code-driver">
          <div slot="header" class="title">
            <span>连续绿码驾驶员</span>
            <el-link class="right-link" :underline="false" @click="showMore">更多 ></el-link>
          </div>
          <div class="content">
            <el-table
              :data="greenCodeDriverTableData"
              style="width: 100%"
            >
              <el-table-column
                label="排序"
                type="index"
                width="50"
                align="left"
              />
              <el-table-column
                prop="driver"
                label="驾驶员"
              />
              <el-table-column
                v-slot="{row}"
                prop="continueWeek"
                label="连续周期"
              >
                {{ row.continueWeek }}周
              </el-table-column>
              <el-table-column
                v-slot="{row}"
                prop="weekIllegal"
                label="本周违章"
              >
                {{ row.weekIllegal }}条
              </el-table-column>
              <el-table-column
                v-slot="{row}"
                prop="weekPoint"
                label="本周扣分"
              >
                {{ row.weekPoint }}分
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>

      <!--右侧区域-->
      <div class="right">

        <!--企业季度安全码占比-->
        <el-card class="box-card quarter-code-radio">
          <div slot="header" class="title">
            <span>季度驾驶员安全码占比</span>
          </div>
          <div class="pie-chart">
            <PieChart height="300px" :chart-data="monthChartData" />
          </div>
        </el-card>

        <!--驾驶员/企业安全码变化趋势-->
        <el-card class="box-card unit-code-change">
          <div slot="header" class="title">
            <span>驾驶员安全码变化趋势</span>
          </div>
          <div class="chart">
            <div class="safe-code-change" style="width: 100%;">
              <p v-if="lineChart.length === 0" class="tip">暂无数据</p>
              <LineChart width="100%" height="230px" :chart-data="lineChart" />
            </div>
          </div>

          <div class="company-title">
            <span>企业安全码变化趋势</span>
          </div>
          <div class="content" style="margin-top: 20px">
            <StepLineChart height="200px" :chart-data="stepChart" />
          </div>
        </el-card>

      </div>

      <!--完善信息弹窗-->
      <el-dialog
        v-if="dialogFormVisible"
        title="请完善基本信息"
        :visible.sync="dialogFormVisible"
        custom-class="base-dialog dialog-col-1 perfect-info"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="90px"
        >
          <p style="color: #F56C6C">注意：企业行政区域与地址必须和实际地址一致，如存在乱选地址被相应的监管部门巡查到与实际地址不匹配，自行承担相应责任</p>
          <el-form-item label="负责人:" prop="legalPerson">
            <el-input v-model="createFormData.legalPerson" placeholder="请输入负责人" />
          </el-form-item>
          <el-form-item label="企业电话:" prop="unitTel">
            <el-input v-model="createFormData.unitTel" placeholder="请输入企业电话" />
          </el-form-item>

          <!--区域选择-->
          <el-form-item label="行政区域:" prop="areaCode">
            <AreaSelect v-model="createFormData.areaCode" size="large" :area-text.sync="createFormData.area" />
          </el-form-item>
          <el-form-item label="企业地址:" prop="address" class="address">
            <el-input
              v-model="createFormData.address"
              placeholder="请通过右侧选点确定企业地址"
              disabled
            />
            <ChoosePoint :infos="createFormData" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="buttonLoading" @click="finishInfo">
            保存
          </el-button>
        </div>

      </el-dialog>
    </div>
  </div>
</template>

<script>
import PieChart from '../components/PieChart'
import LineChart from '../components/LineChart'
import StepLineChart from '../components/StepLineChart'
import {
  fetchCompany,
  fetchLineChart,
  fetchWeekCodeChange,
  fetchWeekRadio,
  fetchMonthRadio,
  fetchCodeTransform,
  finishCompany,
  getWeekReport
} from '@/api/company-manage/company-code'
import { colorOption } from '@/options'
import { mapGetters } from 'vuex'
import { isPhoneNumber } from '@/utils'
import AreaSelect from '@/components/AreaSelect'
import ChoosePoint from '@/components/ChoosePoint'

export default {
  name: 'CompanyDetail',
  components: {
    PieChart,
    LineChart,
    AreaSelect,
    ChoosePoint,
    StepLineChart
  },
  filters: {
    codeFilter: function(level) {
      return colorOption.map[level]
    },
    styleFilter: function(level) {
      level = +level
      const color = colorOption.list.find(item => item.value === level).color
      return {
        color
      }
    },
    radioFilter: function(radio) {
      return `环比上周${radio > 0 ? '上升' : (radio < 0 ? '下降' : '持平')}${radio === 0 ? '' : Math.abs(radio) + '%'}`
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['companyId'],
  data() {
    // 校验规则
    const validateUnitTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入企业电话'))
      } else if (!isPhoneNumber(value)) {
        callback(new Error('请输入正确企业电话'))
      } else {
        callback()
      }
    }

    return {
      pageLoading: true, // 页面加载状态
      loadingChangeDetail: false, // 转换详情加载状态
      dialogFormVisible: false,
      buttonLoading: false, // 弹窗中按钮的状态
      lineChart: [], // 驾驶员安全码走势
      stepChart: [], // 企业安全码走势
      companyInfo: {},
      tableData: [], // 安全码转换表格数据,
      weekReport: {
        safeCode: '',
        driverCodeProportion: '',
        maxArmName: '',
        maxArmCount: '',
        toRedCount: '',
        continuousRed: '',
        continuousGreen: '',
        lowToHigh: ''
      }, // 企业周报
      redCodeDriverTableData: [
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        }
      ], // 红码驾驶员
      greenCodeDriverTableData: [
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        },
        {
          driver: '张三',
          continueWeek: 4,
          weekIllegal: 10,
          weekPoint: 100
        }
      ], // 绿码驾驶员
      currentCode: '绿码',
      weekTransformList: [],
      monthChartDataAll: [], // 所有季度的数据
      monthChartData: {
        data: [],
        title: ''
      }, // 季度驾驶员安全码占比
      weekChartData: {
        data: []
      }, // 本周期驾驶员安全码占比
      weekTransformParams: {
        pageSize: 10,
        pageNum: 1,
        code: '1'
      },
      hasMore: false, // 是否还有数据
      monthChartInterval: null,
      createFormData: {
        unitId: '',
        address: '',
        area: '',
        areaCode: [],
        areaText: '',
        longitude: '',
        latitude: '',
        unitTel: '',
        legalPerson: ''
      }, // 存储新增数据
      rules: {
        unitTel: [{ required: true, trigger: 'blur', validator: validateUnitTel }],
        legalPerson: [{ required: true, trigger: 'blur', message: '请输入负责人' }],
        areaCode: [{ required: true, message: '请选择区域', trigger: 'change' }],
        address: [{ required: true, message: '请选择地址', trigger: 'change' }]
      } // 新增和编辑框的规则

    }
  },
  computed: {
    ...mapGetters(['role', 'unitId'])
  },
  mounted() {
    this.getCompanyData()
  },
  beforeDestroy() {
    this.clearInterval()
  },
  methods: {
    // 展示更多
    showMore(flag) {
      this.$message('该功能还在开发中')
    },
    // 获取企业基本信息
    getCompanyData() {
      const params = {
        unitId: +(this.role === 'unit' ? this.unitId : this.companyId)
      }

      fetchCompany(params).then(res => {
        this.companyInfo = res.data || {}

        // 核对企业信息是否完善
        if (this.checkInfo(this.companyInfo)) {
          // 信息已完善，获取其他信息
          this.getData(params)
        } else {
          this.pageLoading = false
        }
      }).catch(() => {
        this.pageLoading = false
      })
    },
    checkInfo({ address, legalPerson, unitTel, unitPlace }) {
      // 企业账号未完善信息弹窗提示完善信息
      if (!(address && legalPerson && unitTel && unitPlace) && this.role === 'unit') {
        this.dialogFormVisible = true
        return false
      }
      return true
    },
    // 完善信息
    finishInfo() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true

          // 将areaCode拆分成后端需要的数据
          const [province, city, region] = this.createFormData.areaCode
          const requestData = {
            ...this.createFormData,
            province: province || '',
            city: city || '',
            region: region || '',
            unitId: this.companyInfo.unitId
          }

          // 保存
          finishCompany(requestData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })

            // 再次获取企业信息
            this.getCompanyData()
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },
    // 跳转到具体的驾驶员安全码
    showCode(codeId) {
      this.$router.push({
        name: 'DriverCode',
        params: {
          companyId: this.companyInfo.unitId,
          codeId
        }
      })
    },
    // 加载更多驾驶员安全码转换详情
    loadMore() {
      if (this.hasMore) {
        this.loadingChangeDetail = true
        this.weekTransformParams.pageNum++
        this.setWeekTransformList(true)
      }
    },
    // 设置表格当前高亮
    setCurrent(row) {
      this.$refs.driverTable.setCurrentRow(row)
    },
    /**
     *设置驾驶员安全码转换数据
     * @param {boolean} concatData //是否将数据追加到原有数据
     */
    setWeekTransformList(concatData) {
      const params = {
        unitId: +(this.role === 'unit' ? this.unitId : this.companyId)
      }

      this.loadingChangeDetail = true

      fetchCodeTransform({ ...params, ...this.weekTransformParams }).then(res => {
        this.loadingChangeDetail = false
        this.hasMore = this.weekTransformParams.pageNum < res.data.totalPage
        if (concatData) {
          this.weekTransformList = this.weekTransformList.concat(res.data.list)
        } else {
          this.weekTransformList = res.data.list
        }
      }).catch(() => {
        this.loadingChangeDetail = false
      })
    },
    // 获取颜色
    getCodeColor(id) {
      return colorOption.mapColor[id] || '#91cc75'
    },
    // 格式化表格数据
    formatTableData(codeChangeData) {
      this.tableData = [
        {
          codeId: '1',
          code: codeChangeData.greenCount,
          count: codeChangeData.greenRateCount,
          radio: codeChangeData.greenRate
        },
        {
          codeId: '2',
          code: codeChangeData.blueCount,
          count: codeChangeData.blueRateCount,
          radio: codeChangeData.blueRate
        },
        {
          codeId: '3',
          code: codeChangeData.yellowCount,
          count: codeChangeData.yellowRateCount,
          radio: codeChangeData.yellowRate
        },
        {
          codeId: '4',
          code: codeChangeData.redCount,
          count: codeChangeData.redRateCount,
          radio: codeChangeData.redRate
        }
      ]
    },
    // 获取并设置图表数据
    getData(params) {
      Promise.all([
        fetchWeekCodeChange(params), // 本周期安全码变化
        fetchLineChart(params), // 企业安全码走势
        fetchMonthRadio({ ...params, year: new Date().getFullYear() }), // 季度安全码比例
        fetchWeekRadio(params), // 本周期安全码占比
        getWeekReport({
          pageNum: 1,
          pageSize: 1
        })
      ]).then((res) => {
        this.pageLoading = false
        // 格式化表格数据
        this.formatTableData(res[0].data || {})

        // 设置表格选中第一行
        this.setCurrent(this.tableData[0])

        // 格式化驾驶员折线图数据
        // this.lineChart = Object.keys(res[1].data || {}).map(key => {
        //   return res[1].data[key]
        // })
        this.lineChart = [
          {
            name: '红码',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210],
            stack: '安全码'
          },
          {
            name: '黄码',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310],
            stack: '安全码'
          },
          {
            name: '蓝码',
            type: 'line',
            data: [150, 232, 201, 154, 190, 330, 410],
            stack: '安全码'
          },
          {
            name: '绿码',
            type: 'line',
            data: [320, 332, 301, 334, 390, 330, 320],
            stack: '安全码'
          }
        ]

        // 季度饼图数据
        this.monthChartDataAll = res[2].data || []
        this.startInterval() // 开启定时器

        // 本周期饼图数据
        const weekChartData = (res[3].data || [{}])[0]
        const formatData = Object.keys(weekChartData).map(key => ({
          name: key,
          value: weekChartData[key]
        }))
        this.weekChartData = {
          data: formatData
        }

        // 企业安全码走势
        this.stepChart = [1, 2, 2, 3, 4, 3, 2]
      }).catch(e => {
        this.pageLoading = false
        console.log(e)
      })
    },
    // 启动饼图切换动画
    startInterval() {
      let currentIndex = 0
      const title = ['第一季度', '第二季度', '第三季度', '第四季度']
      const length = this.monthChartDataAll.length
      const chartData = this.monthChartDataAll.map(obj => {
        return Object.keys(obj).map(key => {
          return {
            name: key,
            value: obj[key]
          }
        })
      })
      if (length !== 0) {
        this.monthChartData.data = chartData[currentIndex]
        this.monthChartData.title = title[currentIndex]

        this.monthChartInterval = setInterval(() => {
          currentIndex = ++currentIndex % length
          this.monthChartData.data = chartData[currentIndex]
          this.monthChartData.title = title[currentIndex]
        }, 2000)
      }
    },
    // 关闭饼图动画
    clearInterval() {
      clearInterval(this.monthChartInterval)
    }
  }
}
</script>

<style lang="scss" scoped>
.outer {
  width: 100%;
}

.detail-page {
  margin: 0;
  padding: 24px 24px 24px 40px;
  min-width: 1200px;
  background: #fff;

  ::v-deep .perfect-info {
    .el-dialog__body {
      padding-top: 0 !important;
    }

    .address {
      .el-form-item__content {
        display: flex;

        .el-input {
          margin-right: 10px;
        }
      }
    }
  }

  .box-card {
    border: 1px solid rgba(187, 187, 187, 100);
    box-shadow: none;
    margin-bottom: 24px;
  }

  .tip {
    padding-right: 15px;
    line-height: 40px;
    font-size: 14px;
    color: #909399;
    text-align: center;
  }

  .el-card ::v-deep {
    .el-card__header {
      padding: 0 20px;
      border: none;

      .title {
        color: rgba(64, 158, 255, 100);
        font-size: 16px;
        line-height: 40px;
        border-bottom: 1px solid rgba(187, 187, 187);;

        .right-link {
          float: right;
        }
      }
    }

    .el-card__body {
      padding: 10px 20px 0 20px;
    }
  }

  .left {
    width: 520px;

    .unit-info {
      height: 304px;
      overflow: hidden;

      .info {
        height: 100%;

        .code {
          padding: 10px;
          border: 1px solid #bbbbbb;

          svg {
            width: 150px;
            height: 150px;
          }

          margin-right: 10px;
        }

        .base-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 250px;

          .level-name {
            color: rgba(255, 114, 114, 100);
            font-size: 16px;
            margin-bottom: 56px;
          }

        }

        .other-info p {
          line-height: 30px;
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }

    .week-code-radio {
      .pie-chart {
        margin-bottom: 32px;
      }

      ::v-deep {
        .el-table td, .el-table th {
          padding: 8px 0;
        }
      }
    }

    .week-code-radio, .quarter-code-radio {
      position: relative;
      height: 600px;
      overflow: hidden;

      .pie-chart {
        display: flex;
        justify-content: center;
        padding-top: 50px;
      }
    }

  }

  .medium {
    width: 500px;

    .week-report {
      p {
        font-size: 14px;
      }
    }

    .red-code-driver, .green-code-driver {
      height: 315px;

      .el-table {
        ::v-deep {
          th, td {
            padding: 2px 0;
          }

          .el-table__row {

            td:nth-child(1) {
              color: #FF7272;
            }
          }
        }
      }
    }
  }

  .right {
    width: 566px;
    min-width: 0;

    .quarter-code-radio {
      height: 350px;
    }

    /*
        .driver-code-change {
          height: 520px;
          overflow: hidden;

          ::v-deep {
            .el-card__body {
              padding-top: 5px;
            }

            .el-table {
              height: 192px;

              .current-row td {
                background: #87bdf5 !important;
              }

              tr {
                cursor: pointer;
              }
            }
          }

          .changeDetail {
            h2 {
              margin: 20px -20px 5px -20px;
              padding: 18px 20px;
              border-bottom: 1px solid #EBEEF5;
              font-size: 16px;
              color: #303133;
              font-weight: normal;
            }

            .infinite-list {
              list-style: none;
              margin: 0 -15px 0 0;
              padding: 0;
              height: 175px;
              overflow: auto;
              font-size: 14px;

              .driver {
                padding: 0 5px 0 5px;
                width: 80px;
                text-align: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                color: #409EFF;
              }

              .safe-code {
                width: 50px;
                text-align: center;
              }

              li {
                line-height: 36px;
              }

            }
          }
        }
    */

    .unit-code-change {
      height: 554px;
      overflow: visible;

      ::v-deep {
        .el-card__body {
          padding-top: 8px;
          padding-bottom: 0;

          canvas {
            //top: -30px !important;
          }
        }
      }

      .company-title {
        color: rgba(64, 158, 255, 100);
        font-size: 16px;
        line-height: 40px;
        border-bottom: 1px solid rgba(187, 187, 187);;
      }

      .safe-code-change {
        position: relative;

        .tip {
          position: absolute;
          top: 0;
          left: 50%;
          margin-left: -30px;
        }
      }
    }
  }
}

</style>
