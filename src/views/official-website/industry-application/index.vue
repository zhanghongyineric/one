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
        <el-table-column label="标题" prop="title" show-overflow-tooltip />
        <!-- <el-table-column
          label="内容"
          prop="content"
          show-overflow-tooltip
        /> -->
        <el-table-column
          label="图片链接"
          prop="summaryImg"
          show-overflow-tooltip
        />
        <el-table-column
          label="概要"
          prop="summaryDesc"
          show-overflow-tooltip
        />
        <el-table-column
          label="发布时间"
          prop="releaseDate"
          width="170"
        />
        <el-table-column
          label="更新时间"
          prop="updateTime"
          width="170"
        />
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.releaseDate" type="primary" size="mini" @click="releaseData(scope.row)">发布</el-button>
            <el-button v-if="scope.row.releaseDate" type="primary" size="mini" disabled>发布</el-button>
            <el-button type="warning" size="mini" @click="openDialog('modify', scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="modify ? '修改' : '新增'"
        :visible.sync="visible"
        custom-class="base-dialog"
        :before-close="closeDialog"
        top="6vh"
      >
        <el-form
          ref="addForm"
          :model="addFormData"
          label-width="90px"
          :rules="rules"
        >
          <el-form-item
            label="标题:"
            prop="title"
          >
            <el-input v-model="addFormData.title" placeholder="请输入标题" clearable />
          </el-form-item>

          <el-form-item
            label="描述:"
            prop="summaryDesc"
          >
            <el-input v-model="addFormData.summaryDesc" placeholder="请输入概要描述" clearable />
          </el-form-item>

          <el-form-item
            label="内容:"
            prop="content"
          >
            <quill-editor
              ref="myQuillEditor"
              v-model="addFormData.content"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            />
          </el-form-item>

          <p style="margin-left: 45px"><b>上传图片：</b>（只能1张）</p>
          <el-upload
            ref="upload"
            action
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
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
import { save, selectFind, delData, release, selectAll } from '@/api/official-website/industry-application'
import { upload } from '@/api/official-website/news'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'IndustryApplication',
  components: {
    quillEditor
  },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: ''
      },
      advanced: false,
      list: [],
      listLoading: false,
      visible: false,
      addFormData: {
        title: '',
        content: '',
        summaryImg: '',
        summaryDesc: '',
        creator: '',
        type: '',
        creatorNo: '',
        updator: '',
        updatorNo: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        summaryDesc: [{ required: true, message: '请输入概要描述', trigger: 'blur' }],
        content: [{ required: true, message: '请输入详细内容', trigger: 'blur' }]
      },
      editorOption: {},
      imgsUpload: [],
      fileList: [],
      imgsFiles: [],
      imgArr: [],
      currentRow: {},
      modify: false
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
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
    // 组成promise.all的参数数组
    allImgReq() {
      this.imgsFiles.forEach(item => {
        const form = new FormData()
        form.append('fileName', item)
        this.imgsUpload.push(upload(form))
      })
    },
    deleteData(row) {
      this.$confirm('确定删除该条数据吗？')
        .then(() => {
          this.listLoading = true
          delData({ id: row.id })
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
                this.addFormData.summaryImg = this.imgArr.join(';')
                if (!this.addFormData.summaryImg) this.addFormData.summaryImg = this.fileList[0].url.split('.cn')[1]
                // console.log(this.addFormData.summaryImg,'****');
                // const arr = []
                // this.fileList.forEach(item => {
                //   arr.push(item.url.split('.cn')[1])
                // })
                // this.addFormData.summaryImg = this.addFormData.summaryImg.concat(';', arr.join(';'))
                // this.addFormData.summaryImg = this.addFormData.summaryImg.slice(0, this.addFormData.summaryImg.length - 1)
                // const lastarr = this.addFormData.summaryImg.split(';')
                // if (lastarr[lastarr.length - 1] === '')lastarr.pop()
                // this.addFormData.summaryImg = lastarr.join(';')
              } else this.addFormData.summaryImg = this.imgArr.join(';')
              // 为提交接口拼凑请求参数
              this.addFormData.creator = this.$store.state.user.name
              this.addFormData.updator = this.$store.state.user.name
              this.addFormData.creatorNo = this.$store.state.user.userId
              this.addFormData.updatorNo = this.$store.state.user.userId

              let req = { ...this.addFormData }
              if (this.modify) req = { ...this.addFormData, id: this.currentRow.id }

              save(req)
                .then(res => {
                  this.$message({
                    message: `${this.modify ? '修改成功!' : '新增成功!'}`,
                    type: 'success'
                  })
                  this.visible = false
                  this.resetDialogData()
                  this.resetFormData()
                  this.getList()
                })
                .catch(err => {
                  this.listLoading = false
                  throw err
                })
            })
            .catch((err) => {
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
    openDialog(val, row) {
      this.visible = true
      this.currentRow = row
      if (val === 'add') this.modify = false
      else {
        this.modify = true
        this.listLoading = true
        selectAll({ id: row.id })
          .then(res => {
            const { data } = res
            this.addFormData.content = data.content
            this.listLoading = false
          })
          .catch(err => {
            this.listLoading = false
            throw err
          })
        this.addFormData.title = row.title
        this.addFormData.summaryDesc = row.summaryDesc
        if (row.summaryImg) {
          const urlArr = row.summaryImg.split(';')
          urlArr.forEach(item => {
            this.fileList.push({ url: `https://www.image.gosmooth.com.cn${item}` })
          })
        }
      }
    },
    closeDialog() {
      this.visible = false
      this.resetFormData()
      this.fileList = []
      this.$refs.upload.clearFiles()
    },
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
    // 重置表单数据
    resetFormData() {
      this.addFormData = {
        title: '',
        content: '',
        summaryImg: '',
        summaryDesc: '',
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
    releaseData(row) {
      this.listLoading = true
      release({
        id: parseInt(row.id),
        state: '1'
      })
        .then(res => {
          this.$message({
            message: '发布成功!',
            type: 'success'
          })
          this.getList()
        })
        .catch(err => {
          this.listLoading = false
          this.$message({
            message: '发布失败!',
            type: 'error'
          })
          throw err
        })
    },
    onEditorReady(editor) {}, // 准备编辑器
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {} // 内容改变事件
  }
}
</script>
