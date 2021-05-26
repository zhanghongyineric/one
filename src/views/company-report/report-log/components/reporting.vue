<!--
  - FileName: 报备中（违章管理）
  - @author: ZhouJiaXing
  - @date: 2021/5/6 下午4:23
  -->

<template>
  <div class="reporting">
    <!--搜索栏-->
    <div class="table-page-search-wrapper">
      <el-form :model="listQuery" label-width="80px" size="small">
        <el-row :gutter="48">

          <!--查询操作按钮-->
          <el-col>
            <div
              class="table-page-search-submitButtons"
              style=" float: right; overflow: hidden"
            >
              <el-button type="primary" size="small" @click="addLog">新增违章</el-button>
              <el-button type="primary" size="small" @click="submitLog">提交日志</el-button>
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
      <el-table-column
        label="编号"
        type="index"
        width="50"
        align="left"
      />
      <el-table-column label="车牌号" prop="plateId" />
      <el-table-column label="营运类型" prop="typeName" />
      <el-table-column label="驾驶员" prop="driverName" />
      <el-table-column label="违章类型" prop="violationType" />
      <el-table-column label="违章详细" prop="violationContent" min-width="200" show-overflow-tooltip />
      <el-table-column v-slot="{row}" label="违章日期" prop="violationTime" min-width="100px">
        {{ row.violationTime| dateFilter }}
      </el-table-column>
      <!--表格操作列-->
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确认删除吗？"
            style="margin-left:10px;margin-right:10px;"
            @confirm="handleDelete(row)"
          >
            <el-button slot="reference" size="mini" type="danger">
              删除
            </el-button>
          </el-popconfirm>
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

    <!--新增弹窗-->
    <el-dialog
      title="新增"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      custom-class="base-dialog dialog-col-1"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="createFormData"
        label-width="90px"
      >
        <h1>车辆</h1>
        <el-form-item
          label="车牌号:"
          prop="plateId"
        >
          <el-input v-model="createFormData.plateId" placeholder="例:川A3042R" />
        </el-form-item>
        <el-form-item
          label="营运类型:"
          prop="typeId"
        >
          <el-select
            v-model="createFormData.typeId"
            placeholder="请选择营运类型"
          >
            <el-option
              v-for="{label,value} in optionGroup.transport_type"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <div v-for="(item,index) in createFormData.breaks" :key="index">
          <h1>违章{{ index + 1 }}
            <el-button type="text" @click="deleteBreak(index)">删除</el-button>
            <el-button
              v-if="index === createFormData.breaks.length-1"
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              style="float: right"
              @click="addBreak"
            >违章
            </el-button>
          </h1>
          <el-form-item
            label="驾驶员:"
            :prop="`breaks.${index}.driverName`"
            :rules="{
              required: true, message: '请输入驾驶员', trigger: 'blur'
            }"
          >
            <el-input v-model="item.driverName" placeholder="请输入驾驶员" />
          </el-form-item>
          <el-form-item
            label="违章类型:"
            :prop="`breaks.${index}.violationTypeId`"
            :rules="{
              required: true, message: '请选择违章类型', trigger: 'change'
            }"
          >
            <el-select
              v-model="item.violationTypeId"
              placeholder="请选择违章类型"
            >
              <el-option
                v-for="{label,value} in optionGroup.violation_type"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="违章时间:"
            :prop="`breaks.${index}.time`"
            :rules="{
              required: true, message: '请输入违章时间', trigger: 'change'
            }"
            class="illegal-time"
          >
            <el-date-picker
              v-model="item.date"
              disabled
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
            <el-time-picker
              v-model="item.time"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="选择时间"
            />
          </el-form-item>
          <el-form-item
            label="违章详细:"
            :prop="`breaks.${index}.violationContent`"
            :rules="{
              required: true, message: '请输入违章详细:', trigger: 'blur'
            }"
          >
            <el-input v-model="item.violationContent" type="textarea" placeholder="请输入违章详细" />
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="buttonLoading" @click="createData">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--编辑弹窗-->
    <el-dialog
      title="编辑"
      :visible.sync="dialogFormVisible_edit"
      :close-on-click-modal="false"
      custom-class="base-dialog dialog-col-1"
    >
      <el-form
        ref="dataForm_edit"
        :rules="rules"
        :model="editFormData"
        label-width="90px"
      >
        <h1>车辆</h1>
        <el-form-item
          label="车牌号:"
          prop="plateId"
        >
          <el-input v-model="editFormData.plateId" placeholder="例:川A3042R" />
        </el-form-item>
        <el-form-item
          label="营运类型:"
          prop="typeId"
        >
          <el-select
            v-model="editFormData.typeId"
            placeholder="请选择营运类型"
          >
            <el-option
              v-for="{label,value} in optionGroup.transport_type"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <h1>违章</h1>
        <el-form-item
          label="驾驶员:"
          prop="driverName"
          :rules="{
            required: true, message: '请输入驾驶员', trigger: 'blur'
          }"
        >
          <el-input v-model="editFormData.driverName" placeholder="请输入驾驶员" />
        </el-form-item>
        <el-form-item
          label="违章类型:"
          prop="violationTypeId"
          :rules="{
            required: true, message: '请选择违章类型', trigger: 'change'
          }"
        >
          <el-select
            v-model="editFormData.violationTypeId"
            placeholder="请选择违章类型"
          >
            <el-option
              v-for="{label,value} in optionGroup.violation_type"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="违章时间:"
          prop="time"
          :rules="{
            required: true, message: '请输入违章时间', trigger: 'change'
          }"
          class="illegal-time"
        >
          <el-date-picker
            v-model="editFormData.date"
            disabled
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
          <el-time-picker
            v-model="editFormData.time"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item
          label="违章详细:"
          prop="violationContent"
          :rules="{
            required: true, message: '请输入违章详细:', trigger: 'blur'
          }"
        >
          <el-input
            v-model="editFormData.violationContent"
            type="textarea"
            placeholder="请输入违章详细"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">
          取消
        </el-button>
        <el-button type="primary" :loading="buttonLoading" @click="updateData">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  addViolation,
  deleteViolation,
  fetchViolation, submitReport,
  updateViolation
} from '@/api/company-report/report-log'
import Pagination from '@/components/Pagination' // 分页

import { isCarId, parseTime } from '@/utils'

const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'Reporting',
  components: { Pagination },
  filters: {
    dateFilter: function(date) {
      return parseTime(new Date(date))
    }
  },
  data() {
    // 设置date为昨天8:00
    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24)
    date.setHours(8)
    date.setMinutes(0)
    date.setSeconds(0)

    // 默认表单数据
    const defaultTypeId = onlineOption.transport_type.list[0] && onlineOption.transport_type.list[0].value
    const defaultViolationTypeId = onlineOption.violation_type.list[0] && onlineOption.violation_type.list[0].value

    // 校验规则
    const carIdValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入车牌号'))
      } else if (!isCarId(value)) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        callback()
      }
    }
    return {
      address: null,
      dialogFormVisible: false,
      dialogFormVisible_edit: false,
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      optionGroup: {
        transport_type: onlineOption.transport_type.list,
        violation_type: onlineOption.violation_type.list
      }, // 存放选项的数据
      createFormDataBreak: {
        driverName: '',
        violationTypeId: defaultViolationTypeId,
        violationContent: '',
        date: new Date(date),
        time: new Date(date)
      }, // 违章的基本字段
      createFormData: {
        plateId: '',
        typeId: defaultTypeId,
        breaks: [{
          driverName: '',
          violationTypeId: defaultViolationTypeId,
          violationContent: '',
          date: new Date(date),
          time: new Date(date)
        }]// 多个违章
      }, // 存储新增的数据
      createFormDataTemp: {
        plateId: '',
        typeId: defaultTypeId,
        breaks: []// 多个违章
      }, // 用于重置新增的数据

      editFormData: {}, // 存储编辑的数据
      rules: {
        plateId: [{ required: true, validator: carIdValidator, trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择营运类型', trigger: 'change' }]
      }, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogStatus: '',
      poiPicker: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 提交日志
    submitLog() {
      this.$confirm('日志提交后无法修改，请仔细核对，确认无误后提交', '确认提交日志', {
        confirmButtonText: '确认提交',
        cancelButtonText: '返回修改',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '日志提交中,请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        // 发送请求
        submitReport().then(res => {
          loading.close()
          this.$emit('update:status', '2')// 更改状态为已完成
        }).catch(e => {
          loading.close()
        })
      }).catch(() => {
        console.log('取消提交')
      })
    },
    // 添加一个违章
    addBreak() {
      this.createFormData.breaks.push({ ...this.createFormDataBreak })
    },
    // 删除一个违章
    deleteBreak(index) {
      if (this.createFormData.breaks.length === 1) {
        this.$message('请至少保留一个违章')
        return
      }
      this.createFormData.breaks.splice(index, 1)
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchViolation(this.listQuery).then(({ data }) => {
        this.list = data
        // this.total = total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 点击新增按钮
    addLog() {
      this.resetCreateFormData()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp, breaks: [{ ...this.createFormDataBreak }] }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true

          // 根据id设置车辆类型
          this.createFormData.typeName = onlineOption.transport_type.map[this.createFormData.typeId]

          // 违章数据格式化
          const breaks = this.createFormData.breaks.map(item => {
            // 处理日期
            const date = new Date(item.date)
            const hour = item.time.getHours()
            const minute = item.time.getMinutes()
            const seconds = item.time.getSeconds()

            date.setHours(hour)
            date.setMinutes(minute)
            date.setSeconds(seconds)

            // 根据id设置违章名称
            item.violationType = onlineOption.violation_type.map[item.violationTypeId]

            return {
              ...item,
              violationTime: parseTime(date)
            }
          })

          console.log({ ...this.createFormData, breaks })
          addViolation({ ...this.createFormData, breaks }).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },

    // 点击编辑
    handleUpdate(row) {
      this.editFormData = { ...row, date: new Date(row.violationTime), time: new Date(row.violationTime) }
      console.log(this.editFormData)
      this.dialogFormVisible_edit = true
      this.$nextTick(() => {
        this.$refs['dataForm_edit'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm_edit'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true

          // 根据id设置车辆类型
          this.editFormData.typeName = onlineOption.transport_type.map[this.editFormData.typeId]
          // 根据id设置违章名称
          this.editFormData.violationType = onlineOption.violation_type.map[this.editFormData.violationTypeId]

          // 处理日期
          const date = new Date(this.editFormData.date)
          const hour = this.editFormData.time.getHours()
          const minute = this.editFormData.time.getMinutes()
          const seconds = this.editFormData.time.getSeconds()

          date.setHours(hour)
          date.setMinutes(minute)
          date.setSeconds(seconds)

          this.editFormData.violationTime = parseTime(date)

          updateViolation(this.editFormData).then(() => {
            this.dialogFormVisible_edit = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },
    // 删除数据
    handleDelete(row) {
      this.listLoading = true
      deleteViolation({ logId: row.logId }).then(() => {
        this.listLoading = false
        // if (this.list.length === 1 && this.listQuery.pageNum !== 1) {
        //   this.listQuery.pageNum--
        // }
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch((e) => {
        this.listLoading = false
        console.log(e)
      })
    }

  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
.reporting {
  h1 {
    font-size: 20px;
    font-weight: normal;
  }

  .illegal-time {
    ::v-deep .el-form-item__content {
      display: flex;

      .el-date-editor--date {
        margin-right: 5px;
      }
    }
  }
}
</style>

