<!--
  - FileName: 处理日志详情
  - @author: ZhouJiaXing
  - @date: 2021/5/10 下午3:55
  -->

<template>
  <div class="layout-content handle-log">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="状态:">
                <el-select v-model="listQuery.status" placeholder="请选择状态">
                  <el-option
                    v-for="{label,value} in optionGroup.statusList"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="关键字:">
                <el-input v-model="listQuery.keywords" placeholder="请输入车牌号/驾驶员" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleDownload">下载XLS</el-button>

              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--表格-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="车牌号" prop="plateId" />
        <el-table-column label="营运类型" prop="typeName" />
        <el-table-column label="驾驶员姓名" prop="driverName" />
        <el-table-column label="违章类型" prop="violationType" />
        <el-table-column label="违章详细" prop="violationContent" min-width="200px" show-overflow-tooltip />
        <el-table-column v-slot="{row}" label="违章时间" prop="violationTime">
          {{ row.violationTime | violationTimeFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="状态" prop="status">
          <span :style="{color: row.status===0?'red':'green'}"> {{ row.status | statusFilter }}</span>
        </el-table-column>

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="90" class-name="small-padding fixed-width">
          <template v-slot="{row}">
            <el-button v-if="row.status === 0" type="primary" size="mini" @click="handleOperation('handle',row)">
              处理
            </el-button>
            <el-button v-if="row.status === 1" type="primary" size="mini" @click="handleOperation('look',row)">
              查看
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class="base-dialog dialog-col-2"
      >
        <el-form
          ref="dataForm"
          :model="createFormData"
          label-width="90px"
        >
          <el-row>

            <h1>车辆</h1>
            <el-col :span="12">
              <el-form-item
                label="车牌号:"
                prop="plateId"
              >
                <el-input v-model="createFormData.plateId" disabled placeholder="placeholder" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="营运类型:"
              >
                <el-input v-model="createFormData.typeName" disabled placeholder="placeholder" />
              </el-form-item>
            </el-col>

            <h1>违章</h1>
            <el-col :span="12">
              <el-form-item
                label="驾驶员:"
                prop="driverName"
              >
                <el-input v-model="createFormData.driverName" disabled placeholder="placeholder" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="违章类型:"
                prop="violationType"
              >
                <el-input v-model="createFormData.violationType" disabled placeholder="placeholder" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="违章时间:"
                prop="time"
                class="illegal-time"
              >
                <el-input v-model="createFormData.violationTime" disabled placeholder="placeholder" />
              </el-form-item>

            </el-col>
            <el-col :span="24">
              <el-form-item
                label="违章详细:"
                prop="violationContent"
              >
                <el-input v-model="createFormData.violationContent" type="textarea" disabled placeholder="placeholder" />
              </el-form-item>
            </el-col>
          </el-row>

          <h1>处理</h1>
          <el-form-item
            label="处理结果:"
            prop="handleContent"
            :rules="{required:true,trigger:'blur',message:'请输入处理结果'}"
          >
            <el-input v-model="createFormData.handleContent" type="textarea" placeholder="请输入处理结果" />
          </el-form-item>
          <!--文件上传-->
          <el-form-item
            v-if="dialogStatus === 'handle'"
            label="附件:"
          >
            <el-upload
              class="upload-demo"
              multiple
              action="#"
              :file-list="createFormData.attachment"
              :auto-upload="false"
              :on-change="fileChange"
              :before-remove="fileChange"
            >
              <el-button size="small" type="primary">文件选择</el-button>
              <div slot="tip" class="el-upload__tip">（支持常见图片和文档格式 ，单个文件不超过5M）</div>
            </el-upload>
          </el-form-item>
          <!--查看上传的文件-->
          <el-form-item
            v-if="dialogStatus === 'look'"
            label="附件:"
            class="preview-form-item"
          >
            <span v-if="createFormData.attachment.length===0">暂无附件</span>
            <div
              v-for="{name,downloadUrl,previewSrc} in createFormData.attachment"
              :key="name"
              class="file-item"
              @click="downloadFile(downloadUrl)"
            >
              <!--图片-->
              <el-image
                v-if="isImage(name)"
                :z-index="2004"
                style="width: 148px; height: 148px;"
                :src="previewSrc"
                fit="contain"
              />
              <!--普通文件-->
              <div v-if="!isImage(name)" class="normal-file">
                <i class="el-icon-document" style="font-size: 20px" />
                {{ name }}
              </div>
              <span class="download-icon">
                <i class="el-icon-download" />
              </span>
            </div>

          </el-form-item>

        </el-form>
        <div v-if="dialogStatus==='handle'" slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" :loading="buttonLoading" @click="handleConfirmClick">
            确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { downloadFile, downloadLog, fetchLogList, fileUpload, handleViolation } from '@/api/company-report/handle-log'

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'HandleLogDetail',
  components: { Pagination },
  filters: {
    violationTimeFilter: function(violationTime) {
      return violationTime
    },
    statusFilter: function(status) {
      return onlineOption.report_status.map[status]
    }
  },
  data() {
    return {
      list: [{
        plateId: '',
        typeName: '',
        driverName: '',
        violationType: '',
        violationTime: '',
        status: ''
      }], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keywords: '',
        status: '-1'
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        keywords: '',
        status: '-1'
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        statusList: onlineOption.report_status.list
      }, // 存放选项的数据
      createFormData: {
        handleContent: '',
        attachment: []// 附件
      }, // 存储新增和编辑框的数据
      textMap: {
        handle: '处理违章',
        look: '查看违章'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogVisible_preview: false, // 预览弹窗
      previewUrl: '',
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    // 判断文件是否是图片
    isImage(name) {
      const imageExt = ['jpg', 'png', 'jpeg']
      const ext = name.split('.')[1]
      return imageExt.includes(ext)
    },
    // 文件改变
    fileChange(file, fileList) {
      this.createFormData.attachment = fileList
    },
    // 确认处理
    handleConfirmClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true

          const { logId, attachment, handleContent } = this.createFormData

          // 开始请求
          Promise.resolve().then(item => {
            if (attachment.length === 0) { // 没选择文件不掉文件上传接口
              return ''
            } else {
              // 格式化文件
              const formData = new FormData()

              attachment.forEach(fileObj => {
                formData.append('fileName', fileObj.raw)
              })
              // 文件上传
              return fileUpload(formData).then(res => {
                // 文件地址拼接
                // return res.data.map(item => {
                //   return item.fileUrl
                // }).join('；')// 分号就是要用中文的
                return res.data.fileUrl
              })
            }
          }).then(attachment => {
            // 提交处理
            return handleViolation({
              logId,
              handleContent: handleContent,
              attachment
            })
          }).then(res => {
            this.$message({
              message: '处理成功！',
              type: 'success'
            })
            this.getList() // 刷新表格数据
            this.buttonLoading = false
            this.dialogFormVisible = false
          }).catch(item => {
            console.log(item)
            this.buttonLoading = false
          })
        }
      })
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      this.listQuery.reportTime = this.$route.query.reportTime
      fetchLogList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 导出表格数据
    handleDownload() {
      downloadLog({
        flag: this.$route.query.flag
      })
    },
    // 查看，处理违章
    handleOperation(operation, row) {
      this.dialogFormVisible = true
      this.dialogStatus = operation
      if (operation === 'handle') {
        this.createFormData = { ...row, attachment: row.attachment || [] }
      } else {
        const baseurl = row.basePath
        const attachment = !row.attachment ? [] : row.attachment.split('；').map(url => {
          return {
            name: url.slice(url.lastIndexOf('/') + 1),
            downloadUrl: url,
            previewSrc: baseurl + url.slice(0, url.lastIndexOf('.')) + '_148x148_80' + url.slice(url.lastIndexOf('.')), // 预览小图地址
            imgSrc: baseurl + url
          }
        })
        this.createFormData = { ...row, attachment }
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 下载文件
    downloadFile(url) {
      downloadFile({ fileName: url })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.handle-log {
  h1 {
    font-size: 20px;
    font-weight: normal;
  }

  .el-upload__tip {
    line-height: 16px;
  }

  .illegal-time {
    ::v-deep .el-form-item__content {
      display: flex;

      .el-date-editor--date {
        margin-right: 5px;
      }
    }
  }

  .preview-form-item {
    ::v-deep.el-form-item__content {
      display: flex;
      flex-wrap: wrap;

      .file-item {
        position: relative;
        margin-right: 10px;
        height: 150px;
        border: 1px solid #c0ccda;
        border-radius: 8px;
        &:hover .download-icon {
          opacity: 1 !important;
        }

        .el-image {
          cursor: pointer;
          border-radius: 8px;
        }

        .normal-file {
          display: flex;
          text-align: center;
          align-items: center;
          width: 150px;
          height: 150px;
          line-height: 20px;
        }

        .download-icon {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          width: 150px;
          height: 150px;
          font-size: 30px;
          color: white;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 8px;
          opacity: 0;
          transition: all .5s;
        }
      }

    }
  }
}
</style>
