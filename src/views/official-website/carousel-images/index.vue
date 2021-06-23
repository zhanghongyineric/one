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
          type="index"
          label="编号"
          width="50"
        />
        <el-table-column label="归属" prop="typeDesc" width="200" />
        <el-table-column label="图片链接" prop="imageUrl" show-overflow-tooltip />
        <el-table-column label="更新时间" prop="updateTime" />
        <!--表格操作列-->
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="openDialog('modify', scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增轮播图弹框 -->
      <el-dialog
        :title="modify ? '修改' : '新增'"
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
import { selectFind, save, deleteData } from '@/api/official-website/carousel'
import { upload } from '@/api/official-website/news'

export default {
  name: 'CarouselImages',
  data() {
    return {
      visible: false,
      list: [],
      listLoading: false,
      advanced: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: ''
      },
      addFormData: {
        typeDesc: '',
        creator: '',
        type: '',
        creatorNo: '',
        imageUrl: '',
        updator: '',
        updatorNo: ''
      },
      typeOptions: [
        {
          label: '首页',
          value: '1'
        },
        {
          label: '产品与服务',
          value: '2'
        },
        {
          label: '行业应用',
          value: '3'
        },
        {
          label: '关于我们',
          value: '4'
        },
        {
          label: '合作伙伴',
          value: '5'
        }
      ],
      rules: {
        type: [{ required: true, message: '请选择所属类型', trigger: 'change' }]
      },
      fileList: [],
      imgsFiles: [],
      imgsUpload: [],
      imgArr: [],
      modify: false,
      currentRow: {}
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
          this.listLoading = false
          this.list = data.list
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    openDialog(val, row) {
      this.visible = true
      this.currentRow = row
      if (val === 'add') this.modify = false
      else {
        this.modify = true
        this.addFormData.type = row.type
        if (row.imageUrl) {
          const urlArr = row.imageUrl.split(';')
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
        typeDesc: '',
        creator: '',
        type: '',
        creatorNo: '',
        imageUrl: '',
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
                this.addFormData.imageUrl = this.imgArr.join(';')
                const arr = []
                this.fileList.forEach(item => {
                  arr.push(item.url.split('.cn')[1])
                })
                this.addFormData.imageUrl = this.addFormData.imageUrl.concat(';', arr.join(';'))

                const lastarr = this.addFormData.imageUrl.split(';')
                if (lastarr[lastarr.length - 1] === '')lastarr.pop()
                this.addFormData.imageUrl = lastarr.join(';')
              } else this.addFormData.imageUrl = this.imgArr.join(';')

              // this.addFormData.imageUrl = this.imgArr.join(';')
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
    closeDialog() {
      this.visible = false
      this.fileList = []
    },
    // 组成promise.all的参数数组
    allImgReq() {
      this.imgsFiles.forEach(item => {
        const form = new FormData()
        form.append('fileName', item)
        this.imgsUpload.push(upload(form))
      })
    },
    translateType() {
      switch (this.addFormData.type) {
        case '1':
          this.addFormData.typeDesc = '首页'
          break
        case '2':
          this.addFormData.typeDesc = '产品与服务'
          break
        case '3':
          this.addFormData.typeDesc = '行业应用'
          break
        case '4':
          this.addFormData.typeDesc = '关于我们'
          break
        case '5':
          this.addFormData.typeDesc = '合作伙伴'
          break
        default:
          break
      }
    },
    delData(row) {
      this.$confirm('确认删除该条数据？')
        .then(() => {
          this.listLoading = true
          deleteData({ id: row.id })
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

<style scoped>

</style>
