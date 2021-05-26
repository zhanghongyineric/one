<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--新增维度-->
      <el-button class="add-type" type="primary" size="small" @click="addType">新增维度</el-button>
      <!--表格-->
      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="tableList"
        empty-text="点击新增维度后，来添加标签"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="50" />
        <el-table-column prop="typeName" label="评价维度" min-width="120" />
        <el-table-column prop="tagList" label="标签" min-width="300">
          <template slot-scope="scope">
            <div class="flex">
              <span v-for="marker in scope.row.tagList" :key="marker.tagName" class="row-marker">
                {{ marker.tagName }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="120">
          <template slot-scope="scope">
            <span :class="scope.row.status === '0' ? 'green' : 'red'">
              {{ statusList[scope.row.status] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="addMarker(scope.row)"
            >新增</el-button>
            <el-button
              size="small"
              type="success"
              @click="editType(scope.row)"
            >修改</el-button>
            <el-popconfirm
              title="确定删除该维度吗？"
              @confirm="deleteType(scope.row)"
            >
              <el-button
                slot="reference"
                size="small"
                type="danger"
                class="table-btn"
              >删除</el-button>
            </el-popconfirm>
            <el-popconfirm
              v-if="scope.row.status === '0'"
              title="确定禁用该维度吗？"
              @confirm="disableType(scope.row)"
            >
              <el-button
                slot="reference"
                size="small"
                type="info"
                class="table-btn"
              >禁用</el-button>
            </el-popconfirm>
            <el-popconfirm
              v-if="scope.row.status === '1'"
              title="确定禁用该维度吗？"
              @confirm="disableType(scope.row)"
            >
              <el-button
                slot="reference"
                size="small"
                type="warning"
                class="table-btn"
                :disabled="!scope.row.tagList.length"
              >启用</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <!--<Pagination-->
      <!--  v-show="total>0"-->
      <!--  :total="total"-->
      <!--  :page.sync="listQuery.pageNum"-->
      <!--  :limit.sync="listQuery.pageSize"-->
      <!--  @pagination="getList"-->
      <!--/>-->

      <!--新增、修改维度-->
      <el-dialog
        :title="typeTitle"
        :visible.sync="typeDialogVisible"
        width="40%"
      >
        <div>
          <el-form ref="typeForm" label-width="80px" :rules="rules" :model="form">
            <el-form-item label="维度名称" prop="typeName">
              <el-input v-model.trim="form.typeName" placeholder="请输入维度名称" />
            </el-form-item>
            <div v-if="!typeIsAdd">
              <div><b>当前标签</b>（双击修改标签名称）</div>
              <div v-if="!currMarkers.length" class="no-markers">暂未设置标签</div>
              <div class="flex">
                <EditMarker
                  v-for="(marker,index) in currMarkers"
                  :key="marker.tagName"
                  :value.sync="marker.tagName"
                  @delete="deleteMaker(index)"
                />
              </div>
            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            :loading="typeSubLoading"
            type="primary"
            size="small"
            @click="submit"
          >确定</el-button>
          <el-button size="small" @click="typeDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>

      <!--新增标签-->
      <el-dialog
        title="新增标签"
        :visible.sync="markerDialogVisible"
        width="40%"
      >
        <div>
          <el-form ref="markerForm" label-width="80px" :model="markerForm" :rules="markerRules">
            <el-form-item label="标签内容" prop="tagName">
              <el-input
                v-model.trim="markerForm.tagName"
                placeholder="请输入标签内容"
                maxlength="8"
              />
              <span>输入标签内容不超过8字</span>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            :loading="markerSubLoading"
            type="primary"
            size="small"
            @click="submitMarker"
          >确定</el-button>
          <el-button size="small" @click="markerDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination' // 分页
import { getMarkersList, setMarkers } from '@/api/government-report/government-report.js'
import EditMarker from '@/components/EditMarker'
export default {
  name: 'MarkersManage',
  components: { EditMarker },
  // components: {
  //   Pagination
  // },
  data() {
    return {
      tableList: [],
      statusList: {
        0: '已生效',
        1: '已禁用'
      },
      rules: {
        typeName: [{ required: true, message: '请输入标签内容', trigger: 'blur' }]
      },
      form: { typeName: '' },
      listLoading: false,
      typeSubLoading: false,
      typeDialogVisible: false,
      typeTitle: '新增维度',
      markerDialogVisible: false,
      typeIsAdd: false,
      flag: false,
      currMarkers: [],
      markerRules: {
        tagName: [{ required: true, message: '请输入标签内容', trigger: 'blur' }]
      },
      markerForm: {
        tagName: '',
        typeId: ''
      },
      markerSubLoading: false,
      loading: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMarkersList()
        .then(res => {
          this.tableList = res.data
          // this.total = res.data.total
          this.listLoading = false
        }).catch(err => {
          this.listLoading = false
          throw err
        })
    },
    addType() {
      this.$refs['typeForm'] && this.$refs['typeForm'].resetFields()
      this.typeIsAdd = true
      this.typeTitle = '新增维度'
      this.form = {}
      this.currMarkers = []
      this.typeDialogVisible = true
    },
    addMarker(row) {
      this.$refs['markerForm'] && this.$refs['markerForm'].resetFields()
      this.markerForm.typeId = row.id
      this.markerDialogVisible = true
    },
    editType(row) {
      this.$refs['typeForm'] && this.$refs['typeForm'].resetFields()
      this.typeIsAdd = false
      this.typeTitle = '修改维度'
      this.form = JSON.parse(JSON.stringify(row))
      this.currMarkers = this.form.tagList
      this.typeDialogVisible = true
    },
    deleteType(row) {
      this.loading = this.setLoading()
      setMarkers({ typeId: row.id }, 'type/delete')
        .then(res => {
          this.getList()
          this.loading.close()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          this.loading.close()
          throw err
        })
    },
    disableType(row) {
      this.loading = this.setLoading()
      const text = row.status === '1' ? '启用' : '禁用'
      setMarkers({ typeId: row.id }, 'type/status')
        .then(res => {
          this.getList()
          this.$message({
            message: `${text}成功`,
            type: 'success'
          })
          this.loading.close()
        }).catch(err => {
          this.loading.close()
          throw err
        })
    },
    deleteMaker(index) {
      this.currMarkers.splice(index, 1)
    },
    submit() {
      this.typeSubLoading = true
      const url = this.form.id ? 'update' : 'type/save'
      this.$refs['typeForm'].validate((valid) => {
        if (valid) {
          setMarkers(this.form, url)
            .then(res => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getList()
              this.typeDialogVisible = false
              this.typeSubLoading = false
            }).catch(err => {
              this.typeSubLoading = false
              throw err
            })
        } else {
          this.typeSubLoading = false
          return false
        }
      })
    },
    submitMarker() {
      this.markerSubLoading = true
      this.$refs['markerForm'].validate((valid) => {
        if (valid) {
          setMarkers(this.markerForm, 'save')
            .then(res => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getList()
              this.markerDialogVisible = false
              this.markerSubLoading = false
            }).catch(err => {
              this.markerSubLoading = false
              throw err
            })
        } else {
          this.markerSubLoading = false
          return false
        }
      })
    },
    setLoading() {
      return this.$loading({
        lock: true,
        text: '处理中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.add-type {
  margin-bottom: 20px;
}
.no-markers {
  margin: 20px;
  color: #999;
}
.table-btn {
  margin-left: 10px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  .row-marker {
    border-radius: 5px;
    background-color: #888;
    color: #fff;
    margin: 5px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
  }
}
.el-dialog__footer {
  text-align: right;
}
.green {
  color: #42B983;
}
.red {
  color: #FF2525;
}
</style>
