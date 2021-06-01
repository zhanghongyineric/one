<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <el-form
        class="table-page-search-wrapper search"
        label-width="80px"
        size="small"
      >
        <el-row :gutter="48">
          <el-col :md="8" :sm="24">
            <el-form-item label="状态:">
              <el-select v-model="listQuery.status" placeholder="请选择申请状态">
                <el-option v-for="item in optionGroup" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="名称:">
              <el-input
                v-model="listQuery.keyword"
                placeholder="请输入服务商名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <div class="table-page-search-submitButtons">
              <el-button size="small" @click="resetQuery">重置</el-button>
              <el-button type="primary" size="small" @click="getList">查询</el-button>
              <el-button type="primary" size="small" @click="addCompany">添加服务商</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!--表格-->
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
        <el-table-column prop="name" label="服务商名称" min-width="100" show-overflow-tooltip />
        <el-table-column prop="pname" label="联系人" min-width="80" />
        <el-table-column prop="idCard" label="社会统一信用代码" min-width="180" />
        <el-table-column prop="tel" label="手机号" min-width="110" />
        <el-table-column prop="mail" label="邮箱" min-width="120" show-overflow-tooltip />
        <el-table-column prop="number" label="传真" min-width="130" />
        <el-table-column prop="adress" label="地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="platform" label="输入平台" min-width="80" />
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

      <!--分页-->
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <el-dialog
        custom-class="base-dialog dialog-col-1"
        :title="modify ? '更新' : '新增'"
        :visible.sync="dialogVisible"
        top="20px"
      >
        <el-form :rules="rules" :model="dialogData" label-width="150px">
          <el-form-item label="服务商名称：" prop="name">
            <el-input v-model="dialogData.name" placeholder="请输入服务商名称" size="small" />
          </el-form-item>
          <el-form-item label="社会统一信用代码：" prop="idCard">
            <el-input v-model="dialogData.idCard" placeholder="请输入社会统一信用代码" size="small" />
          </el-form-item>
          <el-form-item label="地址：" prop="adress">
            <AreaSelect v-model="area" size="small" limit-area :area-text.sync="dialogData.adress" @update:areaText="setAreaText" />
          </el-form-item>
          <el-form-item label="联系人：" prop="pname">
            <el-input v-model="dialogData.pname" placeholder="请输入联系人名字" size="small" />
          </el-form-item>
          <el-form-item label="联系电话：" prop="tel">
            <el-input v-model="dialogData.tel" placeholder="请输入联系电话" size="small" />
          </el-form-item>
          <el-form-item label="联系手机：" prop="tel">
            <el-input v-model="dialogData.tel" placeholder="请输入联系手机" size="small" />
          </el-form-item>
          <el-form-item label="联系邮箱：" prop="mail">
            <el-input v-model="dialogData.mail" placeholder="请输入联系邮箱" size="small" />
          </el-form-item>
          <el-form-item label="联系传真：" prop="number">
            <el-input v-model="dialogData.number" placeholder="请输入联系传真" size="small" />
          </el-form-item>
          <el-form-item label="状态：" prop="platform">
            <el-select v-model="dialogData.platform" placeholder="请选择状态" size="small">
              <el-option label="正常" value="1" />
              <el-option label="注销" value="2" />
            </el-select>
          </el-form-item>
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
            >
              <i slot="default" class="el-icon-plus" />
            </el-upload>
          </div>
        </el-form>
        <span style="margin-left: 35%">
          <el-button type="primary" @click="submit()">保存</el-button>
          <el-button type="primary" @click="submit()">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AreaSelect from '@/components/AreaSelect'
import { selectList, getStatus } from '@/api/information-manage/service-provider'

export default {
  name: 'ServiceProviderInformation',
  components: { Pagination, AreaSelect },
  data() {
    return {
      advanced: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        status: 1
      },
      area: [],
      optionGroup: [
        {
          label: '全部',
          value: '1'
        },
        {
          label: '正常',
          value: '2'
        },
        {
          label: '注销',
          value: '3'
        }
      ],
      total: 1,
      listLoading: false,
      tableData: [
        {
          name: '四川明亚智行',
          pname: '张三',
          tel: '15923235656',
          number: '0551-65228912',
          adress: '四川省成都市西部智谷D区2栋',
          mail: '1516165112321@qq.com',
          platform: '1',
          idCard: '511658499956127895'
        }
      ],
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '请输入服务商名称', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入社会统一信用代码', trigger: 'blur' }],
        platform: [{ required: true, message: '请选择状态', trigger: 'change' }],
        adress: [{ required: true, message: '请选择地址', trigger: 'change' }]
      },
      dialogData: {
        name: '',
        pname: '',
        phone: '',
        tel: '',
        number: '',
        adress: ''
      },
      modify: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getStatus()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        throw err
      })
      // selectList({...this.listQuery})
      // .then(res => {
      //   console.log(res);
      // })
      // .catch(err => {
      //   throw err
      // })
    },
    resetQuery() {},
    showDetails() {},
    addCompany() {
      this.modify = false
      this.dialogVisible = true
    },
    previewImg() {},
    handleRemove() {},
    submit() {},
    setAreaText(data) {
      this.dialogData.adress = data
    },
    modifyData(row) {
      this.dialogData = { ...row }
      this.modify = true
      this.dialogVisible = true
    }
  }
}
</script>
