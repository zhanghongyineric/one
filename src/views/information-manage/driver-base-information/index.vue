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
      }
    }
  },
  methods: {
    showDetails() {},
    modifyData() {},
    getList() {}
  }
}
</script>
