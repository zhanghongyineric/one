<template>
  <div class="break-info">
    <el-button class="detail-btn" type="primary" size="small" @click="showDetail">
      详情
    </el-button>
    <el-dialog
      v-if="dialogVisible"
      class="break-info-dialog"
      title="违章详情"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="cancel"
      :append-to-body="true"
    >
      <div style="max-height: 430px;overflow: auto">
        <div v-if="!onlyBase && statusList[list[currIndex].status] === '已处理'">
          <div class="info-title">行业标签</div>
          <SetMarkers
            v-if="list[currIndex].tagFlag === '0'"
            :id="list[currIndex].logId"
            @refresh="refresh"
          >
            <el-button type="primary" size="small">
              <span class="el-icon-circle-plus-outline marker-icon" />加标签
            </el-button>
          </SetMarkers>
          <div v-else>
            <div v-for="marker in list[currIndex].tagList" :key="marker.typeName" class="flex">
              <span class="tit-s btn-tit">{{ marker.typeName }}：</span>
              <span class="btn">{{ marker.tagName }}</span>
            </div>
            <!--<div class="flex">-->
            <!--  <span class="tit-s btn-tit">违章等级：</span>-->
            <!--  <span class="btn">轻微违章</span>-->
            <!--</div>-->
            <!--<div class="flex">-->
            <!--  <span class="tit-s btn-tit">主体责任：</span>-->
            <!--  <span class="btn">落实不彻底</span>-->
            <!--</div>-->
            <!--<div class="flex">-->
            <!--  <span class="tit-s btn-tit">行业处罚：</span>-->
            <!--  <span class="btn">教育警告</span>-->
            <!--</div>-->
          </div>
          <div class="line" />
        </div>
        <div class="flex">
          <span class="tit-s">车牌号：</span>
          <span class="content">{{ breakInfo.plateId }}</span>
        </div>
        <div class="flex">
          <span class="tit-s">营运类型：</span>
          <span class="content">{{ breakInfo.typeName }}</span>
        </div>
        <div class="line" />
        <div class="info-title">违章记录</div>
        <div class="flex">
          <span class="tit-s">驾驶员：</span>
          <span class="content">{{ breakInfo.driverName }}</span>
        </div>
        <div class="flex">
          <span class="tit-s">违章类型：</span>
          <span class="content">{{ violationType[breakInfo.violationTypeId] }}</span>
        </div>
        <div class="flex">
          <span class="tit-s">违章时间：</span>
          <span class="content">{{ breakInfo.violationTime }}</span>
        </div>
        <div class="flex">
          <span class="tit-s">违章详情：</span>
          <span class="content">{{ breakInfo.violationContent }}</span>
        </div>
        <div v-if="!onlyBase && statusList[list[currIndex].status] === '已处理'">
          <div class="line" />
          <div class="flex">
            <span class="tit-s">处理结果：</span>
            <span class="content">{{ breakInfo.handleContent }}</span>
          </div>
          <div v-if="list[currIndex].files && list[currIndex].files.length" class="flex">
            <span class="tit-s">附件：</span>
            <!--<span class="content">{{ breakInfo.driverName }}</span>-->
            <ul class="files">
              <li v-for="file in list[currIndex].files" :key="file.fileName" class="file">
                <div v-if="isImg(file.fileName)">
                  <el-image
                    style="width: 150px; height: 100px"
                    :src="file.sImg"
                    fit="cover"
                  />
                  <div class="shadow">
                    <div class="icon">
                      <span class="el-icon-zoom-in">
                        <el-image
                          class="min-img"
                          :src="file.sImg"
                          :preview-src-list="[file.url]"
                          :z-index="2005"
                          fit="cover"
                        />
                      </span>
                      <span class="el-icon-download" @click="fileDownLoad(file.downloadName)" />
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="file-con">
                    <span class="el-icon-document" />
                    <span>{{ file.fileName }}</span>
                  </div>
                  <div class="shadow">
                    <div class="icon">
                      <span class="el-icon-download" @click="fileDownLoad(file.downloadName)" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          :disabled="currIndex === 0"
          @click="showOther(-1)"
        >上一条</el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="currIndex === list.length - 1"
          @click="showOther(1)"
        >下一条</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SetMarkers from '@/components/SetMarkers'
import { fileDownload } from '@/api/government-report/government-report.js'
export default {
  name: 'BreakInfo',
  components: { SetMarkers },
  props: {
    index: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    onlyBase: {
      type: Boolean,
      dafault: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      currIndex: 0,
      breakInfo: {},
      hasMarkers: false,
      statusList: []
    }
  },
  watch: {
    list(list) {
      this.list = list
      this.praseImgs(list)
    }
  },
  created() {
    const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))
    this.violationType = onlineOption.violation_type.map
    this.currIndex = this.index
    this.statusList = onlineOption.report_status.map

    this.praseImgs(this.list)
    // const list = this.list
    // list.map(info => {
    //   const files = info.attachment.length ? info.attachment.split(';') : []
    //   const fullFiles = []
    //   files.forEach(url => {
    //     const fileName = url.slice(url.lastIndexOf('/') + 1)
    //     const index = url.lastIndexOf('.')
    //     const sImg = info.basePath + url.slice(0, index) + '_100x100_60' + url.slice(index)
    //     fullFiles.push({
    //       sImg,
    //       url: info.basePath + url,
    //       fileName,
    //       downloadName: url
    //     })
    //   })
    //   info.files = fullFiles
    // })
  },
  methods: {
    showDetail() {
      this.currIndex = this.index
      this.breakInfo = this.list[this.currIndex]
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
    },
    showOther(num) {
      this.currIndex += num
      this.breakInfo = this.list[this.currIndex]
    },
    refresh() {
      this.$emit('refresh')
    },
    fileDownLoad(url) {
      fileDownload(url)
    },
    isImg(name) {
      const imgs = ['bmp', 'jpg', 'jpeg', 'png', 'gif']
      name = name.slice(name.lastIndexOf('.') + 1)
      return imgs.indexOf(name) >= 0
    },
    praseImgs(list) {
      list.map(info => {
        const files = info.attachment && info.attachment.length ? info.attachment.split(';') : []
        const fullFiles = []
        files.forEach(url => {
          const fileName = url.slice(url.lastIndexOf('/') + 1)
          const index = url.lastIndexOf('.')
          const sImg = info.basePath + url.slice(0, index) + '_100x100_60' + url.slice(index)
          fullFiles.push({
            sImg,
            url: info.basePath + url,
            fileName,
            downloadName: url
          })
        })
        info.files = fullFiles
      })
    }
  }
}
</script>

<style scoped lang="scss">
.break-info {
  display: inline-block;
  .detail-btn {
    margin: 0 5px;
  }
}
.break-info-dialog {
  text-align: left;
  .info-title {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .line {
    margin: 10px 0;
    border-top: 1px solid #f0f0f0;
    width: 100%;
  }
  .marker-icon {
    margin-right: 7px;
    font-size: 14px;
    vertical-align: -1px;
  }
  .flex {
    display: flex;
    padding: 5px 0;
    .tit-s {
      width: 70px;
      color: #777;
      &.btn-tit {
        padding: 5px 0;
      }
    }
    .content {
      flex: 1;
    }
    .btn {
      width: 100px;
      display: inline-block;
      border-radius: 5px;
      padding: 5px 15px;
      margin: 0 10px 10px;
      background-color: #0A93F2;
      color: #fff;
      text-align: center;
    }
    .files {
      padding: 0;
      margin: 0;
      display: flex;
      .file {
        width: 150px;
        height: 100px;
        margin: 10px;
        position: relative;
        text-align: center;
        &:hover {
          .shadow {
            display: block;
          }
        }
        .file-con {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
        }
        .shadow {
          background-color: rgba(0,0,0,.5);
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: none;
          .icon {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .el-icon-zoom-in, .el-icon-download {
              font-size: 30px;
              color: #fff;
              padding: 0 10px;
              cursor: pointer;
            }
            .el-icon-zoom-in {
              position: relative;
            }
            .min-img {
              opacity: 0;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            }
          }
        }
        .el-icon-document {
          font-size: 40px;
          display: block;
        }
      }
    }
  }
}
</style>
