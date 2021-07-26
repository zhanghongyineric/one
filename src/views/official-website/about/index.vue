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
          width="50"
          align="left"
        />
        <el-table-column label="所属类别" prop="type" />
        <el-table-column label="展示名" prop="name" />
        <!-- <el-table-column
          label="描述内容"
          prop="content"
          show-overflow-tooltip
        /> -->
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="更新时间" prop="updateTime" />

        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="openDialog('modify',scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="modify ? '修改' : '新增'"
        :visible.sync="visible"
        custom-class="base-dialog"
        :before-close="closeDialog"
        top="10px"
      >
        <el-form
          ref="addForm"
          :model="addFormData"
          label-width="90px"
          :rules="rules"
        >
          <el-form-item label="类别" prop="type">
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

          <el-form-item
            label="展示名:"
            prop="name"
          >
            <el-input v-model="addFormData.name" placeholder="请输入展示名" clearable />
          </el-form-item>

          <el-form-item label="详细内容:" prop="content">
            <quill-editor
              ref="myQuillEditor"
              v-model="addFormData.content"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            />
          </el-form-item>
        </el-form>
        <p style="margin-left: 45%;margin-top: 20px">
          <el-button type="primary" @click="submit()">确 定</el-button>
        </p>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { selectFind, save, delData, selectAll } from '@/api/official-website/about'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'About',
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
      listLoading: false,
      list: [],
      advanced: false,
      modify: false,
      visible: false,
      addFormData: {
        name: '',
        content: '',
        creator: '',
        creatorNo: '',
        updator: '',
        updatorNo: '',
        type: ''
      },
      typeOptions: [
        {
          label: '产品服务',
          value: '1'
        },
        {
          label: '关于我们',
          value: '2'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入展示名', trigger: 'blur' }],
        content: [{ required: true, message: '请输入详细内容', trigger: 'blur' }],
        type: [{ required: true, message: '请选择所属类别', trigger: 'change' }]
      },
      editorOption: {},
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
      selectFind({ ...this.listQuery })
        .then(res => {
          const { data } = res
          data.list.forEach(item => {
            if (item.type === '1') {
              item.type = '产品服务'
            } else if (item.type === '2') {
              item.type = '关于我们'
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
    },
    openDialog(val, row) {
      this.visible = true
      if (val !== 'add') {
        this.currentRow = row
        selectAll({ id: row.id })
          .then(res => {
            const { data } = res
            this.addFormData.content = data.content
          })
          .catch(err => {
            throw err
          })
        this.addFormData.name = row.name
        this.addFormData.type = row.type
        this.modify = true
      } else this.modify = false
    },
    resetFormData() {
      this.addFormData = {
        name: '',
        content: '',
        creator: '',
        creatorNo: '',
        updator: '',
        updatorNo: '',
        type: ''
      }
    },
    submit() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.listLoading = true

          let req = {}
          if (this.modify) {
            this.addFormData.updator = this.$store.state.user.name
            this.addFormData.updatorNo = this.$store.state.user.userId
            req = { id: this.currentRow.id, ...this.addFormData }
          } else {
            this.addFormData.creator = this.$store.state.user.name
            this.addFormData.creatorNo = this.$store.state.user.userId
            req = { ...this.addFormData }
          }

          if (req.type === '产品服务') {
            req.type = '1'
          } else if (req.type === '关于我们') {
            req.type = '2'
          }

          save(req)
            .then(res => {
              this.listLoading = false
              this.visible = false
              this.getList()
              this.resetFormData()
              this.$message({
                type: 'success',
                message: `${this.modify ? '修改成功!' : '新增成功!'}`
              })
            })
            .catch(err => {
              throw err
            })
        }
      })
    },
    deleteData(row) {
      this.$confirm('确认删除该条数据？')
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
    onEditorReady(editor) {}, // 准备编辑器
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {} // 内容改变事件
  }
}
</script>
