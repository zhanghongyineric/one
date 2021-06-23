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
              <el-form-item label="营运状态:">
                <el-select v-model="listQuery.operateStatus" placeholder="请选择运营状态">
                  <el-option
                    v-for="item in operateStatusOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="所属地区:">
                  <el-cascader
                    v-model="listQuery.zoneId"
                    size="small"
                    :options="cityOptions"
                    placeholder="请选择所属地区"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="具备功能:">
                  <el-select v-model="listQuery.functions" placeholder="请选择具备功能">
                    <el-option
                      v-for="item in functionsOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="车辆类型:">
                  <el-select v-model="listQuery.vehicleType" placeholder="请选择车辆类型">
                    <el-option
                      v-for="item in vehicleTypeOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
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
        <el-table-column label="车辆类型" prop="vehicleType" min-width="250" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.vehicleType === 0 ? '不确定类型' : scope.row.vehicleType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运营状态" prop="operateStatus" min-width="200" align="center">
          <template v-if="scope.row.operateStatus" slot-scope="scope">
            <span>{{ operateStatusMap.get(scope.row.operateStatus.toString()) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌颜色" prop="plateColor" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{ plateColorMap.get(scope.row.plateColor.toString()) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否双驾" prop="doubleDrivers" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.doubleDrivers === 0 ? '是' : '否' }}
          </template>
        </el-table-column>
        <!--表格操作列-->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="300">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              更新信息
            </el-button>
            <el-button type="primary" size="mini" @click="handleAccess(row)">
              入网信息
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

      <!--新增、更新信息共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        top="50px"
        custom-class="base-dialog"
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
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item size="small" clearable label="车牌号:" prop="plateNum">
                <el-input v-model="createFormData.plateNum" placeholder="请输入车牌号" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item size="small" label="车辆营运类型:" prop="operateType">
                <el-select v-model="createFormData.operateType" placeholder="请选择车辆类型">
                  <el-option
                    v-for="item in vehicleTypeOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item size="small" label="所属企业:" prop="unitId">
                <el-autocomplete
                  v-model="createFormData.unitId"
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
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="生产日期:" prop="producedDate" size="small">
                <el-date-picker
                  v-model="createFormData.producedDate"
                  type="date"
                  placeholder="请选择生产日期"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="出厂日期:" prop="productionDate" size="small">
                <el-date-picker
                  v-model="createFormData.productionDate"
                  type="date"
                  placeholder="请选择出厂日期"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="检验有效期止:" prop="inspectionDate" size="small">
                <el-date-picker
                  v-model="createFormData.inspectionDate"
                  type="date"
                  placeholder="请选择检验有效期截止日期"
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
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车身颜色:" prop="color" size="small">
                <el-select
                  v-model="createFormData.color"
                  placeholder="请选择车身颜色"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="燃料类型:" prop="fuelType" size="small">
                <el-select
                  v-model="createFormData.fuelType"
                  placeholder="请选择燃料类型"
                >
                  <el-option
                    v-for="item in fuelTypeOptions"
                    :key="item.label"
                    :value="item.label"
                    :label="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="准牵引总质量:" prop="tractionQuality" size="small">
                <el-input v-model="createFormData.tractionQuality" placeholder="请输入准牵引总质量（kg）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="总质量:" prop="grossQuality" size="small">
                <el-input v-model="createFormData.grossQuality" placeholder="请输入总质量（kg）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="整备质量:" prop="curbQuality" size="small">
                <el-input v-model="createFormData.curbQuality" placeholder="请输入整备质量（kg）" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="核定载质量:" prop="loadQuality" size="small">
                <el-input v-model="createFormData.loadQuality" placeholder="请输入核定载质量（kg）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="发动机排量" prop="engineDisplacement" size="small">
                <el-input v-model="createFormData.engineDisplacement" placeholder="请输入发动机排量" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="核定载人数:" prop="passengerNum" size="small">
                <el-input v-model="createFormData.passengerNum" placeholder="请输入核定载人数" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="车长:" prop="length" size="small">
                <el-input v-model="createFormData.length" placeholder="请输入车长（mm）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车宽" prop="wide" size="small">
                <el-input v-model="createFormData.wide" placeholder="请输入车宽（mm）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车高:" prop="high" size="small">
                <el-input v-model="createFormData.high" placeholder="请输入车高（mm）" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="轴距:" prop="wheelBase" size="small">
                <el-input v-model="createFormData.wheelBase" placeholder="请输入轴距（mm）" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="车轴数" prop="axleNum" size="small">
                <el-input v-model="createFormData.axleNum" placeholder="请输入车轴数（个）" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="8" :sm="24">
              <el-form-item label="是否双驾:" prop="doubleDrivers" size="small">
                <el-select v-model="createFormData.doubleDrivers" placeholder="请选择是否双驾">
                  <el-option key="0" label="是" value="0" />
                  <el-option key="1" label="否" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="开始时间" prop="doubleDriversBeginTime" size="small">
                <el-date-picker
                  v-model="createFormData.doubleDriversBeginTime"
                  type="date"
                  placeholder="请选择双驾开始时间"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="结束时间" prop="doubleDriversEndTime" size="small">
                <el-date-picker
                  v-model="createFormData.doubleDriversEndTime"
                  type="date"
                  placeholder="请选择双驾结束时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="有关图片:" prop="operatingPermitImage" size="small">
              <p class="img-tit">
                <span v-if="!operatingPermitImage.length">未上传图片</span>
              </p>
              <div class="dialog-imgs">
                <div
                  v-for="img in operatingPermitImage"
                  :key="img"
                  class="img-con"
                >
                  <el-image
                    class="dialog-img"
                    :src="img"
                    fit="cover"
                    :preview-src-list="operatingPermitImage"
                    :z-index="3000"
                  />
                </div>
              </div>
            </el-form-item>
          </el-row>
        </el-form>

        <el-form
          v-show="indexs===2"
          ref="twoForm"
          :rules="twoRules"
          :model="createFormData"
          label-width="200px"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="机动车车辆类型:" prop="vehicleType">
                <el-select v-model="listQuery.vehicleType" size="small" placeholder="请选择机动车车辆类型">
                  <!-- <el-option
                    v-for="item in carKindList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  /> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="车籍所在地:" prop="registerZoneId">
                <el-cascader
                  v-model="createFormData.registerZoneId"
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
                <el-select v-model="createFormData.useNature" size="small" placeholder="请选择车辆使用性质" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="品牌型号:" prop="factoryType">
                <el-input v-model="createFormData.factoryType" size="small" placeholder="请输入品牌型号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="车辆识别代码VIN:" prop="vin">
                <el-input v-model="createFormData.vin" size="small" placeholder="请输入车辆识别代码VIN" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="发动机号:" prop="motorNum">
                <el-input v-model="createFormData.motorNum" size="small" placeholder="请输入发动机号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="注册日期:" prop="registerDate">
                <el-date-picker
                  v-model="createFormData.registerDate"
                  size="small"
                  type="date"
                  placeholder="请选择注册日期"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="发证日期:" prop="openingDate">
                <el-date-picker
                  v-model="createFormData.openingDate"
                  size="small"
                  type="date"
                  placeholder="请选择发证日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="车辆所有人:" prop="owner">
              <el-input v-model="createFormData.owner" size="small" placeholder="请输入车辆所有人" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="所有人住址:" prop="ownerAddr">
              <el-input v-model="createFormData.ownerAddr" size="small" placeholder="请输入车辆所有人详细住址" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="有关图片:" prop="operatingPermitImage">
              <p class="img-tit">
                <span v-if="!operatingPermitImage.length">未上传图片</span>
              </p>
              <div class="dialog-imgs">
                <div
                  v-for="img in operatingPermitImage"
                  :key="img"
                  class="img-con"
                >
                  <el-image
                    class="dialog-img"
                    :src="img"
                    fit="cover"
                    :preview-src-list="operatingPermitImage"
                    :z-index="3000"
                  />
                </div>
              </div>
            </el-form-item>
          </el-row>
        </el-form>

        <el-form
          v-show="indexs==3"
          ref="threeForm"
          :rules="threeRules"
          :model="createFormData"
          label-width="200px"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="道路运输证字号:" prop="transportLicenceNum">
                <el-input v-model="createFormData.transportLicenceNum" size="small" placeholder="请输入道路运输证字号" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="道路运输证编码:" prop="transportLicenceCode">
                <el-input v-model="createFormData.transportLicenceCode" size="small" placeholder="请输入道路运输证编码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="所属区域:" prop="transportZoneId">
                <el-cascader
                  v-model="createFormData.transportZoneId"
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
                  size="small"
                  type="date"
                  placeholder="请选择有效开始日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="有效截止日期:" prop="transportEndDate">
                <el-date-picker
                  v-model="createFormData.transportEndDate"
                  size="small"
                  type="date"
                  placeholder="请选择有效截止日期"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="发证机关名称:" prop="licenceIssuingAuthority">
                <el-input v-model="createFormData.licenceIssuingAuthority" size="small" placeholder="请输入发证机关名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="提前提醒天数:" prop="transportRemindDate">
              <el-input v-model="createFormData.transportRemindDate" size="small" placeholder="请输入提前提醒天数" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="经营范围:" prop="transportBusinessScope">
              <el-select v-model="createFormData.transportBusinessScope" size="small" multiple placeholder="请选择经营范围">
                <!-- <el-option
                  v-for="item in option4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                /> -->
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="有关图片:" prop="operatingPermitImage">
              <p class="img-tit">
                <span v-if="!operatingPermitImage.length">未上传图片</span>
              </p>
              <div class="dialog-imgs">
                <div
                  v-for="img in operatingPermitImage"
                  :key="img"
                  class="img-con"
                >
                  <el-image
                    class="dialog-img"
                    :src="img"
                    fit="cover"
                    :preview-src-list="operatingPermitImage"
                    :z-index="3000"
                  />
                </div>
              </div>
            </el-form-item>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-show="indexs !== 1" type="primary" @click="lastStep()">上一步</el-button>
          <el-button v-show="indexs !== 3" type="primary" @click="nextStep()">下一步</el-button>
          <el-button type="primary" @click="closeDialog()">关闭</el-button>
          <el-button v-show="indexs === 3 && dialogStatus==='create'" type="primary" @click="createData()">
            保存
          </el-button>
          <el-button v-show="indexs === 3 && dialogStatus==='update'" type="primary" @click="updateData()">
            保存
          </el-button>
        </div>
      </el-dialog>

      <!--入网信息弹窗-->
      <el-dialog
        :title="onLineTitle"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class="base-dialog"
        top="50px"
      >
        <el-form
          ref="fourForm"
          :rules="fourRules"
          :model="accessFormData"
          label-width="200px"
        >
          <el-row>
            <el-form-item label="入网方式:" prop="shortName">
              <el-select v-model="accessFormData.accessWay" size="small" placeholder="请选择入网方式">
                <!-- <el-option
                  v-for="item in networkStyleList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                /> -->
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="车载终端名称:" prop="terminalName">
                <el-input v-model="accessFormData.terminalName" size="small" placeholder="请输入" />
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
                <el-select v-model="accessFormData.serverIpPort" size="small" placeholder="请选择服务器域名及端口">
                  <el-option
                    v-for="item in portOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
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
                <el-select v-model="accessFormData.communicationProtocolVersion" size="small" placeholder="请选择通讯协议版本">
                  <el-option
                    v-for="item in protocolOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="定位模式:" prop="locateMode">
                <el-select v-model="accessFormData.locateMode" size="small" placeholder="请选择定位模式">
                  <el-option
                    v-for="item in positionModeOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="通讯模式:" prop="communicationMode">
                <el-select v-model="accessFormData.communicationMode" size="small" placeholder="请选择通讯模式">
                  <el-option
                    v-for="item in modeOptions"
                    :key="item.label"
                    :label="item.value"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="制造商名称:" prop="manufacturerName">
                <el-input v-model="accessFormData.manufacturerName" size="small" placeholder="请输入制造商名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="主机型号:" prop="hostType">
                <el-input v-model="accessFormData.hostType" size="small" placeholder="请输入主机型号" />
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="物联网卡号:" prop="internetCard">
                <el-input v-model="accessFormData.internetCard" size="small" placeholder="请输入物联网卡号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="视频通道数:" prop="cameraNum">
              <el-input v-model="accessFormData.cameraNum" size="small" placeholder="请输入视频通道数" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="主要功能:" prop="functions">
              <el-select v-model="accessFormData.functions" size="small" multiple placeholder="请选择主要功能">
                <!-- <el-option
                  v-for="item in minStyleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                /> -->
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="有关图片:" prop="operatingPermitImage">
              <p class="img-tit">
                <span v-if="!operatingPermitImage.length">未上传图片</span>
              </p>
              <div class="dialog-imgs">
                <div
                  v-for="img in operatingPermitImage"
                  :key="img"
                  class="img-con"
                >
                  <el-image
                    class="dialog-img"
                    :src="img"
                    fit="cover"
                    :preview-src-list="operatingPermitImage"
                    :z-index="3000"
                  />
                </div>
              </div>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="closeDialog()">关闭</el-button>
          <el-button type="primary" :loading="buttonLoading" @click="createData()">
            保存
          </el-button>
          <el-button v-show="indexs === 2" type="primary" :loading="buttonLoading" @click="updateData()">
            保存
          </el-button>
          <el-popconfirm
            title="确认删除吗？"
            style="margin-left:10px;margin-right:10px;"
            @confirm="handleDelete()"
          >
            <el-button slot="reference" size="large" type="danger" style="margin-left: -5px">
              删除
            </el-button>
          </el-popconfirm>
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
  queryPositioningMode
} from '@/api/information-manage/car-base-information'
import { provinceAndCityData, CodeToText } from 'element-china-area-data'
import Pagination from '@/components/Pagination'
// import AreaSelect from '@/components/AreaSelect'
// import RemoteSearch from '@/components/RemoteSearch/select'
// import { isPhoneNumber, parseTime } from '@/utils'
// import ChoosePoint from '@/components/ChoosePoint'

export default {
  name: 'CarBaseInformation',
  components: { Pagination },
  data() {
    return {
      indexs: 1,
      cityOptions: provinceAndCityData,
      unitAddress: null,
      dialogFormVisible: false,
      rowId: '',
      list: [], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        plateNum: '',
        operateStatus: null,
        functions: '',
        vehicleType: '',
        doubleDrivers: null,
        zoneId: null
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        status: '',
        operationType: '',
        unitName: '',
        // zoneId: 0,
        place: [],
        area: ''
      }, // 用于重置查询条件
      area: [],
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      operateStatusOptions: [],
      vehicleTypeOptions: [],
      functionsOptions: [],
      createFormData: {},
      // 用于重置新增的数据
      oneRules: {
        plateNum: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        unitId: [{ required: true, message: '请输入所属企业', trigger: 'blur' }],
        vehicleType: [{ required: true, message: '请选择车辆营运类型', trigger: 'change' }],
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
        shortName: [{ required: true, message: '请选择入网方式', trigger: 'change' }],
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
        functions: [{ required: true, message: '请选择主要功能', trigger: 'change' }]
      },
      textMap: {
        update: '更新信息',
        create: '新增'
        // detail: '详情'
      }, // 弹出框标题
      onLineFormData: {
        minThings: []
      },
      dialogStatus: '',
      onLineTitle: '入网信息',
      poiPicker: null,
      operatingPermitImage: [],
      dialogVisible: false,
      accessFormData: {},
      operateStatusMap: new Map(),
      plateColorMap: new Map(),
      currentAccessInfo: false,
      fuelTypeOptions: [], // 燃料类型
      portOptions: [], // 域名及端口
      protocolOptions: [], // 通讯协议版本
      modeOptions: [], // 通讯模式
      positionModeOptions: [] // 定位模式
    }
  },
  created() {
    this.getQueryConditions()
    this.getPlateColor()
    this.getFuelType()
    this.getPort()
    this.getProtocol()
    this.getMode()
    this.getPositionMode()
  },
  mounted() {
    this.getList()
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
    getPlateColor() {
      queryColor()
        .then(res => {
          this.$nextTick(() => {
            const { data } = res
            data.forEach(item => {
              this.plateColorMap.set(item.label, item.value)
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
              this.operateStatusMap.set(item.label, item.value)
            })
            this.vehicleTypeOptions = data['车辆类型']
            this.functionsOptions = data['具备功能']
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
      this.listQuery.unitName = val.unitName
    },
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
      this.accessFormData.platformId = val.id.toString()
    },
    searchService(queryString, cb) {
      if (queryString) {
        facilitatorName({ unitName: queryString })
          .then(res => {
            const { data } = res
            console.log(data)
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
    selectService(val) {
      this.accessFormData.unitName = val.unitName
    },
    // 点击搜索
    handleSearch() {
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
      })
    },
    // 点击查看详情
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['oneForm'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
    },
    // 更新数据-删除数据
    handleDelete() {
      this.listLoading = true
    },
    // 弹框
    lastStep() {
      this.indexs -= 1
    },
    nextStep() {
      this.indexs += 1
    },
    closeDialog() {
      this.dialogVisible = false
      this.indexs = 1
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    handleAccess(row) {
      this.onLineTitle = row.plateNum + '：入网信息'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['fourForm'].clearValidate()
      })
      selectAccessInstallation({ vehicleId: row.id.toString() })
        .then(res => {
          const { data } = res
          if (data) this.accessFormData = { ...data, id: row.id.toString() }
        })
        .catch(err => {
          throw err
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
</style>
