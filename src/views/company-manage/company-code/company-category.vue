<!--
  - FileName: 企业安全码不同筛选条件公用页面
  - @author: ZhouJiaXing
  - @date: 2021/4/19 下午3:58
  -->

<template>
  <div class="layout-content category-page">
    <el-card class="box-card">

      <!--搜索栏-->
      <div v-if="checkPermission('search')" class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="安全码:">
                <el-select v-model="listQuery.colorId" placeholder="请选择安全码" multiple>
                  <el-option
                    v-for="{label,value,color} in optionGroup.codeList"
                    :key="value"
                    :label="label"
                    :value="value"
                    :style="{color:color}"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="关键字:">
                <el-input v-model="listQuery.keyWord" placeholder="请输入企业名称或者手机号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="归属地:">
                  <AreaSelect v-model="listQuery.unitPlace" size="small" limit-area :area-text.sync="listQuery.area" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="企业类别:">
                  <el-select v-model="listQuery.categoryId" placeholder="请选择归属地">
                    <el-option label="全部" value="" />
                    <el-option
                      v-for="{label,value} in optionGroup.typeList"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
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
          width="100"
          align="left"
        />
        <el-table-column label="企业名称" prop="unitName" min-width="200" show-overflow-tooltip />
        <el-table-column label="行政区域" prop="unitPlace" min-width="100" show-overflow-tooltip />
        <el-table-column label="法人" prop="legalPerson" />
        <el-table-column label="电话" prop="unitTel" />
        <el-table-column v-slot="{row}" label="企业类别" prop="unitCategory">
          {{ row.unitCategory||'未设置' }}
        </el-table-column>
        <!--
        <el-table-column v-slot="{row}" label="企业风险类别" prop="safeLevelWeightId" width="130">
          <div
            class="f"
            :style="{background:levelColorFilter(row.safeLevelWeightId)}"
            style="color:black;line-height: 26px;border-radius: 5px;padding: 0 5px 0 5px;align-items: center"
          >
            &lt;!&ndash;<svg v-if="row.safeLevelWeightId === 1 || row.safeLevelWeightId === 2" aria-hidden="true" width="15" height="15" fill="white">&ndash;&gt;
            &lt;!&ndash;  <use xlink:href="#icon-safe" />&ndash;&gt;
            &lt;!&ndash;</svg>&ndash;&gt;
            &lt;!&ndash;<svg v-else aria-hidden="true" width="15" height="15" fill="white">&ndash;&gt;
            &lt;!&ndash;  <use xlink:href="#icon-danger" />&ndash;&gt;
            &lt;!&ndash;</svg>&ndash;&gt;
            <span style="padding-left: 5px">{{ row.safeLevelWeightId | levelTextFilter }}</span>
          </div>
        </el-table-column>
        -->

        <el-table-column v-slot="{row}" label="企业安全码" prop="safeLevelWeightId" width="100">
          <template>
            <!--暂时使用图片替换真实二维码-->
            <svg-icon
              v-if="row.safeLevelWeightId"
              class="safe-code"
              icon-class="code"
              :style="{color: getCodeColor(row.safeLevelWeightId)}"
            />
            <!--<SafeCode v-if="row.safeImageUrl" :id="row.codeId" :text="row.safeImageUrl" :color="getCodeColor(row.safeScore)" />-->
            <span v-else>暂无安全码</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="安全评分" prop="safeScore" />-->
        <el-table-column v-slot="{row}" label="运营车辆总数" prop="vehicleAll" width="110px" align="center">
          <el-tooltip class="item" effect="dark" content="点击查看车辆" placement="right">
            <el-link type="primary" :disabled="!row.vehicleAll" @click="showCar(row.unitId)">{{ row.vehicleAll || 0 }}</el-link>
          </el-tooltip>
        </el-table-column>
        <el-table-column v-slot="{row}" label="在线车辆" prop="onlineVehicle" align="center">
          {{ row.onlineVehicle || 0 }}
        </el-table-column>

        <!--表格操作列-->
        <el-table-column
          label="操作"
          align="center"
          width="200"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleDetailClick(row.unitId)">
              详情
            </el-button>
            <el-button type="primary" size="mini" @click="handleDriverCodeClick(row.unitId)">
              驾驶员安全码
            </el-button>
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
    </el-card>
  </div>
</template>

<script>

import { fetchList, companyType } from '@/api/company-manage/company-code'
import Pagination from '@/components/Pagination' // 分页
import { statusOption, colorOption, companySafeLevelOption } from '@/options'
import { checkPermission } from '@/utils/check-permission'
import AreaSelect from '@/components/AreaSelect'
import { mapGetters } from 'vuex'

export default {
  name: 'CompanyCategory',
  components: { Pagination, AreaSelect },
  filters: {
    stateFilter: function(state) {
      return statusOption.map[state]
    },

    levelTextFilter: function(level) {
      return companySafeLevelOption.map[level].text
    }
  },
  data() {
    return {
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        unitPlace: [],
        area: '',
        colorId: [],
        keyWord: '',
        categoryId: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        unitPlace: [],
        area: '',
        unitType: '',
        colorId: [],
        keyWord: '',
        categoryId: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        typeList: [],
        codeList: colorOption.list
      }, // 存放选项的数据
      rules: {} // 新增和编辑框的规则
    }
  },
  computed: {
    ...mapGetters([
      'role',
      'area'
    ])
  },
  created() {
    this.initSearchArea()
    this.initType()
    this.getList()
  },

  methods: {
    // 查看所有车辆
    showCar(unitId) {
      this.$router.push({
        name: 'CompanyCar',
        params: {
          companyId: unitId
        }
      })
    },
    levelColorFilter(level) {
      return companySafeLevelOption.map[level].color
    },
    // 设置查询条件中用户区域
    initSearchArea() {
      const userArea = this.role === 'admin' ? '' : this.area// 管理员设置为空 代表中国区域
      this.listQuery.area = userArea
      this.listQueryTemp.area = userArea
    },
    // 获取企业类型
    initType() {
      companyType().then(res => {
        this.optionGroup.typeList = res.data.map(item => ({ label: item.value, value: item.typeId }))
      })
    },
    handleDetailClick(companyId) {
      this.$router.push({
        name: 'CompanyDetail',
        params: { companyId }
      })
    },
    checkPermission,
    // 获取颜色
    getCodeColor(id) {
      return this.optionGroup.codeList.find(item => item.value === id).color
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList({
        ...this.listQuery,
        unitPlace: this.listQuery.area === '中国' ? '' : this.listQuery.area,
        colorId: this.listQuery.colorId.join('')
      }).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 自定义表格方法
    handleDriverCodeClick(id) {
      this.$router.push({
        name: 'DriverCode',
        params: { companyId: id, codeId: 0 }
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>
::v-deep table .safe-code {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
}

</style>
