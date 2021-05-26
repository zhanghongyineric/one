<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--搜索-->
      <el-form
        class="table-page-search-wrapper search"
        label-width="80px"
        size="small"
      >
        <el-row :gutter="48">
          <el-col :md="8" :sm="24">
            <el-form-item label="申请状态:">
              <el-select v-model="listQuery.status" placeholder="请选择申请状态">
                <el-option v-for="item in penaltyAppealStatus" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="关键字:">
              <el-input
                v-model="listQuery.keyword"
                placeholder="请输入姓名手机号或身份证"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button size="small" @click="resetQuery">重置</el-button>
              <el-button type="primary" size="small" @click="getList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!--表格-->
      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="dangerCom"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="50" />
        <el-table-column prop="driverName" label="姓名" min-width="80" />
        <el-table-column prop="idCard" label="身份证号码" min-width="170" />
        <el-table-column prop="driverTel" label="电话" min-width="110" />
        <el-table-column prop="unitName" label="所属企业" min-width="120" show-overflow-tooltip />
        <el-table-column prop="plateInfo" label="驾驶车辆" min-width="90" />
        <el-table-column label="违章程度" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.alarmLevel === 1">严重</span>
            <span v-if="scope.row.alarmLevel === 2">一般</span>
          </template>
        </el-table-column>
        <el-table-column prop="alarmContent" label="违章内容" min-width="150" show-overflow-tooltip />
        <el-table-column prop="score" label="减分值" min-width="80" />
        <el-table-column
          prop="contentAppeal"
          label="申诉描述"
          min-width="280"
          show-overflow-tooltip
        />
        <el-table-column prop="createTime" label="申诉时间" min-width="160" />
        <el-table-column fixed="right" label="申诉状态" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="orange">申诉中</span>
            <span v-if="scope.row.status === 1" class="green">已通过</span>
            <span v-if="scope.row.status === 2" class="red">已拒绝</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="85" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn"
              type="primary"
              size="small"
              @click="showDetails(scope.row.id,scope.$index)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--申诉详情-->
      <el-dialog
        class="dialog"
        title=""
        :visible.sync="dialogVisible"
        width="680px"
        :before-close="closeDetail"
      >
        <div v-loading="listLoading">
          <p><b>编号：</b>{{ dialogInfo.details.index }}</p>
          <p><b>申诉人：</b>{{ dialogInfo.details.driverName }}</p>
          <p><b>身份证：</b>{{ dialogInfo.details.idCard }}</p>
          <p><b>所属企业：</b>{{ dialogInfo.details.unitName }}</p>
          <p><b>驾驶车辆：</b>{{ dialogInfo.details.plateInfo }}</p>
          <p><b>违章程度：</b>{{ dialogInfo.details.alarmLevel }}</p>
          <p><b>违章内容：</b>{{ dialogInfo.details.alarmContent }}</p>
          <p><b>加减分值：</b>{{ dialogInfo.details.score }}</p>
          <p><b>申诉描述：</b>{{ dialogInfo.details.contentAppeal }}</p>
          <p><b>申诉时间：</b>{{ dialogInfo.details.createTime }}</p>
          <p class="img-tit">
            <b>申诉图片：</b>
            <span v-if="!dialogInfo.workPicUrl.length">未上传图片</span>
          </p>
          <div class="dialog-imgs">
            <div
              v-for="img in dialogInfo.workPicUrl"
              :key="img"
              class="img-con"
            >
              <el-image
                class="dialog-img"
                :src="img"
                fit="cover"
                :preview-src-list="dialogInfo.workPicUrl"
                :z-index="3000"
              />
            </div>
          </div>
          <div v-if="dialogInfo.details.status !== 0">
            <p><b>审核描述：</b>{{ dialogInfo.details.contentHandle }}</p>
            <p class="img-tit">
              <b>审核图片：</b>
              <span v-if="!dialogInfo.handlePic.length">未上传图片</span>
            </p>
            <div class="dialog-imgs">
              <div
                v-for="img in dialogInfo.handlePic"
                :key="img"
                class="img-con"
              >
                <el-image
                  class="dialog-img"
                  :src="img"
                  fit="cover"
                  :preview-src-list="dialogInfo.handlePic"
                  :z-index="3000"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <el-form ref="rejectForm" :rules="rejectRules" :model="reviewInfo">
              <el-form-item label="处理回复：" prop="content">
                <el-select v-model="reviewInfo.content" placeholder="" style="width:350px;" size="small">
                  <el-option label="审核通过，经核实确认申诉内容属实有效" value="审核通过，经核实确认申诉内容属实有效" />
                  <el-option label="审核不通过，经核实确认存在违章行为申诉无效" value="审核不通过，经核实确认存在违章行为申诉无效" />
                </el-select>
              </el-form-item>
              <p><b>相关截图：</b>（最多4张）</p>
              <el-upload
                ref="upload"
                action
                list-type="picture-card"
                :auto-upload="false"
                :limit="4"
                :multiple="true"
                :on-change="previewImg"
                :on-remove="handleRemove"
                :before-upload="previewImg"
              >
                <i slot="default" class="el-icon-plus" />
              </el-upload>
            </el-form>
            <span style="margin-left: 45%">
              <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // 分页
import { list, detail, handle, upload } from '@/api/safe-code/penalty-appeal'
import { penaltyAppealStatus } from '@/options'

export default {
  name: 'PenaltyAppeal',
  components: {
    Pagination
  },
  data() {
    return {
      search: {
        startTime: '',
        endTime: '',
        state: ['全部'],
        input: '',
        workerId: '1'
      },
      dialogVisible: false,
      reviewVisible: false,
      dangerCom: [],
      dialogInfo: {
        workPicUrl: [], // 申诉图片
        handlePic: [], // 审核图片
        details: {}
      },
      reviewInfo: {
        imgs: '',
        content: '审核通过，经核实确认申诉内容属实有效'
      },
      rejectRules: {
        content: []
      },
      total: 1,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        status: ''
      },
      rowId: '',
      imgArr: [],
      imgPathStr: '',
      listLoading: true,
      reviewIndex: null,
      penaltyAppealStatus: penaltyAppealStatus.list,
      imgsUpload: [], // 审核时图片统一上传时 promise.all 的参数
      imgsFiles: [] // 审核时选中所有的文件
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery)
        .then((res) => {
          const { data } = res
          this.dangerCom = data.list
          this.total = data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.listLoading = false
          throw err
        })
    },
    resetQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        status: ''
      }
      this.getList()
    },
    closeDetail() {
      // 关闭前清空已经选中的数据
      this.dialogVisible = false
      this.reviewInfo.content = '审核通过，经核实确认申诉内容属实有效'
      this.imgArr = []
      this.imgPathStr = ''
      this.imgsFiles = []
    },
    previewImg(file) {
      this.imgsFiles.push(file.raw)
    },
    // 根据文件 uid 在 this.imgsFiles 中删除对应数据
    handleRemove(file) {
      this.imgsFiles.forEach((item, index) => {
        if (file.raw.uid === item.uid) {
          this.imgsFiles.splice(index, 1)
        }
      })
    },
    submit() {
      this.$refs['rejectForm'].validate(valid => {
        if (valid) {
          let status = 1
          this.listLoading = true
          if (this.reviewInfo.content === '审核不通过，经核实确认存在违章行为申诉无效') status = 2
          // 循环已选中的图片文件，拼凑出 promise.all 的参数
          this.imgsFiles.forEach(item => {
            const form = new FormData()
            form.append('fileName', item)
            this.imgsUpload.push(upload(form))
          })
          Promise.all(this.imgsUpload)
            .then(res => {
              for (const item of res) {
                const { fileUrl } = item.data
                this.imgArr.push(fileUrl)
              }
              this.imgPathStr = this.imgArr.join('；')
              handle({
                id: this.rowId,
                status,
                content: this.reviewInfo.content,
                pic: this.imgPathStr
              })
                .then(res => {
                  this.dialogVisible = false
                  this.$message({
                    message: '审核成功',
                    type: 'success'
                  })
                  this.getList()
                  this.reviewInfo.content = '审核通过，经核实确认申诉内容属实有效'
                  this.imgArr = []
                  this.imgPathStr = ''
                  this.imgsFiles = []
                  this.imgsUpload = []
                  this.listLoading = false
                })
                .catch(err => {
                  throw err
                })
            })
            .catch((err) => {
              this.listLoading = false
              this.$message({
                type: 'error',
                message: '图片过大，上传失败'
              })
              this.imgsUpload = []
              throw err
            })
        }
      })
    },
    showDetails(id, index) {
      this.dialogVisible = true
      this.dialogInfo.workPicUrl = []
      this.listLoading = true
      this.rowId = id
      detail({ id })
        .then((res) => {
          const { data } = res
          this.dialogInfo.details = { ...data }
          this.dialogInfo.details.index = index + 1
          let pathArr = []; let handleArr = []
          if (data.contentPic) { pathArr = data.contentPic.split('；') }
          if (data.handlePic) { handleArr = data.handlePic.split('；') }
          for (let i = 0; i < pathArr.length; i++) {
            pathArr[i] = 'https://www.image.gosmooth.com.cn' + pathArr[i]
          }
          for (let i = 0; i < handleArr.length; i++) {
            handleArr[i] = 'https://www.image.gosmooth.com.cn' + handleArr[i]
          }
          this.dialogInfo.workPicUrl = pathArr
          this.dialogInfo.handlePic = handleArr
          console.log(this.dialogInfo.workPicUrl, '申诉图片')
          console.log(this.dialogInfo.handlePic, '审核图片')
          this.listLoading = false
        })
        .catch((err) => {
          this.listLoading = false
          throw err
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.work-card {
  .main-table {
    .driver {
      padding: 0 5px;
    }

    .show-detail {
      cursor: pointer;
      display: block;
    }
    .orange {
      color: #f79204;
    }
    .green {
      color: #0abb05;
    }
    .red {
      color: #f21313;
    }
    .btn {
      margin: 0 3px;
    }
  }
  .dialog {
    p {
      margin: 8px 0;
    }
    .img-tit {
      margin-top: 20px;
    }
    .dialog-imgs {
      .img-con {
        text-align: center;
        display: inline-block;
        .dialog-img {
          width: 180px;
          height: 150px;
          margin: 10px 13px;
        }
      }
    }
    ::v-deep .el-dialog__header {
      padding: 0 ;
      height: 10px ;
    }

  }
}
</style>

<style lang="scss">
.work-card {
  .dialog {
    .el-dialog__body {
      max-height: 500px;
      overflow: auto;
      padding-top: 10px;
    }
  }
}
</style>
