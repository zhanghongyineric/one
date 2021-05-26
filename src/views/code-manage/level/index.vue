<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--表格-->
      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="tabelList"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="50" />
        <el-table-column prop="levelName" label="等级名称" min-width="80" />
        <el-table-column label="安全码颜色" min-width="100">
          <template slot-scope="scope">
            <span
              v-if="scope.row.colorName === '绿码'"
              class="green-code"
            >绿码</span>
            <span
              v-else-if="scope.row.colorName === '蓝码'"
              class="blue-code"
            >蓝码</span>
            <span
              v-else-if="scope.row.colorName === '黄码'"
              class="yellow-code"
            >黄码</span>
            <span
              v-else-if="scope.row.colorName === '红码'"
              class="red-code"
            >红码</span>
            <span v-else>无码</span>
          </template>
        </el-table-column>
        <el-table-column prop="integralRule" label="积分规则" min-width="150">
          <!-- <template slot-scope="scope">
            <span v-if="!scope.row.maxScore && !scope.row.minScore">年龄不满足，资格证过期或吊销等等</span>
            <span v-else-if="!scope.row.maxScore">{{ scope.row.minScore }}及以上</span>
            <span v-else-if="!scope.row.minScore">{{ scope.row.maxScore }}及以下</span>
            <span v-else>{{ scope.row.minScore }}~{{ scope.row.maxScore }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="75" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              class="show-detail"
              size="small"
              @click="showDetails(scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        class="dialog"
        title="修改"
        :visible.sync="dialogVisible"
        width="30%"
        max-height="500"
        :before-close="cancel"
      >
        <el-form
          ref="dialogForm"
          :model="codeInfo"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="等级名称：" prop="levelName">
            <el-input
              v-model="codeInfo.levelName"
              placeholder="请输入等级名称"
            />
          </el-form-item>
          <el-form-item label="安全码颜色：" prop="colorName">
            <el-input
              v-model="codeInfo.colorName"
              placeholder="请输入安全码颜色"
            />
          </el-form-item>
          <el-form-item label="积分指数：" prop="scoreMin">
            <el-input
              v-model.number="codeInfo.scoreMin"
              placeholder="请输入最低分数"
            />
            <span class="dia-score">大于等于</span>
          </el-form-item>
          <el-form-item label="" prop="scoreMax">
            <el-input
              v-model.number="codeInfo.scoreMax"
              placeholder="请输入最高分数"
            />
            <span class="dia-score">小于等于</span>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination' // 分页
import { selectList, update } from '@/api/safe-code/code-level'

export default {
  name: 'Level',
  data() {
    // const chechMaxScore = (rule, value, callback) => {
    //   if (value && (value > 100 || value < 1)) {
    //     callback(new Error('最高分数只能为1-100的数字'))
    //   } else if (!value && !this.codeInfo.minScore) {
    //     callback(new Error('积分指数至少填写一个最大或最小值'))
    //   } else {
    //     callback()
    //   }
    // }
    // const chechMinScore = (rule, value, callback) => {
    //   if (value && (value > 99 || value < 0)) {
    //     callback(new Error('最低分数只能为0-99的数字'))
    //   } else if (!value && !this.codeInfo.maxScore) {
    //     callback(new Error('积分指数至少填写一个最大或最小值'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      dialogVisible: false,
      tabelList: [],
      codeInfo: {
        levelId: '',
        levelName: '',
        colorName: '',
        scoreMin: '',
        scoreMax: ''
      },
      rules: {
        levelName: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
        colorName: [
          { required: true, message: '请输入安全码颜色', trigger: 'blur' }
        ]
        // maxScore: [
        //   { validator: chechMaxScore, trigger: 'blur' },
        //   { type: 'number', message: '最高分数只能为1-100的数字' }
        // ],
        // minScore: [
        //   { validator: chechMinScore, trigger: 'blur' },
        //   { type: 'number', message: '最低分数只能为0-99的数字' }
        // ]
      },
      total: 1,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      listLoading: true
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      selectList(this.listQuery)
        .then((res) => {
          res.data.list.forEach((item) => {
            var dateee = new Date(item.createTime).toJSON()
            var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
              .toISOString()
              .replace(/T/g, ' ')
              .replace(/\.[\d]{3}Z/, '')
            item.createTime = date
          })
          this.tabelList = res.data.list
          this.listLoading = false
        })
        .catch((err) => {
          this.listLoading = false
          throw err
        })
    },
    showDetails(row) {
      this.dialogVisible = true
      this.codeInfo.levelId = row.levelId
      this.codeInfo.levelName = row.levelName
      this.codeInfo.colorName = row.colorName
      this.codeInfo.scoreMin = row.scoreMin
      this.codeInfo.scoreMax = row.scoreMax
    },
    submitForm() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          if (!this.codeInfo.levelName && !this.codeInfo.colorName) {
            this.$message({
              message: '请填写等级名称和安全码颜色',
              type: 'warning'
            })
            return
          }
          update(this.codeInfo)
            .then((res) => {
              this.getList()
              this.dialogVisible = false
              this.$message({
                message: '修改成功！',
                type: 'success'
              })
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.dialogVisible = false
      // this.$refs['dialogForm'].resetFields()
    },
    colorChange() {
      console.log(this.codeInfo.codeColor)
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

    .green-code {
      color: #13d27a;
    }
    .blue-code {
      color: #51a8e8;
    }
    .yellow-code {
      color: #f2bd11;
    }
    .red-code {
      color: #f21313;
    }
  }
  .dialog {
    .el-input {
      width: calc(100% - 90px);
    }
    .dia-score {
      margin-left: 5px;
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
