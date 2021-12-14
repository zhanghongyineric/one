<template>
  <div class="container">
    <div class="left-box" :style="{'background-color':theme?'#0E1521':''}">
      <div
        class="search-box box-style"
        :style="{'background-color':theme?'#1C2F41':'#fff'}"
      >
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
          <el-button type="primary" size="small" @click="resetSearch">重置</el-button>
          <el-button type="primary" size="small" @click="getList">查询</el-button>
        </div>
      </div>
      <div class="table box-style" :style="{'background-color':theme?'#1C2F41':'#fff'}">
        <el-table
          v-loading="listLoading"
          :data="tableData"
          stripe
          style="width: 100%"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="70"
            align="center"
          />
          <el-table-column
            align="center"
            label="车牌号"
            width="100"
          >
            {{ searchFormData.plateNum }}
          </el-table-column>
          <el-table-column
            align="center"
            prop="time"
            label="时间范围"
          />
          <el-table-column
            align="center"
            prop="chn"
            width="70"
            label="通道"
          >
            <template slot-scope="scope">
              {{ `CH${scope.row.chn + 1}` }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="len"
            label="文件大小"
            width="100"
          >
            <template slot-scope="scope">
              {{ (scope.row.len / 1000000).toFixed(3) + 'MB' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="80"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="playVideo(scope.row)">播放</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right-box">
      <div id="cmsv6flash" class="video-box">
        <iframe ref="iframe" src="/historyVideo.html" width="100%" height="100%" frameborder="0" />
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
        plateNum: '',
        time: '',
        startTime: '',
        endTime: ''
      },
      listLoading: false,
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
      tableData: [],
      iframeWin: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.searchFormData.plateNum = vm.$route.query.plateNum
    })
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme === 'dark'
    }
  },
  watch: {
    theme() {
      this.changeTheme()
    }
  },
  mounted() {
    this.changeTime()
    this.iframeWin = this.$refs.iframe.contentWindow
  },
  methods: {
    resetSearch() {
      this.searchFormData = {
        plateNum: '',
        time: '',
        startTime: '',
        endTime: ''
      }
      this.$nextTick(() => {
        this.$refs['searchForm'].clearValidate()
      })
    },
    changeTime(item) {
      if (item) {
        // 开始时间
        const strHour = Math.floor(item.beg / 3600)
        const strMinute = Math.floor((item.beg % 3600) / 60)
        const strSecond = (item.beg % 3600) % 60
        // 结束时间
        const endHour = Math.floor(item.end / 3600)
        const endMinute = Math.floor((item.end % 3600) / 60)
        const endSecond = (item.end % 3600) % 60
        item.time = `${this.searchFormData.startTime}  ${strHour}:${strMinute}:${strSecond} - ${endHour}:${endMinute}:${endSecond}`
      }
    },
    // 播放视频向 iframe 传递播放链接
    playVideo(row) {
      this.iframeWin.postMessage({
        cmd: 'getParams',
        params: {
          key: row.PlaybackUrlWs
        }
      }, '*')
    },
    // 更改主题后，向 iframe 传递主题
    changeTheme() {
      console.log(this.theme, 'theme')
      this.iframeWin.postMessage(this.theme, '*')
    },
    getList() {
      this.listLoading = true
      const startTime = this.searchFormData.startTime.split('-')
      const beginTime = this.searchFormData.endTime[0].split('-')
      const endTime = this.searchFormData.endTime[1].split('-')
      const year = startTime[0]; const month = startTime[1]; const day = startTime[2]
      const begin = beginTime[0] * 3600 + beginTime[1] * 60 + parseInt(beginTime[2])
      let end = endTime[0] * 3600 + endTime[1] * 60 + parseInt(endTime[2])
      end === 86400 ? end = 86399 : ''

      getDevId({ plateNum: this.searchFormData.plateNum })
        .then(({ data }) => {
          axios.get('https://www.api.gosmooth.com.cn/jsession/get?account=myyfb&password=MYYFB123')
            .then(res => {
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
                timeout: 10000
              })
                .then(res => {
                  if (res.data.files) {
                    this.tableData = res.data.files
                    this.tableData.forEach(item => {
                      this.changeTime(item)
                    })
                  } else if (res.data.message === 'Device is not online!') {
                    this.$message({
                      type: 'warning',
                      message: '当前设备不在线！'
                    })
                  } else {
                    this.$message({
                      type: 'warning',
                      message: '查询时间内无文件信息！'
                    })
                  }
                  this.listLoading = false
                })
                .catch(err => {
                  this.$message({
                    type: 'error',
                    message: '查询错误！'
                  })
                  this.listLoading = false
                  throw err
                })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '登录失败！'
              })
              this.listLoading = false
              throw err
            })
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
.container {
  width: 100%;
  height: calc(100vh - 84px);
  position: relative;
  min-height: 880px;
}

.left-box {
  width: 700px;
  height: 100%;
  /* background-color: #0E1521; */
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px;
}

.search-box {
  padding-left: 150px;
  margin-bottom: 30px;
}

.table {
  min-height: 490px;
  height: 66%;
}

.box-style {
  box-sizing: border-box;
  padding: 20px;
  /* background-color:#1C2F41; */
  border-radius: 10px;
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
  box-sizing: border-box;
}

.btn-box {
  width: 350px;
  display: flex;
  justify-content: space-around;
  padding-left: 60px;
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
