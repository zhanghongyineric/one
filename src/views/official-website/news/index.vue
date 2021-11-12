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
        <el-table-column label="类别" prop="type" width="100" />
        <el-table-column label="标题" prop="title" show-overflow-tooltip />
        <el-table-column label="概要" prop="summaryDesc" show-overflow-tooltip />
        <!-- <el-table-column
          label="内容"
          prop="content"
          show-overflow-tooltip
        /> -->
        <!-- <el-table-column label="图片链接" prop="summaryImg" show-overflow-tooltip /> -->
        <el-table-column label="发布时间" prop="releaseDate" width="100" />
        <el-table-column label="更新时间" prop="updateTime" width="160" />
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.releaseDate" type="primary" size="mini" @click="release(scope.row)">发布</el-button>
            <el-button v-if="scope.row.releaseDate" type="primary" size="mini" disabled>发布</el-button>
            <el-button type="warning" size="mini" @click="openDialog('modify', scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delNews(scope.row)">删除</el-button>
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
            label="类别:"
            prop="type"
          >
            <el-select
              v-model="addFormData.type"
              placeholder="请选择所属类别"
            >
              <el-option
                v-for="{label,value} in typeOptions"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="标题:" prop="title">
            <el-input v-model="addFormData.title" placeholder="请输入文章标题" />
          </el-form-item>

          <el-form-item label="描述:" prop="summaryDesc">
            <el-input v-model="addFormData.summaryDesc" placeholder="请输入新闻概要描述" />
          </el-form-item>

          <el-form-item label="内容:" prop="content">
            <quill-editor
              ref="myQuillEditor"
              v-model="addFormData.content"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            />
          </el-form-item>

          <!-- <p style="margin-left: 45px"><b>上传图片：</b>（最多3张）</p>
          <el-upload
            ref="upload"
            action
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
            :multiple="true"
            :on-change="previewImg"
            :on-remove="handleRemove"
            style="margin-left: 45px"
            :file-list="fileList"
          >
            <i slot="default" class="el-icon-plus" />
          </el-upload> -->
        </el-form>
        <p style="margin-left: 45%;margin-top: 20px">
          <el-button type="primary" @click="submit()">确 定</el-button>
        </p>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { save, upload, deleteNews, getNews, releaseNews, selectAll } from '@/api/official-website/news'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'News',
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: {},
      visible: false,
      listLoading: false,
      advanced: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: ''
      },
      list: [],
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
      typeOptions: [
        {
          label: '公司动态',
          value: 1
        },
        {
          label: '行业动态',
          value: 2
        },
        {
          label: '技术快讯',
          value: 3
        }
      ],
      rules: {
        type: [{ required: true, message: '请选择所属类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
        summaryDesc: [{ required: true, message: '请输入新闻概要描述', trigger: 'blur' }],
        content: [{ required: true, message: '请输入新闻详细内容', trigger: 'blur' }]
      },
      imgsFiles: [],
      imgsUpload: [],
      imgArr: [],
      fileList: [],
      modify: false, // 判断是否为修改操作
      currentRow: {}
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
      getNews({ ...this.listQuery })
        .then(res => {
          const { data } = res
          data.list.forEach(item => {
            if (item.type === '1') {
              item.type = '公司动态'
            } else if (item.type === '2') {
              item.type = '行业动态'
            } else if (item.type === '3') {
              item.type = '技术快讯'
            }
          })
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
      this.resetFormData()
      this.fileList = []
      this.$refs.upload.clearFiles()
    },
    openDialog(val, row) {
      this.visible = true
      this.currentRow = row
      if (val === 'add') this.modify = false
      else {
        this.modify = true
        selectAll({ id: row.id })
          .then(res => {
            const { data } = res
            this.addFormData.content = data.content
          })
          .catch(err => {
            throw err
          })
        this.addFormData.title = row.title
        this.addFormData.summaryDesc = row.summaryDesc
        this.addFormData.type = row.type
        if (row.summaryImg) {
          const urlArr = row.summaryImg.split(';')
          urlArr.forEach(item => {
            this.fileList.push({ url: `https://www.image.gosmooth.com.cn${item}` })
          })
        }
      }
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
        type: '',
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
    // 将类别中文转换为对应的数字，用于接口传递
    translateType() {
      if (this.addFormData.type === '公司动态') {
        this.addFormData.type = '1'
      } else if (this.addFormData.type === '行业动态') {
        this.addFormData.type = '2'
      } else if (this.addFormData.type === '技术快讯') {
        this.addFormData.type = '3'
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
                this.addFormData.summaryImg = this.imgArr.join(';')
                const arr = []
                this.fileList.forEach(item => {
                  arr.push(item.url.split('.cn')[1])
                })
                this.addFormData.summaryImg = this.addFormData.summaryImg.concat(';', arr.join(';'))
                this.addFormData.summaryImg = this.addFormData.summaryImg.slice(0, this.addFormData.summaryImg.length - 1)
                const lastarr = this.addFormData.summaryImg.split(';')
                if (lastarr[lastarr.length - 1] === '')lastarr.pop()
                this.addFormData.summaryImg = lastarr.join(';')
              } else this.addFormData.summaryImg = this.imgArr.join(';')
              // 为提交接口拼凑请求参数
              this.addFormData.creator = this.$store.state.user.name
              this.addFormData.updator = this.$store.state.user.name
              this.addFormData.creatorNo = this.$store.state.user.userId
              this.addFormData.updatorNo = this.$store.state.user.userId
              this.translateType()
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
    delNews(row) {
      this.$confirm('确认删除该条新闻？')
        .then(() => {
          this.listLoading = true
          deleteNews({ id: parseInt(row.id) })
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
    release(row) {
      this.listLoading = true
      releaseNews({
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
