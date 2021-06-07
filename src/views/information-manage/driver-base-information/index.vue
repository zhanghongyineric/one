<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="150px" size="small">
          <el-row :gutter="48">
            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="所属地区:">
                <el-select v-model="listQuery.accountType" placeholder="请选择所属地区" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="从业资格范围:">
                <el-select v-model="listQuery.accountType" placeholder="请选择从业资格范围">
                  <!-- <el-option
                    v-for="item in serviceCarKinds"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  /> -->
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="状态:">
                  <el-select v-model="listQuery.accountType" placeholder="请选择状态">
                    <!-- <el-option
                      v-for="item in accessPlatformBelong"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    /> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="从业资格证初领日期:">
                  <el-select v-model="listQuery.accountType" placeholder="请选择从业资格证初领日期">
                    <!-- <el-option
                      v-for="item in accessPlatformKinds"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    /> -->
                  </el-select>
                </el-form-item>
              </el-col>
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                style="margin-top: -4px"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table
        v-loading="listLoading"
        class="main-table"
        :data="tableData"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="50" />
        <el-table-column prop="name" label="名字" min-width="100" show-overflow-tooltip />
        <el-table-column prop="code" label="性别" min-width="100" show-overflow-tooltip />
        <el-table-column prop="feature" label="地区" min-width="110" show-overflow-tooltip />
        <el-table-column prop="adress" label="准驾类型" min-width="150" show-overflow-tooltip />
        <el-table-column prop="beian" label="运输类别" min-width="150" show-overflow-tooltip />
        <el-table-column prop="number" label="身份证号" min-width="130" />
        <el-table-column prop="status" label="所属公司" min-width="130" />
        <el-table-column fixed="right" label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn"
              type="primary"
              size="small"
              @click="showDetails(scope.row.id,scope.$index)"
            >查看详情</el-button>
            <el-button
              class="btn"
              type="warning"
              size="small"
              @click="modifyData(scope.row)"
            >更新信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
      <el-dialog
        title="新增"
        :visible.sync="dialogVisible"
        top="20px"
      >
        <!-- 弹框上方步骤条 -->
        <el-steps :active="stepIndex" align-center>
          <el-step title="基本信息" />
          <el-step title="机动车驾驶证信息" />
          <el-step title="从业资格证信息" />
        </el-steps>

        <!-- 基本信息 -->
        <el-form
          v-show="stepIndex === 1"
          ref="oneForm"
          :rules="oneRules"
          :model="dialogData"
          label-width="120px"
          style="margin-top: 20px"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="姓名：" prop="platformName">
                <el-input v-model="dialogData.test" placeholder="请输入姓名" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="性别：" prop="platformCode">
                <el-checkbox v-model="dialogData.test">男</el-checkbox>
                <el-checkbox v-model="dialogData.test">女</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="民族：" prop="userName">
                <el-input v-model="dialogData.test" placeholder="请输入民族" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="文化程度：" prop="password">
                <el-select v-model="dialogData.test" placeholder="请选择文化程度">
                  <!-- <el-option
                        v-for="item in accessPlatformKinds"
                        :key="item.label"
                        :label="item.value"
                        :value="item.label"
                      /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="籍贯：" prop="contact">
              <el-select v-model="dialogData.test" placeholder="请选择籍贯" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="健康状况：" prop="typeCode ">
                <el-select v-model="dialogData.test" placeholder="请选择健康状况">
                  <!-- <el-option
                        v-for="item in accessPlatformKinds"
                        :key="item.label"
                        :label="item.value"
                        :value="item.label"
                      /> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="身份证号码：" prop="deviceIp">
                <el-input v-model="dialogData.test" placeholder="请输入身份证号码" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="手机号码：" prop="status">
                <el-input v-model="dialogData.test" placeholder="请输入手机号码" size="small" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="所属运输企业：" prop="ip">
                <el-input v-model="dialogData.test" placeholder="请输入所属运输企业" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="所属地区：" prop="m1">
              <el-select v-model="dialogData.test" placeholder="请选择所属地区" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="居住地址：" prop="allowConnect">
              <el-select v-model="dialogData.test" placeholder="请选择居住地址">
                <!-- <el-option
                      v-for="item in allowConnectOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    /> -->
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="详细居住地址：" prop="keepOnRecord">
              <el-input v-model="dialogData.test" placeholder="请输入详细居住地址" size="small" />
            </el-form-item>
          </el-row>
          <div style="margin-left: 53px;margin-bottom: 30px">
            <p><b>服务商logo：</b></p>
            <el-upload
              ref="upload"
              action
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              :multiple="true"
              :on-change="previewImg"
              :on-remove="handleRemove"
              :before-upload="previewImg"
              :file-list="fileList"
            >
              <i slot="default" class="el-icon-plus" />
            </el-upload>
          </div>
        </el-form>
        <!-- 机动车驾驶证信息 -->
        <el-form
          v-show="stepIndex === 2"
          ref="twoForm"
          :rules="twoRules"
          :model="dialogData"
          label-width="130px"
          style="margin-top: 20px"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="机动车驾驶证号：" prop="number">
                <el-input v-model="dialogData.test" placeholder="请输入机动车驾驶证号" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="准驾车型：" prop="password">
                <el-select v-model="dialogData.test" placeholder="请选择准驾车型">
                  <!-- <el-option
                        v-for="item in accessPlatformKinds"
                        :key="item.label"
                        :label="item.value"
                        :value="item.label"
                      /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="初次领证日期：" prop="password">
                <el-date-picker
                  v-model="dialogData.test"
                  type="date"
                  placeholder="初次领证日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效期开始日期：" prop="password">
                <el-date-picker
                  v-model="dialogData.test"
                  type="date"
                  placeholder="有效期开始日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效期截止日期：" prop="password">
                <el-date-picker
                  v-model="dialogData.test"
                  type="date"
                  placeholder="有效期截止日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="发证机关：" prop="password">
                <el-input v-model="dialogData.test" placeholder="请输入发证机关" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 从业资格证信息 -->
        <el-form
          v-show="stepIndex === 3"
          ref="threeForm"
          :rules="threeRules"
          :model="dialogData"
          label-width="120px"
          style="margin-top: 20px"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="从业资格证号：" prop="number">
                <el-input v-model="dialogData.test" placeholder="请输入从业资格证号" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="从业资格证类型：" prop="password">
                <el-select v-model="dialogData.test" placeholder="请选择从业资格证类型">
                  <!-- <el-option
                        v-for="item in accessPlatformKinds"
                        :key="item.label"
                        :label="item.value"
                        :value="item.label"
                      /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="从业资格范围：" prop="password">
                <el-select v-model="dialogData.test" placeholder="请选择从业资格范围">
                  <!-- <el-option
                        v-for="item in accessPlatformKinds"
                        :key="item.label"
                        :label="item.value"
                        :value="item.label"
                      /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="初次领证日期：" prop="password">
                <el-date-picker
                  v-model="dialogData.test"
                  type="date"
                  placeholder="初次领证日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效期开始日期：" prop="password">
                <el-date-picker
                  v-model="dialogData.test"
                  type="date"
                  placeholder="有效期开始日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效期截止日期：" prop="password">
                <el-date-picker
                  v-model="dialogData.test"
                  type="date"
                  placeholder="有效期截止日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="营运状态：" prop="password">
                <el-select v-model="dialogData.test" placeholder="请选择营运状态">
                  <!-- <el-option
                        v-for="item in accessPlatformKinds"
                        :key="item.label"
                        :label="item.value"
                        :value="item.label"
                      /> -->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="发证机关：" prop="password">
                <el-input v-model="dialogData.test" placeholder="请输入发证机关" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span style="margin-left: 35%">
          <el-button v-show="stepIndex !== 1" type="primary" @click="lastStep()">上一步</el-button>
          <el-button v-show="stepIndex !== 3" type="primary" @click="nextStep()">下一步</el-button>
          <el-button v-show="stepIndex === 3" type="primary" @click="submit()">保存</el-button>
          <el-button type="primary" @click="closeDialog()">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'DriverBaseInformation',
  components: { Pagination },
  data() {
    return {
      advanced: false,
      listLoading: false,
      total: 1,
      listQuery: {
        pageSize: 10,
        pageNum: 1
      },
      dialogVisible: false,
      tableData: [],
      oneRules: [],
      twoRules: [],
      threeRules: [],
      dialogData: {
        test: '',
        testArr: []
      },
      fileList: [],
      stepIndex: 1
    }
  },
  methods: {
    showDetails() {},
    modifyData() {},
    getList() {},
    handleCreate() {
      this.dialogVisible = true
    },
    resetQuery() {},
    handleSearch() {},
    previewImg() {},
    handleRemove() {},
    lastStep() {
      this.stepIndex -= 1
    },
    nextStep() {
      this.stepIndex += 1
    },
    submit() {},
    closeDialog() {
      this.stepIndex = 1
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding: 20px 20px;
}
</style>
