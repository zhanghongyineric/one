<template>
  <div class="layout-content company-information">
    <el-card class="box-card">
      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">
            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="车牌号:">
                <el-input v-model="listQuery.plateNum" placeholder="请输入车牌号" clearable />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车辆类型:">
                <el-select v-model="listQuery.vehicleType" placeholder="请选择车辆类型">
                  <el-option
                    v-for="item in carKindOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="所属企业:">
                  <el-autocomplete
                    v-model="listQuery.unitName"
                    :fetch-suggestions="searchType"
                    placeholder="请输入企业名称关键字"
                    :debounce="500"
                    size="small"
                    clearable
                    style="width:100%;"
                    @select="selectSearchCompany"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="运营状态:">
                  <el-select v-model="listQuery.operateStatus" placeholder="请选择运营状态">
                    <el-option
                      v-for="item in operateStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="是否双驾:">
                  <el-select v-model="listQuery.doubleDrivers" placeholder="请选择是否双驾">
                    <el-option key="0" label="是" value="0" />
                    <el-option key="1" label="否" value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="所属地区:">
                  <el-cascader
                    v-model="listQuery.zoneId"
                    size="small"
                    :options="searchCityOptions"
                    placeholder="请选择所属地区"
                    style="width:100%;"
                  />
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
          align="center"
        />
        <el-table-column label="车牌号" prop="plateNum" min-width="100" show-overflow-tooltip align="center" />
        <el-table-column label="所属企业" prop="unitName" min-width="200" show-overflow-tooltip align="center" />
        <el-table-column label="车辆类型" prop="vehicleType" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.vehicleType | showVehicleType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌颜色" prop="plateColor" min-width="100" align="center">
          <template v-if="scope.row.plateColor" slot-scope="scope">
            <span>{{ plateColorMap.get(scope.row.plateColor.toString()) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属地区" prop="zoneId" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.zoneId | zoneFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否双驾" prop="doubleDrivers" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.doubleDrivers | showDoubleDrivers }}
          </template>
        </el-table-column>
        <el-table-column label="运营状态" prop="operateStatus" min-width="150" align="center">
          <template v-if="scope.row.operateStatus" slot-scope="scope">
            <span v-if="operateStatusMap.get(scope.row.operateStatus.toString()) === '正常'" style="color: green">
              {{ operateStatusMap.get(scope.row.operateStatus.toString()) }}
            </span>
            <span v-else style="color: red">
              {{ operateStatusMap.get(scope.row.operateStatus.toString()) }}
            </span>
          </template>
        </el-table-column>
        <!--表格操作列-->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="400">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleDetail(row)">
              查看详情
            </el-button>
            <el-button type="primary" size="mini" @click="handleAccess(row)">
              入网信息
            </el-button>
            <el-button type="primary" size="mini" @click="handleInsurance(row)">
              保险信息
            </el-button>
            <el-button type="warning" size="mini" @click="handleUpdate(row)">
              更新信息
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

      <!--新增、更新信息共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        top="50px"
        custom-class="base-dialog"
        :before-close="closeDialog"
      >
        <el-steps :active="indexs" align-center>
          <el-step title="车辆基础信息" />
          <el-step title="机动车行驶证信息" />
          <el-step title="道路运输证信息" />
        </el-steps>
        <el-form
          v-show="indexs===1"
          ref="oneForm"
          :rules="oneRules"
          :model="createFormData"
          label-width="120px"
          :disabled="dialogStatus === 'detail'"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item size="small" clearable label="车牌号:" prop="plateNum">
                <el-input v-model="createFormData.plateNum" clearable placeholder="请输入车牌号" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item size="small" label="车辆营运类型:" prop="operateType">
                <el-select v-model="createFormData.operateType" clearable placeholder="请选择车辆类型">
                  <el-option
                    v-for="item in vehicleTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item size="small" label="所属企业:" prop="unitName">
                <el-autocomplete
                  v-model="createFormData.unitName"
                  :fetch-suggestions="searchType"
                  placeholder="请输入企业名称关键字"
                  :debounce="500"
                  size="small"
                  clearable
                  @select="selectCompany"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="所属区域:" prop="zoneId" size="small">
                <el-cascader
                  v-model="createFormData.zoneId"
                  size="small"
                  :options="cityOptions"
                  placeholder="请选择车辆所属区域"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="生产日期:" prop="producedDate" size="small">
                <el-date-picker
                  v-model="createFormData.producedDate"
                  clearable
                  type="date"
                  placeholder="请选择生产日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="出厂日期:" prop="productionDate" size="small">
                <el-date-picker
                  v-model="createFormData.productionDate"
                  clearable
                  type="date"
                  placeholder="请选择出厂日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="检验有效期止:" prop="inspectionDate" size="small">
                <el-date-picker
                  v-model="createFormData.inspectionDate"
                  clearable
                  type="date"
                  placeholder="请选择检验有效期截止日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="车牌颜色:" prop="plateColor" size="small">
                <el-select
                  v-model="createFormData.plateColor"
                  placeholder="请选择车牌颜色"
                  clearable
                >
                  <el-option
                    v-for="item in plateColorOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车身颜色:" prop="color" size="small">
                <el-select
                  v-model="createFormData.color"
                  clearable
                  placeholder="请选择车身颜色"
                >
                  <el-option
                    v-for="item in carColorOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="燃料类型:" prop="fuelType" size="small">
                <el-select
                  v-model="createFormData.fuelType"
                  placeholder="请选择燃料类型"
                  clearable
                >
                  <el-option
                    v-for="item in fuelTypeOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="准牵引总质量:" prop="tractionQuality" size="small">
                <el-input v-model="createFormData.tractionQuality" clearable placeholder="请输入准牵引总质量（kg）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="总质量:" prop="grossQuality" size="small">
                <el-input v-model="createFormData.grossQuality" clearable placeholder="请输入总质量（kg）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="整备质量:" prop="curbQuality" size="small">
                <el-input v-model="createFormData.curbQuality" clearable placeholder="请输入整备质量（kg）" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="核定载质量:" prop="loadQuality" size="small">
                <el-input v-model="createFormData.loadQuality" clearable placeholder="请输入核定载质量（kg）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="发动机排量" prop="engineDisplacement" size="small">
                <el-input v-model="createFormData.engineDisplacement" clearable placeholder="请输入发动机排量" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="核定载人数:" prop="passengerNum" size="small">
                <el-input v-model="createFormData.passengerNum" clearable placeholder="请输入核定载人数" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="车长:" prop="length" size="small">
                <el-input v-model="createFormData.length" clearable placeholder="请输入车长（mm）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车宽" prop="wide" size="small">
                <el-input v-model="createFormData.wide" clearable placeholder="请输入车宽（mm）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车高:" prop="high" size="small">
                <el-input v-model="createFormData.high" clearable placeholder="请输入车高（mm）" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="轴距:" prop="wheelBase" size="small">
                <el-input v-model="createFormData.wheelBase" clearable placeholder="请输入轴距（mm）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车轴数" prop="axleNum" size="small">
                <el-input v-model="createFormData.axleNum" clearable placeholder="请输入车轴数（个）" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="是否双驾:" prop="doubleDrivers" size="small">
                <el-select v-model="createFormData.doubleDrivers" clearable placeholder="请选择是否双驾">
                  <el-option key="0" label="是" value="0" />
                  <el-option key="1" label="否" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="双驾开始时间" prop="doubleDriversBeginTime" size="small">
                <el-date-picker
                  v-model="createFormData.doubleDriversBeginTime"
                  type="datetime"
                  placeholder="选择双驾开始日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="双驾结束时间" prop="doubleDriversEndTime" size="small">
                <el-date-picker
                  v-model="createFormData.doubleDriversEndTime"
                  type="datetime"
                  placeholder="选择双驾结束日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-form
          v-show="indexs===2"
          ref="twoForm"
          :rules="twoRules"
          :model="createFormData"
          label-width="150px"
          :disabled="dialogStatus === 'detail'"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="机动车车辆类型:" prop="vehicleType">
                <el-select v-model="createFormData.vehicleType" clearable size="small" placeholder="请选择机动车车辆类型">
                  <el-option
                    v-for="item in carKindOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="车籍所在地:" prop="registerZoneId">
                <el-cascader
                  v-model="createFormData.registerZoneId"
                  clearable
                  size="small"
                  :options="cityOptions"
                  placeholder="请选择车籍所在地"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="使用性质:" prop="useNature">
                <el-select v-model="createFormData.useNature" clearable size="small" placeholder="请选择车辆使用性质">
                  <el-option
                    v-for="item in useNatureOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="品牌型号:" prop="factoryType">
                <el-input v-model="createFormData.factoryType" clearable size="small" placeholder="请输入品牌型号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="车辆识别代码VIN:" prop="vin">
                <el-input v-model="createFormData.vin" clearable size="small" placeholder="请输入车辆识别代码VIN" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="发动机号:" prop="motorNum">
                <el-input v-model="createFormData.motorNum" clearable size="small" placeholder="请输入发动机号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="注册日期:" prop="registerDate">
                <el-date-picker
                  v-model="createFormData.registerDate"
                  clearable
                  size="small"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择注册日期"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="发证日期:" prop="openingDate">
                <el-date-picker
                  v-model="createFormData.openingDate"
                  clearable
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  size="small"
                  type="date"
                  placeholder="请选择发证日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="车辆所有人:" prop="owner">
                <el-input v-model="createFormData.owner" clearable size="small" placeholder="请输入车辆所有人" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="所有人住址:" prop="ownerAddr">
              <el-input v-model="createFormData.ownerAddr" clearable size="small" placeholder="请输入车辆所有人详细住址" />
            </el-form-item>
          </el-row>
        </el-form>

        <el-form
          v-show="indexs==3"
          ref="threeForm"
          :rules="threeRules"
          :model="createFormData"
          label-width="150px"
          :disabled="dialogStatus === 'detail'"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="道路运输证字号:" prop="transportLicenceNum">
                <el-input v-model="createFormData.transportLicenceNum" clearable size="small" placeholder="请输入道路运输证字号" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="道路运输证编码:" prop="transportLicenceCode">
                <el-input v-model="createFormData.transportLicenceCode" clearable size="small" placeholder="请输入道路运输证编码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="所属区域:" prop="transportZoneId">
                <el-cascader
                  v-model="createFormData.transportZoneId"
                  clearable
                  size="small"
                  :options="cityOptions"
                  placeholder="请选择所属区域"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效开始日期:" prop="transportBeginDate">
                <el-date-picker
                  v-model="createFormData.transportBeginDate"
                  clearable
                  size="small"
                  type="date"
                  placeholder="请选择有效开始日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效截止日期:" prop="transportEndDate">
                <el-date-picker
                  v-model="createFormData.transportEndDate"
                  clearable
                  size="small"
                  type="date"
                  placeholder="请选择有效截止日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="发证机关名称:" prop="licenceIssuingAuthority">
                <el-input v-model="createFormData.licenceIssuingAuthority" clearable size="small" placeholder="请输入发证机关名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="提前提醒天数:" prop="transportRemindDate">
                <el-input
                  v-model="createFormData.transportRemindDate"
                  clearable
                  size="small"
                  placeholder="请输入提前提醒天数"
                  type="number"
                  min="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-show="indexs !== 1" type="primary" @click="lastStep()">上一步</el-button>
          <el-button v-show="indexs !== 3" type="primary" @click="nextStep()">下一步</el-button>
          <el-button v-show="indexs === 3 && dialogStatus==='create'" type="primary" @click="createData()">
            保存
          </el-button>
          <el-button v-show="indexs === 3 && dialogStatus==='update'" type="primary" @click="updateData()">
            保存
          </el-button>
          <el-button v-show="indexs === 3 && dialogStatus==='detail'" type="danger" @click="deleteData()">
            删除
          </el-button>
          <el-button type="primary" @click="closeDialog()">关闭</el-button>
        </div>
      </el-dialog>

      <!--入网信息弹窗-->
      <el-dialog
        :title="onLineTitle"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class="base-dialog"
        top="50px"
        :before-close="closeAccessDialog"
      >
        <el-form
          ref="fourForm"
          :rules="fourRules"
          :model="accessFormData"
          label-width="150px"
        >
          <el-row>
            <el-form-item label="入网方式:" prop="accessWay">
              <el-select v-model="accessFormData.accessWay" size="small" placeholder="请选择入网方式">
                <el-option
                  v-for="item in accessWayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="车载终端号:" prop="terminalName">
                <el-input v-model="accessFormData.terminalName" clearable size="small" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="平台名称:" prop="platformName">
                <el-autocomplete
                  v-model="accessFormData.platformName"
                  :fetch-suggestions="searchPlatform"
                  placeholder="请输入平台名称关键字"
                  :debounce="500"
                  size="small"
                  clearable
                  @select="selectPlatform"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="服务器域名及端口:" prop="serverIpPort">
                <el-select v-model="accessFormData.serverIpPort" clearable size="small" placeholder="请选择服务器域名及端口">
                  <el-option
                    v-for="item in portOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="服务商名称:" prop="unitName">
                <el-autocomplete
                  v-model="accessFormData.unitName"
                  :fetch-suggestions="searchService"
                  placeholder="请输入平台名称关键字"
                  :debounce="500"
                  size="small"
                  clearable
                  @select="selectService"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="通讯协议版本:" prop="communicationProtocolVersion">
                <el-select v-model="accessFormData.communicationProtocolVersion" clearable size="small" placeholder="请选择通讯协议版本">
                  <el-option
                    v-for="item in protocolOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="定位模式:" prop="locateMode">
                <el-select v-model="accessFormData.locateMode" clearable size="small" placeholder="请选择定位模式">
                  <el-option
                    v-for="item in positionModeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="通讯模式:" prop="communicationMode">
                <el-select v-model="accessFormData.communicationMode" clearable size="small" placeholder="请选择通讯模式">
                  <el-option
                    v-for="item in modeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="制造商名称:" prop="manufacturerName">
                <el-input v-model="accessFormData.manufacturerName" clearable size="small" placeholder="请输入制造商名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="主机型号:" prop="hostType">
                <el-input v-model="accessFormData.hostType" clearable size="small" placeholder="请输入主机型号" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="物联网卡号:" prop="internetCard">
                <el-input v-model="accessFormData.internetCard" clearable size="small" placeholder="请输入物联网卡号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="视频通道数:" prop="cameraNum">
                <el-input
                  v-model="accessFormData.cameraNum"
                  size="small"
                  placeholder="请输入视频通道数"
                  type="number"
                  min="0"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="设备类型:" prop="functions">
              <el-select v-model="accessFormData.functions" clearable size="small" multiple placeholder="请选择设备类型">
                <el-option
                  v-for="item in functionsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createAccess()">
            保存
          </el-button>
          <el-popconfirm
            title="确认删除吗？"
            style="margin-left:10px;margin-right:10px;"
            @confirm="deleteAccess()"
          >
            <el-button slot="reference" size="large" type="danger" style="margin-left: -5px">
              删除
            </el-button>
          </el-popconfirm>
          <el-button type="primary" @click="closeAccessDialog()">关闭</el-button>
        </div>
      </el-dialog>

      <!-- 保险信息弹窗 -->
      <el-dialog
        title="保险信息"
        :visible.sync="dialogInsuranceVisible"
        :close-on-click-modal="false"
        custom-class="base-dialog"
        top="50px"
        :before-close="closeInsuranceDialog"
      >
        <div v-show="!addInsurance">
          <el-table
            :data="insuranceData"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="保险类型" prop="typeCode1" min-width="100" show-overflow-tooltip align="center" />
            <el-table-column label="险别" prop="riskTypeCode1" min-width="100" show-overflow-tooltip align="center" />
            <el-table-column label="保险金额" prop="money" min-width="100" show-overflow-tooltip align="center" />
            <el-table-column label="保险费小计" prop="cost" min-width="100" show-overflow-tooltip align="center" />
            <el-table-column label="相关说明" prop="remark" min-width="100" show-overflow-tooltip align="center" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="220">
              <template v-slot="{row}">
                <el-button type="primary" size="mini" @click="showInsuranceDetail(row)">详情</el-button>
                <el-button type="primary" size="mini" @click="updateInsurance(row)">修改</el-button>
                <el-button type="primary" size="mini" @click="deleteInsurance(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="insurance-footer">
            <el-button type="primary" size="mini" @click="addInsuranceData">添加</el-button>
            <el-button type="danger" size="mini" @click="closeInsuranceDialog">关闭</el-button>
          </div>
        </div>
        <div v-show="addInsurance">
          <el-form
            ref="fiveForm"
            :rules="fiveRules"
            :model="insuranceFormData"
            label-width="120px"
            :disabled="insuranceDetail"
          >
            <el-row>
              <el-col :md="12" :sm="24">
                <el-form-item label="保险单号:" prop="number">
                  <el-input v-model="insuranceFormData.number" clearable size="small" placeholder="请输入保险单号" />
                </el-form-item>
              </el-col>
              <el-col :md="12" :sm="24">
                <el-form-item label="保险公司:" prop="companyName">
                  <el-input v-model="insuranceFormData.companyName" clearable size="small" placeholder="请输入保险公司" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :sm="24">
                <el-form-item label="被保险人姓名:" prop="insuredName">
                  <el-input v-model="insuranceFormData.insuredName" clearable size="small" placeholder="请输入被保险人姓名" />
                </el-form-item>
              </el-col>
              <el-col :md="12" :sm="24">
                <el-form-item label="投保人姓名:" prop="policyHolderName">
                  <el-input v-model="insuranceFormData.policyHolderName" clearable size="small" placeholder="请输入投保人姓名" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :sm="24">
                <el-form-item label="有效开始日期:" prop="effectiveStartDate">
                  <el-date-picker
                    v-model="insuranceFormData.effectiveStartDate"
                    type="date"
                    placeholder="请选择有效开始日期"
                    size="small"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12" :sm="24">
                <el-form-item label="有效截止日期:" prop="effectiveEndDate">
                  <el-date-picker
                    v-model="insuranceFormData.effectiveEndDate"
                    type="date"
                    placeholder="请选择有效截止日期"
                    size="small"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :sm="24">
                <el-form-item label="受益人名称:" prop="beneficiaryName">
                  <el-input v-model="insuranceFormData.beneficiaryName" clearable size="small" placeholder="请输入受益人名称" />
                </el-form-item>
              </el-col>
              <el-col :md="12" :sm="24">
                <el-form-item label="提前提醒天数:" prop="advanceRemindDay">
                  <el-input v-model="insuranceFormData.advanceRemindDay" clearable min="0" type="number" size="small" placeholder="请输入提前提醒天数（天）" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :sm="24">
                <el-form-item label="保险类型:" prop="typeCode">
                  <el-select
                    v-model="insuranceFormData.typeCode"
                    placeholder="请选择保险类型"
                    size="small"
                    clearable
                  >
                    <el-option
                      v-for="item in insuranceTypeOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12" :sm="24">
                <el-form-item label="险别:" prop="riskTypeCode">
                  <el-select
                    v-model="insuranceFormData.riskTypeCode"
                    placeholder="请选择险别"
                    size="small"
                    clearable
                  >
                    <el-option
                      v-for="item in riskTypeOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :sm="24">
                <el-form-item label="保险金额:" prop="money">
                  <el-input
                    v-model="insuranceFormData.money"
                    clearable
                    size="small"
                    placeholder="请输入保险金额"
                    type="number"
                    min="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12" :sm="24">
                <el-form-item label="险费小计:" prop="cost">
                  <el-input
                    v-model="insuranceFormData.cost"
                    size="small"
                    placeholder="请输入险费小计"
                    clearable
                    type="number"
                    min="0"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :sm="24">
                <el-form-item label="备注:" prop="remark">
                  <el-input
                    v-model="insuranceFormData.remark"
                    type="textarea"
                    :rows="2"
                    size="small"
                    placeholder="请输入备注"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="insurance-footer">
            <el-button v-show="!insuranceDetail" type="primary" size="mini" @click="saveInsurance">保存</el-button>
            <el-button type="danger" size="mini" @click="cancelInsurance">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  selectList,
  enterpriseName,
  queryConditions,
  queryColor,
  selectAccessInstallation,
  platformInfoName,
  facilitatorName,
  AccessInstallationSave,
  queryFuel,
  queryPort,
  queryProtocol,
  queryMode,
  queryPositioningMode,
  selectTransport,
  vehicleDelete,
  queryOperationType,
  AccessInstallationDelete,
  InsuranceSave,
  InsuranceDelete,
  selectInsurance,
  queryInsuranceType,
  queryInsurance,
  vehicleSave,
  queryUseNature,
  queryCarColor
} from '@/api/information-manage/car-base-information'
import { provinceAndCityData, CodeToText, regionData } from 'element-china-area-data'
import Pagination from '@/components/Pagination'
import getAreaText from '@/utils/AreaCodeToText'

let that

export default {
  name: 'CarBaseInformation',
  components: { Pagination },
  filters: {
    showVehicleType(type) {
      let typeText
      if (type === 0 || type === '0') {
        return '不确定类型'
      } else {
        that.carKindOptions.forEach(item => {
          if (type && type.toString() === item.value) {
            typeText = item.label
          }
        })
        return typeText
      }
    },
    showDoubleDrivers(temp) {
      if (temp === 0 || temp === '0') return '是'
      if (temp === 1 || temp === '1') return '否'
    },
    zoneFilter(zoneId) {
      const text = CodeToText[zoneId]
      return text
    }
  },
  data() {
    return {
      indexs: 1,
      cityOptions: provinceAndCityData,
      dialogFormVisible: false,
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      searchCityOptions: regionData,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        plateNum: '',
        operateStatus: null,
        functions: '',
        vehicleType: '',
        doubleDrivers: null,
        zoneId: null,
        unitName: '',
        unitId: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        plateNum: '',
        operateStatus: null,
        functions: '',
        vehicleType: '',
        doubleDrivers: null,
        zoneId: null,
        unitName: '',
        unitId: ''
      },
      useNatureOptions: [], // 使用性质
      carColorOptions: [], // 车身颜色
      businessOptions: [], // 经营范围
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      operateStatusOptions: [],
      vehicleTypeOptions: [],
      functionsOptions: [],
      createFormData: {},
      oneRules: {
        plateNum: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入所属企业', trigger: 'blur' }],
        operateType: [{ required: true, message: '请选择车辆营运类型', trigger: 'change' }],
        zoneId: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
        plateColor: [{ required: true, message: '请选择车牌颜色', trigger: 'change' }]
      },
      twoRules: {
        vehicleType: [{ required: true, message: '请选择机动车车辆类型', trigger: 'change' }],
        registerZoneId: [{ required: true, message: '请选择车籍所在地', trigger: 'change' }],
        useNature: [{ required: true, message: '请选择使用性质', trigger: 'change' }],
        factoryType: [{ required: true, message: '请输入品牌型号', trigger: 'blur' }],
        vin: [{ required: true, message: '请输入车辆车辆所有人', trigger: 'blur' }],
        owner: [{ required: true, message: '请输入车辆识别代码VIN', trigger: 'blur' }],
        ownerAddr: [{ required: true, message: '请输入车辆所有人住址', trigger: 'blur' }],
        registerDate: [{ required: true, message: '请选择注册日期', trigger: 'change' }],
        openingDate: [{ required: true, message: '请选择发证日期', trigger: 'change' }]
      },
      threeRules: {
        transportLicenceNum: [{ required: true, message: '请输入道路运输证字号', trigger: 'blur' }],
        transportLicenceCode: [{ required: true, message: '请输入道路运输证编码', trigger: 'blur' }],
        licenceIssuingAuthority: [{ required: true, message: '请输入发证机关名称', trigger: 'blur' }],
        transportRemindDate: [{ required: true, message: '请输入提前提醒天数', trigger: 'blur' }],
        transportZoneId: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
        transportBeginDate: [{ required: true, message: '请选择有效开始日期', trigger: 'change' }],
        transportEndDate: [{ required: true, message: '请选择有效截止日期', trigger: 'change' }],
        transportBusinessScope: [{ required: true, message: '请选择经营范围', trigger: 'change' }]
      },
      fourRules: {
        accessWay: [{ required: true, message: '请选择入网方式', trigger: 'change' }],
        terminalName: [{ required: true, message: '请输入车载终端名称', trigger: 'blur' }],
        platformId: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
        serverIpPort: [{ required: true, message: '请选择服务器域名及端口', trigger: 'change' }],
        communicationProtocolVersion: [{ required: true, message: '请选择通讯协议版本', trigger: 'change' }],
        locateMode: [{ required: true, message: '请选择定位模式', trigger: 'change' }],
        communicationMode: [{ required: true, message: '请选择通讯模式', trigger: 'change' }],
        manufacturerName: [{ required: true, message: '请输入制造商名称', trigger: 'blur' }],
        hostType: [{ required: true, message: '请输入主机型号', trigger: 'blur' }],
        internetCard: [{ required: true, message: '请输入物联网卡号', trigger: 'blur' }],
        cameraNum: [{ required: true, message: '请输入视频通道数', trigger: 'blur' }],
        functions: [{ required: true, message: '请选择设备类型', trigger: 'change' }]
      },
      fiveRules: {
        number: [{ required: true, message: '请输入保险单号', trigger: 'blur' }],
        advanceRemindDay: [{ required: true, message: '请输入提前提醒天数', trigger: 'blur' }],
        cost: [{ required: true, message: '请输入险费小计', trigger: 'blur' }],
        money: [{ required: true, message: '请输入保险金额', trigger: 'blur' }],
        typeCode: [{ required: true, message: '请选择保险类型', trigger: 'change' }],
        riskTypeCode: [{ required: true, message: '请选择险别', trigger: 'change' }]
      },
      textMap: {
        update: '更新信息',
        create: '新增',
        detail: '详情'
      },
      dialogStatus: '',
      onLineTitle: '入网信息',
      dialogVisible: false,
      accessFormData: {},
      operateStatusMap: new Map(),
      plateColorMap: new Map(),
      currentAccessInfo: false,
      insuranceTypeOptions: [], // 保险类型
      insuranceTypeMap: new Map(),
      riskTypeOptions: [], // 险别
      riskTypeMap: new Map(),
      insuranceFormData: {}, // 添加保险信息数据
      currentRow: {}, // 当前正在操作的数据
      addInsurance: false, // 判断是否是在添加保险信息
      insuranceLoading: false, // 保险表格加载
      insuranceData: [], // 保险信息表格数据
      dialogInsuranceVisible: false, // 保险信息弹窗
      fuelTypeOptions: [], // 燃料类型
      portOptions: [], // 域名及端口
      protocolOptions: [], // 通讯协议版本
      modeOptions: [], // 通讯模式
      positionModeOptions: [], // 定位模式
      accessWayOptions: [], // 接入方式
      insuranceDetail: false, // 是否查看保险详情
      carKindOptions: [], // 车辆类型
      plateColorOptions: [] // 车牌颜色
    }
  },
  watch: {
    'listQuery.unitName'(newv, oldv) {
      newv === '' ? this.listQuery.unitId = '' : ''
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.getQueryConditions()
    this.getPlateColor()
    this.getFuelType()
    this.getPort()
    this.getProtocol()
    this.getMode()
    this.getPositionMode()
    this.getInsuranceType()
    this.getRiskType()
    this.getOprationTypeOptions()
    this.getUseNature()
    this.getCarColor()
  },
  mounted() {
    this.getList()
    this.functionsOptions = JSON.parse(localStorage.getItem('onlineOption'))['equipment_terminal_type'].list
  },
  methods: {
    getList() {
      this.listLoading = true
      selectList({ ...this.listQuery })
        .then(res => {
          const { data } = res
          this.list = data.list
          this.total = data.total
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    // 车辆营运类型
    getOprationTypeOptions() {
      queryOperationType()
        .then(res => {
          this.vehicleTypeOptions = res.data
        })
        .catch(err => {
          throw err
        })
    },
    // 车身颜色
    getCarColor() {
      queryCarColor()
        .then(res => {
          this.carColorOptions = res.data
        })
        .catch(err => {
          throw err
        })
    },
    // 保险类型
    getInsuranceType() {
      queryInsuranceType()
        .then(res => {
          const { data } = res
          this.insuranceTypeOptions = data
          data.forEach(item => {
            this.insuranceTypeMap.set(item.label, item.value)
          })
        })
        .catch(err => {
          throw err
        })
    },
    // 获取使用性质
    getUseNature() {
      queryUseNature()
        .then(res => {
          const { data } = res
          this.useNatureOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    // 险别
    getRiskType() {
      queryInsurance()
        .then(res => {
          const { data } = res
          this.riskTypeOptions = data
          data.forEach(item => {
            this.riskTypeMap.set(item.label, item.value)
          })
        })
        .catch(err => {
          throw err
        })
    },
    // 获取燃料类型
    getFuelType() {
      queryFuel()
        .then(res => {
          const { data } = res
          this.fuelTypeOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    // 获取域名及端口
    getPort() {
      queryPort()
        .then(res => {
          const { data } = res
          this.portOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    // 获取通讯协议版本
    getProtocol() {
      queryProtocol()
        .then(res => {
          const { data } = res
          this.protocolOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    // 通讯模式
    getMode() {
      queryMode()
        .then(res => {
          const { data } = res
          this.modeOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    // 获取定位模式
    getPositionMode() {
      queryPositioningMode()
        .then(res => {
          const { data } = res
          this.positionModeOptions = data
        })
        .catch(err => {
          throw err
        })
    },
    // 车牌颜色
    getPlateColor() {
      queryColor()
        .then(res => {
          this.$nextTick(() => {
            const { data } = res
            this.plateColorOptions = data
            data.forEach(item => {
              this.plateColorMap.set(item.value, item.label)
            })
          })
        })
        .catch(err => {
          throw err
        })
    },
    getQueryConditions() {
      this.listLoading = true
      queryConditions()
        .then(res => {
          this.$nextTick(() => {
            const { data } = res
            this.operateStatusOptions = data['运营状态']
            data['运营状态'].forEach(item => {
              this.operateStatusMap.set(item.value, item.label)
            })
            this.carKindOptions = data['车辆类型']
            this.accessWayOptions = data['入网方式']
            this.listLoading = false
          })
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    searchType(queryString, cb) {
      if (queryString) {
        enterpriseName({ unitName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.unitName
              item.value = item.unitName
            })
            cb(data)
          })
          .catch(err => {
            throw err
          })
      } else {
        cb([])
        return
      }
    },
    selectCompany(val) {
      this.createFormData.unitId = val.unitId.toString()
      this.createFormData.unitName = val.unitName
    },
    selectSearchCompany(v) {
      this.listQuery.unitId = v.unitId
    },
    // 模糊搜索平台
    searchPlatform(queryString, cb) {
      if (queryString) {
        platformInfoName({ platformName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.id
              item.value = item.platformName
            })
            cb(data)
          })
          .catch(err => {
            throw err
          })
      } else {
        cb([])
        return
      }
    },
    selectPlatform(val) {
      this.accessFormData.platformId = val.platformId.toString()
    },
    // 模糊搜索服务商
    searchService(queryString, cb) {
      if (queryString) {
        facilitatorName({ unitName: queryString })
          .then(res => {
            const { data } = res
            data.forEach(item => {
              item.label = item.id
              item.value = item.unitName
            })
            cb(data)
          })
          .catch(err => {
            throw err
          })
      } else {
        cb([])
        return
      }
    },
    // 选择服务商
    selectService(val) {
      this.accessFormData.unitName = val.unitName
    },
    // 点击搜索
    handleSearch() {
      if (this.listQuery.zoneId) {
        this.listQuery.zoneId = this.listQuery.zoneId[2] || this.listQuery.zoneId[1]
      }
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 点击新增按钮
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['oneForm'].clearValidate()
        this.$refs['twoForm'].clearValidate()
        this.$refs['threeForm'].clearValidate()
      })
    },
    // 点击查看详情
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.dialogVisible = true
      this.currentRow = row
      if (row.plateColor) row.plateColor = row.plateColor.toString()
      if (row.vehicleType) row.vehicleType = row.vehicleType.toString()
      if (row.useNature) row.useNature = row.useNature.toString()
      selectTransport({ vehicleId: row.vehicleId })
        .then(res => {
          this.createFormData = { ...row, ...res.data }
          this.translateCode()
          this.$nextTick(() => {
            this.$refs['oneForm'].clearValidate()
            this.$refs['twoForm'].clearValidate()
            this.$refs['threeForm'].clearValidate()
          })
        })
        .catch(err => {
          throw err
        })
    },
    // 转换地区编码
    translateCode() {
      if (this.createFormData.zoneId) {
        this.createFormData.zoneId = getAreaText(this.createFormData.zoneId.toString())
        this.createFormData.zoneId.pop()
      }
      if (this.createFormData.registerZoneId) {
        this.createFormData.registerZoneId = getAreaText(this.createFormData.registerZoneId.toString())
        this.createFormData.registerZoneId.pop()
      }
      if (this.createFormData.transportZoneId) {
        this.createFormData.transportZoneId = getAreaText(this.createFormData.transportZoneId.toString())
        this.createFormData.transportZoneId.pop()
      }
    },
    // 车辆信息弹框上一步
    lastStep() {
      this.indexs -= 1
    },
    // 车辆信息弹框下一步
    nextStep() {
      if (this.dialogStatus !== 'detail') {
        if (this.indexs === 1) {
          this.$refs['oneForm'].validate(valid => {
            if (valid) this.indexs += 1
          })
        } else if (this.indexs === 2) {
          this.$refs['twoForm'].validate(valid => {
            if (valid) this.indexs += 1
          })
        }
      } else this.indexs += 1
    },
    // 关闭车辆信息弹框
    closeDialog() {
      this.dialogVisible = false
      setTimeout(() => {
        this.indexs = 1
        this.createFormData = {}
      }, 500)
    },
    // 关闭入网信息弹窗
    closeAccessDialog() {
      this.dialogFormVisible = false
      this.accessFormData = {}
    },
    // 点击更新信息按钮
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.currentRow = row
      if (row.plateColor) row.plateColor = row.plateColor.toString()
      if (row.vehicleType) row.vehicleType = row.vehicleType.toString()
      if (row.useNature) row.useNature = row.useNature.toString()
      selectTransport({ vehicleId: row.vehicleId })
        .then(res => {
          this.createFormData = { ...row, ...res.data }
          this.translateCode()
        })
        .catch(err => {
          throw err
        })
      this.$nextTick(() => {
        this.$refs['oneForm'].clearValidate()
        this.$refs['twoForm'].clearValidate()
        this.$refs['threeForm'].clearValidate()
      })
    },
    // 删除入网信息
    deleteAccess() {
      AccessInstallationDelete({
        terminalId: this.accessFormData.terminalId,
        vehicleId: this.accessFormData.vehicleId
      })
        .then(res => {
          this.dialogFormVisible = false
          this.accessFormData = {}
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.indexs = 1
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
          throw err
        })
    },
    // 点击入网信息弹窗
    handleAccess(row) {
      this.onLineTitle = row.plateNum + '：入网信息'
      this.dialogFormVisible = true
      selectAccessInstallation({ vehicleId: row.vehicleId.toString() })
        .then(res => {
          const { data } = res
          if (data) {
            data.serverIpPort = data.serverIpPort ? data.serverIpPort.toString() : null
            data.communicationMode = data.communicationMode ? data.communicationMode.toString() : null
            data.communicationProtocolVersion = data.communicationProtocolVersion ? data.communicationProtocolVersion.toString() : null
            data.functions = data.functions ? data.functions.split(',') : null
            this.accessFormData = {
              ...data,
              id: data.id,
              vehicleId: row.vehicleId,
              terminalId: data.terminalId
            }
            this.currentRow = row
            this.currentRow.hadAccess = true
          } else {
            this.currentRow = row
            this.currentRow.hadAccess = false
          }
          this.$nextTick(() => {
            this.$refs['fourForm'].clearValidate()
          })
        })
        .catch(err => {
          throw err
        })
      this.$nextTick(() => {
        this.$refs['fourForm'].clearValidate()
      })
    },
    // 保险信息详情
    showInsuranceDetail(row) {
      this.insuranceFormData = { ...row }
      this.currentRow = row
      this.addInsurance = true
      this.insuranceDetail = true
    },
    // 删除车辆信息
    deleteData() {
      this.$confirm('确定删除该车辆所有信息？删除后无法恢复')
        .then(() => {
          vehicleDelete({ vehicleId: this.currentRow.vehicleId })
            .then(res => {
              this.dialogVisible = false
              if (this.list.length === 1 && this.listQuery.pageNum !== 1) {
                this.listQuery.pageNum--
              }
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取保险信息表格数据
    getInsuranceData(vehicleId) {
      this.insuranceLoading = true
      selectInsurance({ vehicleId })
        .then(res => {
          const { data } = res
          data.forEach(item => {
            item.typeCode1 = this.insuranceTypeMap.get(item.typeCode.toString())
            item.typeCode = item.typeCode.toString()
            item.riskTypeCode1 = this.riskTypeMap.get(item.riskTypeCode.toString())
            item.riskTypeCode = item.riskTypeCode.toString()
          })
          this.insuranceData = data
          this.insuranceLoading = false
        })
        .catch(err => {
          this.insuranceLoading = false
          throw err
        })
    },
    // 点击保险信息按钮
    handleInsurance(row) {
      this.dialogInsuranceVisible = true
      this.currentRow = row
      this.getInsuranceData(row.id.toString())
    },
    // 点击添加保险信息按钮
    addInsuranceData() {
      this.insuranceFormData.modify = false
      this.insuranceDetail = false
      this.addInsurance = true
      this.$refs['fiveForm'].clearValidate()
    },
    // 保存保险信息
    saveInsurance() {
      this.$refs['fiveForm'].validate(valid => {
        if (valid) {
          if (this.insuranceFormData.modify) {
            this.insuranceFormData.id = parseInt(this.currentRow.id)
            this.insuranceFormData.vehicleId = this.currentRow.vehicleId.toString()
          } else {
            this.insuranceFormData.vehicleId = this.currentRow.id.toString()
          }
          InsuranceSave({ ...this.insuranceFormData })
            .then(res => {
              this.addInsurance = false
              this.insuranceFormData.modify
                ? this.getInsuranceData(this.currentRow.vehicleId.toString())
                : this.getInsuranceData(this.currentRow.id.toString())
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.insuranceFormData = {}
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
              throw err
            })
        }
      })
    },
    // 删除保险信息
    deleteInsurance(row) {
      this.$confirm('确认删除该条数据？删除后不可恢复')
        .then(() => {
          InsuranceDelete({ id: parseInt(row.id) })
            .then(res => {
              this.getInsuranceData(row.vehicleId.toString())
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
              throw err
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 取消保险信息
    cancelInsurance() {
      this.addInsurance = false
    },
    // 关闭保险弹窗
    closeInsuranceDialog() {
      this.dialogInsuranceVisible = false
      this.addInsurance = false
      this.insuranceFormData = {}
    },
    // 修改保险信息
    updateInsurance(row) {
      this.addInsurance = true
      this.insuranceDetail = false
      this.insuranceFormData = { ...row }
      this.insuranceFormData.modify = true
      this.currentRow = row
    },
    // 新增和修改入网信息
    createAccess() {
      this.$refs['fourForm'].validate(valid => {
        if (valid) {
          this.accessFormData.vehicleId = this.currentRow.vehicleId
          this.accessFormData.plateNum = this.currentRow.plateNum
          this.accessFormData.functions = this.accessFormData.functions.join(',')
          AccessInstallationSave({ ...this.accessFormData })
            .then(_ => {
              this.closeAccessDialog()
              this.$message({
                type: 'success',
                message: '新增成功'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '新增失败'
              })
              throw err
            })
        }
      })
    },
    // 新增车辆信息
    createData() {
      this.$refs['threeForm'].validate(valid => {
        if (valid) {
          const queryData = { ...this.createFormData }
          queryData.registerZoneId = queryData.registerZoneId[1]
          queryData.transportZoneId = queryData.transportZoneId[1]
          queryData.zoneId = queryData.zoneId[1]
          vehicleSave(queryData)
            .then(res => {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.getList()
              this.createFormData = {}
              this.indexs = 1
            })
            .catch(err => {
              this.$message({
                type: 'success',
                message: '新增失败'
              })
              throw err
            })
        }
      })
    },
    // 更新车辆信息
    updateData() {
      this.$refs['threeForm'].validate(valid => {
        if (valid) {
          const queryData = { ...this.createFormData }
          queryData.vehicleId = this.currentRow.vehicleId.toString()
          queryData.registerZoneId = queryData.registerZoneId[1]
          queryData.transportZoneId = queryData.transportZoneId[1]
          queryData.zoneId = queryData.zoneId[1]
          vehicleSave(queryData)
            .then(res => {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.getList()
              this.createFormData = {}
              this.indexs = 1
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '修改失败'
              })
              throw err
            })
        }
      })
    }
  }
}
</script>
<style scoped>
::v-deep .el-dialog__body {
  padding: 20px 20px;
}

::v-deep .el-form {
  margin-top: 20px;
}

.insurance-footer {
  margin-top: 20px;
  position: relative;
  left: 44%;
}
</style>
