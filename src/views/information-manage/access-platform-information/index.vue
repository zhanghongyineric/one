<template>
  <div class="layout-content account-manage">
    <el-card class="box-card">
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="账号类型:">
                <el-select v-model="listQuery.accountType" placeholder="请选择账号类型">
                  <el-option value="" label="全部" />
                  <el-option
                    v-for="item in optionGroup"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="账号:">
                <el-input v-model="listQuery.account" placeholder="请输入账号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="企业名称:">
                  <el-input v-model="listQuery.unitName" placeholder="请输入企业名称" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="企业电话:">
                  <el-input v-model="listQuery.unitTel" placeholder="请输入企业电话" @keyup.enter.native="handleSearch" />
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AccessPlatformInformation',
  data() {
    return {
      advanced: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitName: '',
        unitTel: '',
        accountType: '',
        account: ''
      },
      optionGroup: [
        {
          label: 'test',
          value: '1'
        },
        {
          label: 'test2',
          value: '2'
        }
      ]
    }
  }
}
</script>
