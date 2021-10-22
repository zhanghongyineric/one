<template>
  <div class="container">
    <div class="left-box">
      <el-form
        ref="searchForm"
        :model="searchFormData"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="车牌号码:" prop="plateNum">
          <el-input
            v-model="searchFormData.plateNum"
            size="small"
            placeholder="请输入车牌号码"
            clearable
            style="width:220px;"
          />
        </el-form-item>
        <el-form-item label="查询日期:" prop="startTime">
          <el-date-picker
            v-model="searchFormData.startTime"
            align="right"
            type="date"
            placeholder="选择查询日期"
            :picker-options="pickerOptions"
            size="small"
            style="width:220px;"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="时间范围:" prop="endTime">
          <el-time-picker
            v-model="searchFormData.endTime"
            is-range
            size="small"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            style="width:220px;"
            value-format="HH-mm-ss"
          />
        </el-form-item></el-form>
      <div class="btn-box">
        <el-button type="primary" size="small">重置</el-button>
        <el-button type="primary" size="small" @click="getList">查询</el-button>
      </div>
      <el-divider />
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
      >
        <el-table-column
          label="车牌号"
          width="180"
        >
          {{ searchFormData.plateNum }}
        </el-table-column>
        <el-table-column
          prop="beg"
          label="开始时间"
          width="180"
        />
        <el-table-column
          prop="end"
          label="结束时间"
        />
        <el-table-column
          prop="len"
          label="文件大小"
        >
          <template slot-scope="scope">
            {{ (scope.row.len / 1000000).toFixed(3) + 'MB' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="right-box">
      <div id="cmsv6flash" class="video-box">
        <iframe src="/historyVideo.html" width="100%" height="100%" frameborder="0" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getDevId } from '@/api/live-monitor/message'

export default {
  name: 'HistoricalVideo',
  data() {
    return {
      advanced: false,
      searchFormData: {
        plateNum: '川Y07065',
        time: '',
        startTime: '',
        endTime: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }]
      },
      rules: {
        plateNum: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
      },
      devIdno: '',
      tableData: []
    }
  },
  created() {
    // this.getList()
  },
  mounted() {},
  methods: {
    resetQuery() {

    },
    handleSearch() {
      getDevId({ plateNum: this.searchFormData.plateNum })
        .then(({ data }) => {
          this.devIdno = data.data
        })
        .catch(err => {
          throw err
        })
    },
    getList() {
      const startTime = this.searchFormData.startTime.split('-')
      const beginTime = this.searchFormData.endTime[0].split('-')
      const endTime = this.searchFormData.endTime[1].split('-')
      const year = startTime[0]; const month = startTime[1]; const day = startTime[2]
      const begin = beginTime[0] * 3600 + beginTime[1] * 60 + parseInt(beginTime[2])
      let end = endTime[0] * 3600 + endTime[1] * 60 + parseInt(endTime[2])
      end === 86400 ? end = 86399 : ''

      getDevId({ plateNum: this.searchFormData.plateNum })
        .then(({ data }) => {
          // console.log(data, 'data')
          // this.devIdno = data
          // console.log(this.devIdno, '1')
          axios.get('https://www.api.gosmooth.com.cn/jsession/get?account=myyfb&password=myyfb123')
            .then(res => {
              console.log(this.devIdno)
              axios.get('https://www.api.gosmooth.com.cn/video/history', {
                params: {
                  jsession: res.data.jsession,
                  DownType: 2,
                  DevIDNO: data,
                  YEAR: year,
                  MON: month,
                  DAY: day,
                  BEG: begin,
                  END: end,

                  RECTYPE: -1,
                  FILEATTR: 2,
                  LOC: 1,
                  CHN: 0,
                  ARM1: 0,
                  ARM2: 0,
                  RES: 0,
                  STREAM: 0,
                  STORE: 0
                },
                timeout: 20000
              })
                .then(res => {
                  if (res.data.files) {
                    console.log(res.data.files)
                    this.tableData = res.data.files
                  } else {
                    this.$message({
                      type: 'warning',
                      message: '查询时间内无文件信息！'
                    })
                  }
                })
                .catch(err => {
                  throw err
                })
            })
            .catch(err => {
              throw err
            })
        })
        .catch(err => {
          throw err
        })
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 84px);
  position: relative;
}

.left-box {
  width: 700px;
  height: 100%;
  background-color: #1C2F41;
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px;
  overflow-y: auto;
}

.right-box {
  height: 100%;
  width: calc(100% - 700px);
  position: absolute;
  right: 0;
  display: flex;
  flex-wrap: wrap;
}

.video-box {
  width: 100%;
  height: 100%;
  /* background-color:#000; */
  /* border: 3px solid #fff; */
  box-sizing: border-box;
  /* display: inline-block; */
}

.btn-box {
  width: 350px;
  display: flex;
  justify-content: space-around;
}

::v-deep .el-form-item__label {
  color: #fff !important;
}

::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background-color: #060D16 !important;
}

::v-deep .el-tree {
  background-color: #1C2F41 !important;
}

::v-deep .el-tree-node__label {
  color: #fff;
}

::v-deep .el-tree-node__content {
  background-color: #1C2F41 !important;
}
</style>
