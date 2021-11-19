<template>
  <div class="layout-content">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="100px">
          <el-row :gutter="24">
            <el-col :md="5" :sm="24">
              <el-form-item label="数据源:">
                <el-select
                  v-model="listQuery.dataSource"
                  size="small"
                  placeholder="请选择数据源"
                >
                  <el-option
                    v-for="item in dataSourceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="5" :sm="24">
              <el-form-item label="报警分类:">
                <el-select
                  v-model="listQuery.type"
                  size="small"
                  placeholder="请选择报警表类型"
                >
                  <el-option
                    v-for="item in dataTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="5" :sm="24">
              <el-form-item label="地区:">
                <el-cascader
                  v-model="listQuery.regionId"
                  style="width:100%;"
                  placeholder="请选择地区"
                  size="small"
                  :options="areaOptions"
                  :props="areaProps"
                />
              </el-form-item>
            </el-col>
            <el-col :md="4" :sm="24">
              <el-form-item label="时间范围:">
                <el-date-picker
                  v-model="listQuery.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:135%"
                />
              </el-form-item>
            </el-col>
            <template v-if="advanced">
              <el-col :md="5" :sm="24">
                <el-form-item label="车牌号:">
                  <el-input
                    v-model="listQuery.plateNum"
                    placeholder="请输入车牌号"
                    size="small"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="驾驶员:">
                  <el-input
                    v-model="listQuery.personName"
                    placeholder="请输入驾驶员姓名"
                    size="small"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="车辆类型:">
                  <el-select
                    v-model="listQuery.vehicleType"
                    size="small"
                    placeholder="请选择车辆类型"
                  >
                    <el-option
                      v-for="item in vehicleTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="所属企业:">
                  <el-autocomplete
                    v-model="listQuery.unitName"
                    :fetch-suggestions="searchType"
                    placeholder="请输入企业名称关键字"
                    :debounce="500"
                    size="small"
                    clearable
                    style="width:100%;"
                    @select="selectSearchCompany"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="5" :sm="24">
                <el-form-item label="报警名称:">
                  <el-select
                    v-model="listQuery.alarmType"
                    size="small"
                    placeholder="请选报警名称"
                  >
                    <el-option
                      v-for="item in alarmTypeOptions"
                      :key="item.cbArmType"
                      :label="item.cbArmName"
                      :value="item.cbArmType"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col
              :md="!advanced && 4 || 24"
              :sm="24"
              :style="{'margin-left': advanced ? '' : '60px'}"
            >
              <div
                class="table-page-search-submitButtons"
                style="margin-top: -4px"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="search">查询</el-button>
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
        <el-table-column type="index" label="编号" width="60" align="center" />
        <el-table-column prop="plateNum" label="车牌号" width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="plateColor" label="车牌颜色" min-width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.plateColor | plateColorFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="vehicleType" label="车辆类型" min-width="110" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            {{ scope.row.vehicleType | vehicleTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="personName" label="驾驶员" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="unitName" label="所属企业" min-width="300" align="center" show-overflow-tooltip />

        <el-table-column prop="cbArmName" label="报警名称" min-width="160" align="center" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            {{ scope.row.cbArmType | alarmTypeFilter }}
          </template> -->
        </el-table-column>

        <el-table-column prop="startTime" label="开始时间" width="220" align="center" show-overflow-tooltip />
        <el-table-column prop="endtime" label="结束时间" width="220" align="center" show-overflow-tooltip />
        <!-- <el-table-column prop="Protime" label="持续时长" width="120" align="center" show-overflow-tooltip /> -->
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn"
              type="primary"
              size="small"
              @click="showDetails(scope.row)"
            >报警详情</el-button>
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
        title="报警详情"
        :visible.sync="visible"
        top="100px"
        :before-close="closeDialog"
        custom-class="customClass"
      >
        <div class="alarm-info">
          <span><span class="info-title">车牌号：</span>{{ currentRow.plateNum }}</span>
          <span><span class="info-title">车牌颜色：</span>{{ currentRow.plateColor }}</span>
          <span><span class="info-title">车辆类型：</span>{{ currentRow.vehicleType }}</span>
          <span><span class="info-title">报警类型：</span>{{ currentRow.cbArmName }}</span>
        </div>
        <div class="alarm-info" style="margin-top:10px;">
          <span><span class="info-title">所属企业：</span>{{ currentRow.unitName }}</span>
          <span><span class="info-title">开始时间：</span>{{ currentRow.startTime }}</span>
          <span><span class="info-title">结束时间：</span>{{ currentRow.endtime }}</span>
        </div>
        <div class="image-box">
          <span class="title-text">报警图片：</span>

          <div>
            <el-image
              v-for="item in alarmPhotos"
              :key="item.fs"
              :src="item.downloadUrl"
              :preview-src-list="previewPhotos"
              class="alarm-images"
            />
          </div>
        </div>
        <span class="title-text">报警视频：</span>

        <div style="min-height:150px;">
          <div v-for="(item,index) in alarmVideos" :key="item.fs" class="alarm-videos">
            <video
              :id="'video' + index"
              class="video-js "
            >
              <source type="video/mp4" :src="item.downloadUrl">
            </video>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import axios from 'axios'
import {
  areaCode,
  activeDefenseAlarm,
  enterpriseName,
  alarmType
} from '@/api/live-monitor/alarm-detail'

let that

export default {
  name: 'AlarmDetail',
  components: { Pagination },
  filters: {
    plateColorFilter(color) {
      let text = color
      that.plateColorOptions[color] ? text = that.plateColorOptions[color] : ''
      return text
    },
    alarmTypeFilter(type) {
      let text = type
      that.alarmTypeMap[type] ? text = that.alarmTypeMap[type] : ''
      return text
    },
    vehicleTypeFilter(type) {
      let text = type
      that.vehicleTypeMap[type] ? text = that.vehicleTypeMap[type] : ''
      return text
    }
  },
  data() {
    return {
      advanced: false,
      visible: false,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        regionId: '',
        time: [],
        alarmType: '',
        plateNum: '',
        provinceId: '',
        dataSource: '',
        type: ''
      },
      tableData: [],
      listLoading: false,
      areaOptions: [],
      areaProps: {
        label: 'unitName',
        children: 'children',
        value: 'unitId',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      vehicleTypeMap: null,
      vehicleTypeOptions: [],
      alarmTypeMap: {},
      alarmTypeOptions: [],
      plateColorOptions: [],
      dataTypeOptions: [],
      dataSourceOptions: [],

      alarmPhotos: [],
      alarmVideos: [],
      previewPhotos: [],
      currentRow: {}
    }
  },
  watch: {
    alarmPhotos(val) {
      if (val) {
        val.forEach(item => {
          this.previewPhotos.push(item.downloadUrl)
        })
      }
    },
    'listQuery.time': {
      deep: true,
      handler: function(newV, oldV) {
        if (!this.listQuery.time) {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        } else {
          this.listQuery.startTime = this.listQuery.time[0]
          this.listQuery.endTime = this.listQuery.time[1]
        }
      }
    },
    'listQuery.unitName': {
      deep: true,
      handler: function(newV, oldV) {
        if (newV === '') this.listQuery.unitId = ''
      }
    },
    dataSourceOptions() {
      this.listQuery.type = this.dataTypeOptions[0].value
      this.listQuery.dataSource = this.dataSourceOptions[0].value
    }
  },
  created() {
    that = this
    const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
    this.vehicleTypeMap = onlineOption['vehicle_type_code'].map
    this.vehicleTypeOptions = onlineOption['vehicle_type_code'].list
    this.plateColorOptions = onlineOption['车牌颜色编码'].map
    this.dataTypeOptions = onlineOption['rule_of_arm_type'].list
    this.dataSourceOptions = onlineOption['数据来源'].list
    this.getDate()
  },
  mounted() {
    this.getAreaCode()
    this.getAlarmType()
  },
  methods: {
    getAlarmType() {
      alarmType()
        .then(res => {
          const { data } = res
          data.forEach(item => {
            this.alarmTypeMap[item.cbArmType] = item.cbArmName
          })
          this.alarmTypeOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    getDate() {
      const date = new Date()
      let nowMonth = date.getMonth() + 1
      let strDate = date.getDate()
      let endDate = date.getDate() + 1
      const seperator = '-'
      if (nowMonth >= 1 && nowMonth <= 9) nowMonth = '0' + nowMonth
      if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate
      if (endDate >= 0 && endDate <= 9) endDate = '0' + endDate
      this.listQuery.time[0] = date.getFullYear() + seperator + nowMonth + seperator + strDate + ' 00:00:00'
      this.listQuery.time[1] = date.getFullYear() + seperator + nowMonth + seperator + endDate + ' 00:00:00'
      this.$set(this.listQuery, 'startTime', this.listQuery.time[0])
      this.$set(this.listQuery, 'endTime', this.listQuery.time[1])
    },
    getAreaCode() {
      areaCode()
        .then(res => {
          const { data } = res
          this.deleteEmptyChilren(data[0])
          this.areaOptions = data
          this.listQuery.regionId = '800'
          this.getList()
        })
        .catch(err => {
          throw err
        })
    },
    deleteEmptyChilren(data) {
      data.children.length === 0 ? data.children = null : data.children.forEach(v => this.deleteEmptyChilren(v))
    },
    searchType(queryString, cb) {
      if (queryString) {
        enterpriseName({ unitName: queryString })
          .then(({ data }) => {
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
    selectSearchCompany(v) {
      this.listQuery.unitId = v.unitId
      this.listQuery.unitName = v.unitName
    },
    resetQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        regionId: '800',
        time: [],
        alarmType: '',
        plateNum: ''
      }
      this.getDate()
      this.getList()
    },
    closeDialog() {
      this.visible = false
      setTimeout(() => {
        this.currentRow = {}
      }, 300)
    },
    showDetails(row) {
      Object.assign(this.currentRow, row)
      this.currentRow.plateColor = that.plateColorOptions[parseInt(row.plateColor)]
      this.currentRow.vehicleType = that.vehicleTypeMap[parseInt(row.vehicleType)]
      this.currentRow.endtime = row.endtime || '无'
      this.visible = true
      axios.get('https://www.api.gosmooth.com.cn/jsession/get?account=myyfb&password=myyfb123')
        .then(res => {
          axios.get('https://www.api.gosmooth.com.cn/attach', {
            params: {
              jsession: res.data.jsession,
              toMap: 2,
              guid: row.guid,
              devIdno: row.devIdno,
              alarmType: row.armType,
              begintime: row.startTime
            },
            timeout: 10000
          })
            .then(({ data }) => {
              this.alarmPhotos = data.images
              this.alarmVideos = data.vedios
              this.initVideo()
            })
            .catch(err => {
              throw err
            })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '登录失败！'
          })
          throw err
        })
    },
    // 初始化视频方法
    initVideo() {
      if (this.alarmVideos.length > 0) {
        for (let index = 0; index < this.alarmVideos.length; index++) {
          setTimeout(() => {
            this.$video('video' + index, {
              controls: true,
              autoplay: 'muted',
              preload: 'auto',
              notSupportedMessage: '此视频暂无法播放，请稍后再试',
              aspectRatio: '4:3',
              playbackRates: [0.5, 1, 1.5, 2, 3],
              controlBar: {
                'currentTimeDisplay': true,
                'timeDivider': true,
                'durationDisplay': true,
                'remainingTimeDisplay': false
              }
            })
          })
        }
      }
    },
    search() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      let { regionId } = this.listQuery
      this.listQuery.provinceId = '622'
      if (regionId.length === 2) {
        regionId = regionId[1]
      } else if (regionId.length === 1) {
        regionId = ''
      }
      activeDefenseAlarm({ ...this.listQuery, regionId })
        .then(({ data }) => {
          this.total = data.total
          this.tableData = data.list
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    }
  }
}
</script>
<style scoped>
.alarm-images {
  width:280px;
  margin-right: 10px;
}

.alarm-videos {
  width: 280px !important;
  display: inline-block !important;
  margin-right: 10px;
}

.title-text {
  display: block;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}

.image-box {
  margin: 30px 0;
  min-height: 150px;
}

.alarm-info {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}

.info-title {
  font-weight: 700;
}
</style>
