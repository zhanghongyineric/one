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
            style="width:200px;"
          />
        </el-form-item>
        <el-form-item label="起始时间:" prop="startTime">
          <el-date-picker
            v-model="searchFormData.startTime"
            type="datetime"
            placeholder="选择开始日期时间"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:200px;"
          />
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-date-picker
            v-model="searchFormData.endTime"
            size="small"
            type="datetime"
            placeholder="选择结束日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:200px;"
          />
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button type="primary" size="small">重置</el-button>
        <el-button type="primary" size="small">查询</el-button>
      </div>
      <el-divider />

    </div>
    <div class="right-box">
      <div class="video-box">
        <video
          id="videoId"
          class="video-js"
        >
          <source
            type="video/mp4"
            src="http://121.36.90.54:80/StandardApiAction_addDownloadTask.action?jsession=493241e518fd406b99806bd6968a401c&did=014487901319&fbtm=2021-10-18 19:23:34&fetm=2021-10-18 19:38:02&sbtm=2021-10-18 19:23:34&setm=2021-10-18 19:38:02&lab=&fph=;0;0;21;10;18;69814;70682;0;0_0_0_1&vtp=0&len=104236176&chn=0&dtp=2"
          >
        </video>
      </div>
      <div class="video-box" />
      <div class="video-box" />
      <div class="video-box" />
      <div class="video-box" />
      <div class="video-box" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

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
      pickerOptions: {},
      rules: {
        plateNum: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
      },
      data: [{
        label: '文件夹 1',
        children: [{
          label: '文件夹 1-1',
          children: [{
            label: '文件1'
          }]
        }]
      }, {
        label: '文件夹 2',
        children: [{
          label: '文件夹 2-1',
          children: [{
            label: '文件2'
          }]
        }, {
          label: '文件夹 2-2',
          children: [{
            label: '文件 2-2-1'
          }]
        }]
      }, {
        label: '文件夹 3',
        children: [{
          label: '文件夹 3-1',
          children: [{
            label: '文件 3-1-1'
          }]
        }, {
          label: '文件夹 3-2',
          children: [{
            label: '文件 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$video('videoId', {
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
  },
  methods: {
    handleNodeClick() {},
    getList() {
      axios.get('https://www.api.gosmooth.com.cn/jsession/get?account=myyfb&password=myyfb123')
        .then(res => {
          axios.get('https://www.api.gosmooth.com.cn/video/history', {
            params: {
              jsession: res.data.jsession,
              DownType: 2,
              DevIDNO: '014487901319',
              YEAR: 2021,
              MON: 10,
              DAY: 18,
              BEG: 0,
              END: 86399,

              RECTYPE: -1,
              FILEATTR: 2,
              LOC: 1,
              CHN: 0,
              ARM1: 0,
              ARM2: 0,
              RES: 0,
              STREAM: 0,
              STORE: 0
            }
          })
            .then(res => {
              console.log(res.data)
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
  width: 50%;
  height: 33%;
  /* background-color:#000; */
  border: 3px solid #fff;
  box-sizing: border-box;
  display: inline-block;
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
