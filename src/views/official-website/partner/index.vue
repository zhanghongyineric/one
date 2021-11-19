<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">
            <!-- <el-col :md="8" :sm="24">
              <el-form-item label="关键字:">
                <el-input
                  v-model="listQuery.keyword"
                  placeholder="请输入关键字"
                  clearable
                />
              </el-form-item>
            </el-col> -->

            <el-col :md="(!advanced && 8) || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="
                  (advanced && { float: 'right', overflow: 'hidden' }) || {}
                "
              >
                <el-button type="primary" size="small" @click="openDialog('add')">新增</el-button>
                <el-button type="primary" size="small" @click="getList()">刷新</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        ref="newsTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          label="编号"
          type="index"
          width="60"
          align="center"
        />
        <el-table-column label="公司名称" prop="summary" />
        <el-table-column
          label="公司图标"
          prop="imgUrl"
          show-overflow-tooltip
        />

        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="openDialog('modify',scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteParter(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="新增"
        :visible.sync="visible"
        custom-class="base-dialog dialog-col-1"
        :before-close="closeDialog"
      >
        <el-form
          ref="addForm"
          :model="addFormData"
          label-width="90px"
          :rules="rules"
        >
          <el-form-item
            label="公司名称:"
            prop="summary"
          >
            <el-input v-model="addFormData.summary" placeholder="请输入公司名称" clearable />
          </el-form-item>

          <p style="margin-left: 18px"><b>公司图标：</b>（最多4张）</p>
          <el-upload
            ref="upload"
            action
            list-type="picture-card"
            :auto-upload="false"
            :limit="4"
            :multiple="true"
            :on-change="previewImg"
            :on-remove="handleRemove"
            style="margin-left: 45px"
            :file-list="fileList"
          >
            <i slot="default" class="el-icon-plus" />
          </el-upload>
        </el-form>
        <p style="margin-left: 45%;margin-top: 20px">
          <el-button type="primary" @click="submit()">确 定</el-button>
        </p>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { save, selectFind, delPartner } from '@/api/official-website/partner'
import { upload } from '@/api/official-website/news'

export default {
  name: 'Partner',
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: ''
      },
      listLoading: false,
      list: [],
      advanced: false,
      visible: false,
      addFormData: {
        summary: '',
        imgUrl: '',
        creator: '',
        creatorNo: '',
        updator: '',
        updatorNo: ''
      },
      fileList: [],
      rules: {
        summary: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
      },
      imgsFiles: [],
      modify: false,
      imgArr: [],
      currentRow: {},
      imgsUpload: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      selectFind({ ...this.listQuery })
        .then(res => {
          const { data } = res
          this.list = data.list
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    closeDialog() {
      this.visible = false
      this.fileList = []
    },
    previewImg(file) {
      this.imgsFiles.push(file.raw)
      if (this.modify) this.fileList.push(file)
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
    // 组成promise.all的参数数组
    allImgReq() {
      this.imgsFiles.forEach(item => {
        const form = new FormData()
        form.append('fileName', item)
        this.imgsUpload.push(upload(form))
      })
    },
    submit() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          this.allImgReq()
          Promise.all(this.imgsUpload)
            .then(res => {
              for (const item of res) {
                const { fileUrl } = item.data
                this.imgArr.push(fileUrl)
              }
              // 判断是修改还是新增，并将原有的数据与现有数据进行比对、重组合
              if (this.modify) {
                this.addFormData.imgUrl = this.imgArr.join(';')
                const arr = []
                this.fileList.forEach(item => {
                  arr.push(item.url.split('.cn')[1])
                })
                if (this.addFormData.imgUrl) this.addFormData.imgUrl = this.addFormData.imgUrl.concat(';', arr.join(';'))
                else this.addFormData.imgUrl = arr.join(';')
                const lastarr = this.addFormData.imgUrl.split(';')
                if (lastarr[lastarr.length - 1] === '' || lastarr[lastarr.length - 1][1] !== 'm') {
                  lastarr.pop()
                }
                this.addFormData.imgUrl = lastarr.join(';')
              } else this.addFormData.imgUrl = this.imgArr.join(';')

              this.addFormData.creator = this.$store.state.user.name
              this.addFormData.updator = this.$store.state.user.name
              this.addFormData.creatorNo = this.$store.state.user.userId
              this.addFormData.updatorNo = this.$store.state.user.userId

              let req = { ...this.addFormData }
              if (this.modify) req = { ...this.addFormData, id: this.currentRow.id }

              save(req)
                .then(res => {
                  this.$message({
                    message: `${this.modify ? '修改成功' : '新增成功'}`,
                    type: 'success'
                  })
                  this.visible = false
                  this.getList()
                  this.resetFormData()
                  this.resetDialogData()
                })
                .catch(err => {
                  this.listLoading = false
                  throw err
                })
            })
        }
      })
    },
    // 重置表单数据
    resetFormData() {
      this.addFormData = {
        summary: '',
        imgUrl: '',
        creator: '',
        creatorNo: '',
        updator: '',
        updatorNo: ''
      }
    },
    // 清空弹框中的数据
    resetDialogData() {
      this.imgsUpload = []
      this.imgArr = []
      this.imgsFiles = []
      this.fileList = []
      this.$refs.upload.clearFiles()
    },

    openDialog(val, row) {
      this.visible = true
      this.currentRow = row
      if (val === 'add') this.modify = false
      else {
        this.modify = true
        this.addFormData.summary = row.summary
        if (row.imgUrl) {
          const urlArr = row.imgUrl.split(';')
          urlArr.forEach(item => {
            this.fileList.push({ url: `https://www.image.gosmooth.com.cn${item}` })
          })
        }
      }
    },
    deleteParter(row) {
      this.$confirm('确认删除该合作伙伴？')
        .then(() => {
          this.listLoading = true
          delPartner({ id: row.id })
            .then(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList()
            })
            .catch(err => {
              this.listLoading = false
              throw err
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
        })
    }
  }
}
</script>
