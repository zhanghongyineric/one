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
        <el-steps :active="stepIndex" align-center>
          <el-step title="基本信息" />
          <el-step title="机动车驾驶证信息" />
          <el-step title="从业资格证信息" />
        </el-steps>
        <el-form ref="dialogForm" :rules="rules" :model="dialogData" label-width="120px">
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
                  <el-select v-model="dialogData.test" placeholder="请选择籍贯">
                  </el-select>
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
                  <el-select v-model="dialogData.test" placeholder="请选择所属地区">
                  </el-select>
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
      rules: [],
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
    handleRemove() {}
  }
}
</script>
