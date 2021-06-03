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
                <el-input v-model="listQuery.unitName" placeholder="请输入车牌号" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="企业名称:">
                <el-input v-model="listQuery.unitName" placeholder="请输入企业名称" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="运营状态:">
                  <el-select v-model="listQuery.status" placeholder="请选择运营状态">
                    <el-option
                      v-for="item in optionGroup.accountTypeList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="所属地区:">
                  <AreaSelect v-model="listQuery.place" size="small" limit-area :area-text.sync="listQuery.area" />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="具备功能:">
                  <el-select v-model="listQuery.myFunction" placeholder="请选择具备功能">
                    <el-option
                      v-for="item in optionGroup.myFunctionList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="入网方式:">
                  <el-select v-model="listQuery.networkStyle" placeholder="请选择入网方式">
                    <el-option
                      v-for="item in optionGroup.networkStyleList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="车辆类型:">
                  <el-select v-model="listQuery.networkStyle" placeholder="请选择车辆类型">
                    <el-option
                      v-for="item in optionGroup.carKindList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="运行状态:">
                  <el-select v-model="listQuery.networkStyle" placeholder="请选择运行状态">
                    <el-option
                      v-for="item in optionGroup.runStatusList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="安装时间:">
                  <el-select v-model="listQuery.networkStyle" placeholder="请选择入网安装时间">
                    <el-option
                      v-for="item in optionGroup.networkPlayList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="是否双驾:">
                  <el-select v-model="listQuery.networkStyle" placeholder="请选择入">
                    <el-option
                      v-for="item in optionGroup.driveList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
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
        <el-table-column v-slot="{row}" label="车牌号" prop="unitName" width="100" show-overflow-tooltip align="center">
          {{ row.unitName || '-' }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="车辆类型" prop="operationType" width="250" align="center">
          {{ row.operationType | companyRoleFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="运营状态" prop="status" width="200" align="center">
          {{ row.status | companyStatusFilter }}
        </el-table-column>
        <el-table-column label="保险信息" prop="baoxian" width="100" align="center">
          <a href="#">保险信息</a>
        </el-table-column>
        <el-table-column v-slot="{row}" label="驾驶类型" prop="carStatus" width="100" align="center">
          {{ row.carStatus | companyLevelFilter }}
        </el-table-column>
        <!--表格操作列-->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              更新信息
            </el-button>
            <el-button type="primary" size="mini" @click="handleDetail(row)">
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

      <!--编辑、新增、查看详情共用弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class="base-dialog dialog-col-1"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="createFormData"
          label-width="200px"
        >
          <!--          <el-form-item-->
          <!--            label="账号类别:"-->
          <!--            prop="role"-->
          <!--          >-->
          <!--            <el-select-->
          <!--              v-model="createFormData.role"-->
          <!--              placeholder="请选择账号类别"-->
          <!--              :disabled="dialogStatus==='update'"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-if="dialogStatus === 'update'"-->
          <!--                key="unit"-->
          <!--                label="企业"-->
          <!--                value="unit"-->
          <!--              />-->

          <!--              <el-option-->
          <!--                v-for="{label,value} in optionGroup.roleList"-->
          <!--                :key="value"-->
          <!--                :label="label"-->
          <!--                :value="value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->

          <!--公司选择-->
          <!--          <el-form-item v-if="createFormData.role==='unit'" label="企业名称:" prop="unitName">-->
          <!--            <RemoteSearch-->
          <!--              v-model="createFormData.unitName"-->
          <!--              :api-method="searchCompany"-->
          <!--              :formatter="formatter"-->
          <!--              label="企业"-->
          <!--              @onSelect="selectCompany"-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item v-if="createFormData.role==='admin'" label="企业名称:" prop="unitName">
            <el-input v-model="createFormData.unitName" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item label="企业简称:" prop="shortName">
            <el-input v-model="createFormData.shortName" placeholder="请输入企业简称" />
          </el-form-item>
          <el-form-item
            label="企业级别:"
            prop="aptitudeLevel"
          >
            <el-select
              v-model="createFormData.aptitudeLevel"
              placeholder="请选择企业级别"
            >
              <el-option
                v-for="item in optionGroup.roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上级企业单位:" prop="upUnitName">
            <el-input v-model="createFormData.upUnitName" placeholder="请输入上级企业单位" />
          </el-form-item>
          <!--          区域选择-->
          <el-form-item v-if="createFormData.role!=='admin'" label="行政区域:" prop="zoneId">
            <AreaSelect v-model="createFormData.zoneId" size="large" :area-text.sync="createFormData.areaText" />
          </el-form-item>
          <el-form-item label="社会统一信用代码:" prop="businessLicence">
            <el-input v-model="createFormData.businessLicence" />
          </el-form-item>
          <el-form-item
            label="企业经济类型:"
            prop="enconomicType"
          >
            <el-select
              v-model="createFormData.enconomicType"
              placeholder="请选择企业经济类型"
            >
              <el-option
                v-for="item in optionGroup.economyList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="地址:" prop="unitAddress" class="address">
            <el-input
              v-model="createFormData.unitAddress"
              placeholder="请通过右侧选点确定企业地址"
              disabled
            />
            <!--传入对象，选点成功后会将修改了address、longitude、latitude的对象传回-->
            <!--需要手动修改绑定choosePoint事件-->
            <ChoosePoint :infos.sync="createFormData" />
          </el-form-item>
          <el-form-item label="法人:" prop="lrname">
            <el-input v-model="createFormData.lrname" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="电话号码:" prop="telephone">
            <el-input v-model="createFormData.telephone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系人:" prop="contact">
            <el-input v-model="createFormData.contact" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话:" prop="contactphone">
            <el-input v-model="createFormData.contactphone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="传真号码:" prop="postcode">
            <el-input v-model="createFormData.postcode" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="企业注册地代码:" prop="registerZoneId">
            <el-input v-model="createFormData.registerZoneId" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="道路运输经营范围代码:" prop="businesScopeCode">
            <el-input v-model="createFormData.businesScopeCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="道路运输经营范围描述:" prop="businesScopeScript">
            <el-input v-model="createFormData.businesScopeScript" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="企业运营类型:"
            prop="operationType"
          >
            <el-select
              v-model="createFormData.operationType"
              placeholder="请选择企业类型"
            >
              <el-option
                v-for="item in optionGroup.companyTypes"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息:" prop="remark">
            <el-input v-model="createFormData.remark" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="排序编号:" prop="orderNumber">
            <el-input v-model="createFormData.orderNumber" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="状态:"
            prop="status"
          >
            <el-select
              v-model="createFormData.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in optionGroup.accountTypeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="道路运输经营许可证号:" prop="transportLincense">
            <el-input v-model="createFormData.transportLincense" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="道路运输经营许可证有效期起:" prop="transportStartDate">
            <el-input v-model="createFormData.transportStartDate" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="道路运输经营许可证有效期止:" prop="transportEndDate">
            <el-input v-model="createFormData.transportEndDate" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-if="dialogStatus==='detail'" label="有关图片:" prop="operatingPermitImage">
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" :loading="buttonLoading" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// import { fetchList, companyStatus, companyRoleStatus, companyEconomyStatus, updateCount } from '@/api/information-manage/company-base-information'
import Pagination from '@/components/Pagination' // 分页
import AreaSelect from '@/components/AreaSelect'
import RemoteSearch from '@/components/RemoteSearch/select'
import { isPhoneNumber, parseTime } from '@/utils'
import { carRoleOption, runStatusOption, companyLevel, doubleStatusOption } from '@/options'
import ChoosePoint from '@/components/ChoosePoint'

// const onlineOption = JSON.parse(localStorage.getItem('onlineOption'))

export default {
  name: 'CarBaseInformation',
  components: { Pagination, AreaSelect, RemoteSearch, ChoosePoint },
  filters: {
    companyRoleFilter: function(role) {
      return carRoleOption.map[role]
    }, // 车辆类型
    companyStatusFilter: function(status) {
      return runStatusOption.map[status]
    }, // 运营状态
    companyLevelFilter: function(status) {
      return doubleStatusOption.map[status]
    } // 单双驾
    // companyEconomyFilter: function(status) {
    //   return companyEconomy.map[status]
    // }
  },
  data() {
    const validateUnitTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入企业电话'))
      } else if (!isPhoneNumber(value)) {
        callback(new Error('请输入正确企业电话'))
      } else {
        callback()
      }
    }
    // const self = this
    return {
      unitAddress: null,
      dialogFormVisible: false,
      rowId: '',
      list: [
        {
          unitName: '川A34567',
          operationType: 1,
          status: 2,
          baoxian: '',
          carStatus: 2
        },
        {
          unitName: '川A34567',
          operationType: 2,
          status: 1,
          baoxian: '',
          carStatus: 1
        },
        {
          unitName: '川A34567',
          operationType: 1,
          status: 2,
          baoxian: '',
          carStatus: 2
        },
        {
          unitName: '川A34567',
          operationType: 4,
          status: 1,
          baoxian: '',
          carStatus: 1
        }
      ], // 表格数据
      listLoading: true, // 表格加载状态
      buttonLoading: false, // 弹窗按钮加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        status: '',
        operationType: '',
        unitName: '',
        // zoneId: 0,
        place: [],
        area: ''
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
      optionGroup: {
        // runList: companyRoleOption.list,
        // newStateList: companyStatusOption.list,
        roleList: companyLevel.list,
        // economyList: [
        //   {
        //     label: '集体',
        //     value: null
        //   },
        //   {
        //     label: '私营',
        //     value: null
        //   },
        //   {
        //     label: '个体',
        //     value: null
        //   },
        //   {
        //     label: '联营',
        //     value: null
        //   },
        //   {
        //     label: '股份制',
        //     value: null
        //   },
        //   {
        //     label: '外商独资',
        //     value: null
        //   },
        //   {
        //     label: '港,澳,台商投资企业',
        //     value: null
        //   },
        //   {
        //     label: '有限责任',
        //     value: null
        //   },
        //   {
        //     label: '其他经济',
        //     value: null
        //   },
        //   {
        //     label: '有限',
        //     value: null
        //   },
        //   {
        //     label: '个人独资',
        //     value: null
        //   },
        //   {
        //     label: '普通合伙',
        //     value: null
        //   },
        //   {
        //     label: '其他有限责任公司',
        //     value: null
        //   },
        //   {
        //     label: '国有',
        //     value: null
        //   }
        // ],
        accountTypeList: [
          {
            label: '全部',
            value: null
          },
          {
            label: '停运',
            value: null
          },
          {
            label: '注销',
            value: null
          },
          {
            label: '转出',
            value: null
          },
          {
            label: '正常',
            value: null
          },
          {
            label: '暂停服务',
            value: null
          }
        ], // 运营状态
        myFunctionList: [
          {
            label: '全部',
            value: null
          },
          {
            label: '行驶记录',
            value: null
          },
          {
            label: '视频监控',
            value: null
          },
          {
            label: '高级驾驶辅助ADAS',
            value: null
          },
          {
            label: '驾驶员状态监测LKP',
            value: null
          }
        ], // 具备功能
        networkStyleList: [
          {
            label: '全部',
            value: null
          },
          {
            label: '终端设备接入',
            value: null
          },
          {
            label: '平台服务接入',
            value: null
          }
        ], // 入网方式
        carKindList: [
          {
            label: '全部',
            value: null
          },
          {
            label: '三类以上班线客运',
            value: null
          },
          {
            label: '旅游包车客运',
            value: null
          },
          {
            label: '危险货物运输',
            value: null
          }
        ], // 车辆类型
        runStatusList: [
          {
            label: '全部',
            value: null
          },
          {
            label: '未入网',
            value: null
          },
          {
            label: '已入网',
            value: null
          },
          {
            label: '当日上线',
            value: null
          },
          {
            label: '当月上线',
            value: null
          },
          {
            label: '卫星定位实时在线',
            value: null
          }
        ], // 运行状态
        networkPlayList: [
          {
            label: '全部',
            value: null
          },
          {
            label: '当天',
            value: null
          },
          {
            label: '本周',
            value: null
          },
          {
            label: '本月',
            value: null
          },
          {
            label: '上月',
            value: null
          },
          {
            label: '自定义',
            value: null
          }
        ], // 入网安装时间
        driveList: [
          {
            label: '全部',
            value: null
          },
          {
            label: '是',
            value: null
          },
          {
            label: '否',
            value: null
          }
        ] // 是否双驾
        // companyTypes: [
        //   {
        //     label: '班线客运企业',
        //     value: null
        //   },
        //   {
        //     label: '农村客运企业',
        //     value: null
        //   },
        //   {
        //     label: '旅游客运企业',
        //     value: null
        //   },
        //   {
        //     label: '危险品运输企业',
        //     value: null
        //   },
        //   {
        //     label: '普通货运企业',
        //     value: null
        //   },
        //   {
        //     label: '个体户',
        //     value: null
        //   },
        //   {
        //     label: '公交',
        //     value: null
        //   },
        //   {
        //     label: '出租',
        //     value: null
        //   },
        //   {
        //     label: '其他',
        //     value: null
        //   }
        // ]
        // value: ''
        // accountTypeList: onlineOption.account_type.list
      }, // 存放选项的数据
      createFormData: {
        role: 'admin',
        unitName: '',
        shortName: '',
        aptitudeLevel: '',
        upUnitName: '',
        zoneId: [],
        businessLicence: '',
        enconomicType: '',
        unitAddress: '',
        lrname: '',
        telephone: '',
        contact: '',
        contactphone: '',
        postcode: '',
        registerZoneId: '',
        businesScopeCode: '',
        businesScopeScript: '',
        operationType: '',
        remark: '',
        status: '',
        transportLincense: '',
        transportStartDate: '',
        transportEndDate: '',
        operatingPermitImage: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        role: 'admin',
        unitName: '',
        shortName: '',
        aptitudeLevel: '',
        upUnitName: '',
        zoneId: [],
        businessLicence: '',
        enconomicType: '',
        unitAddress: '',
        lrname: '',
        telephone: '',
        contact: '',
        contactphone: '',
        postcode: '',
        registerZoneId: '',
        businesScopeCode: '',
        businesScopeScript: '',
        operationType: '',
        remark: '',
        status: '',
        transportLincense: '',
        transportStartDate: '',
        transportEndDate: '',
        operatingPermitImage: ''
      }, // 存储新增和编辑框的数据
      // 用于重置新增的数据
      rules: {
        unitName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        telephone: [{ required: true, trigger: 'blur', validator: validateUnitTel }],
        shortName: [{ required: true, message: '请输入企业简称', trigger: 'blur' }],
        aptitudeLevel: [{ required: true, message: '请选择企业级别', trigger: 'change' }],
        // beforeName: [{ required: true, message: '请输入上级企业单位', trigger: 'change' }],
        zoneId: [{ required: true, message: '请选择行政区域', trigger: 'change' }],
        businessLicence: [{ required: true, message: '请选择社会统一信用代码', trigger: 'change' }],
        enconomicType: [{ required: true, message: '请选择企业经济类型', trigger: 'change' }],
        lrname: [{ required: true, message: '请选择法人', trigger: 'change' }],
        // contactPeople: [{ required: true, message: '请选择联系人', trigger: 'change' }],
        // contactPeoplePhone: [{ required: true, message: '请选择联系电话', trigger: 'change' }],
        // fexNum: [{ required: true, message: '请选择传真号码', trigger: 'change' }],
        registerZoneId: [{ required: true, message: '请选择企业注册地', trigger: 'change' }],
        businesScopeCode: [{ required: true, message: '请选择道路运输经营范围代码', trigger: 'change' }]
        // address: [{ required: true, message: '请选择地址', trigger: 'change' }],
      }, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '详情'
      }, // 弹出框标题
      dialogStatus: '',
      poiPicker: null,
      operatingPermitImage: []
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    this.handleSearch()
    this.getStatusCode()
    this.companyRole()
    this.economyListCode()
  },
  methods: {
    // 运营转态
    getStatusCode() {
      this.listLoading = true
      companyStatus()
        .then(res => {
          const { data } = res
          data.forEach(item => {
            if (item.value === '营运') {
              this.optionGroup.accountTypeList[1].value = parseInt(item.label)
            } else {
              this.optionGroup.accountTypeList[2].value = parseInt(item.label)
            }
          })
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    // 企业运营类型
    companyRole() {
      this.listLoading = true
      companyRoleStatus()
        .then(res => {
          const { data } = res
          data.forEach(item => {
            // console.log(item)
            if (item.value === '班线客运') {
              this.optionGroup.companyTypes[0].value = parseInt(item.label)
            } else if (item.value === '农村客运') {
              this.optionGroup.companyTypes[1].value = parseInt(item.label)
            } else if (item.value === '旅游客运') {
              this.optionGroup.companyTypes[2].value = parseInt(item.label)
            } else if (item.value === '危险品运输') {
              this.optionGroup.companyTypes[3].value = parseInt(item.label)
            } else if (item.value === '普通货运') {
              this.optionGroup.companyTypes[4].value = parseInt(item.label)
            } else if (item.value === '个体户') {
              this.optionGroup.companyTypes[5].value = parseInt(item.label)
            } else if (item.value === '公交') {
              this.optionGroup.companyTypes[6].value = parseInt(item.label)
            } else if (item.value === '出租') {
              this.optionGroup.companyTypes[7].value = parseInt(item.label)
            } else if (item.value === '其他') {
              this.optionGroup.companyTypes[8].value = parseInt(item.label)
            }
          })
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    // 企业经济类型
    economyListCode() {
      this.listLoading = true
      companyEconomyStatus()
        .then(res => {
          const { data } = res
          data.forEach(item => {
            // console.log(item)
            if (item.value === '集体') {
              this.optionGroup.economyList[0].value = parseInt(item.label)
            } else if (item.value === '私营') {
              this.optionGroup.economyList[1].value = parseInt(item.label)
            } else if (item.value === '个体') {
              this.optionGroup.economyList[2].value = parseInt(item.label)
            } else if (item.value === '联营') {
              this.optionGroup.economyList[3].value = parseInt(item.label)
            } else if (item.value === '股份制') {
              this.optionGroup.economyList[4].value = parseInt(item.label)
            } else if (item.value === '外商独资') {
              this.optionGroup.economyList[5].value = parseInt(item.label)
            } else if (item.value === '港,澳,台商投资企业') {
              this.optionGroup.economyList[6].value = parseInt(item.label)
            } else if (item.value === '有限责任') {
              this.optionGroup.economyList[7].value = parseInt(item.label)
            } else if (item.value === '其他经济') {
              this.optionGroup.economyList[8].value = parseInt(item.label)
            } else if (item.value === '有限') {
              this.optionGroup.economyList[9].value = parseInt(item.label)
            } else if (item.value === '个人独资') {
              this.optionGroup.economyList[10].value = parseInt(item.label)
            } else if (item.value === '普通合伙') {
              this.optionGroup.economyList[11].value = parseInt(item.label)
            } else if (item.value === '其他有限责任公司') {
              this.optionGroup.economyList[12].value = parseInt(item.label)
            } else if (item.value === '国有') {
              this.optionGroup.economyList[13].value = parseInt(item.label)
            }
          })
          this.listLoading = false
        })
        .catch(err => {
          this.listLoading = false
          throw err
        })
    },
    // setAreaText(data) {
    //   this.listQuery.zoneId = data
    //   this.handleSearch()
    // },
    // 将数据格式化后传递给remote-select组件
    // formatter(data) {
    //   console.log(data)
    //   return data.map(item => {
    //     return {
    //       ...item,
    //       label: item.value
    //     }
    //   })
    // },
    // 选择公司
    toChoosePoint() {
      this.pickLocation = true
      this.searchKey = this.createFormData.unitAddress
    },
    // 选择公司
    // selectCompany(item) {
    //   // 自动填充部分表单
    //   // this.createFormData.unitTel = item.phone
    //   this.createFormData.unitId = item.id
    // },
    // 搜索公司
    // searchCompany(query) {
    //   return searchCompany(query)
    // },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      // this.listLoading = true
      fetchList(
        {
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize,
          // zoneId: this.listQuery.area - 0,
          status: this.listQuery.status,
          operationType: this.listQuery.operationType,
          unitName: this.listQuery.unitName
        }).then((res) => {
        const { data: { list, total }} = res
        console.log({ data: { list, total }})
        // console.log(list.forEach(item => { console.log(item.id) }))
        this.list = list
        this.total = total
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
    // 点击新增按钮
    handleCreate() {
      this.resetCreateFormData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true

          // 将zoneId拆分成后端需要的数据
          // const zoneId = this.createFormData.zoneId
          const requestData = {
            ...this.createFormData
            // province: zoneId[0] || '',
            // city: zoneId[1] || '',
            // region: zoneId[2] || '',
            // area: this.createFormData.areaText
          }

          addCount(requestData).then(() => {
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
    // 点击查看详情
    handleDetail(row) {
      // let zoneId = [row.province, row.city, row.region]

      // 剔除多余的空字符串，方便组件回显
      // if (zoneId.indexOf('') !== -1) {
      //   zoneId = zoneId.slice(0, zoneId.indexOf('') + 1)
      // }
      const zoneId = [row.zoneId]
      this.createFormData = { ...row, zoneId } // 由于表格没有密码，不设置会为undefined
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showDetails(id, index) {
      this.dialogVisible = true
      this.operatingPermitImage = []
      this.listLoading = true
      this.rowId = id
      details({ id })
        .then((res) => {
          const { data } = res
          this.createFormData = { ...data }
          this.createFormData.index = index + 1
          let pathArr = []
          if (data.contentPic) { pathArr = data.contentPic.split('；') }
          for (let i = 0; i < pathArr.length; i++) {
            pathArr[i] = 'https://www.image.gosmooth.com.cn' + pathArr[i]
          }
          this.dialogInfo.operatingPermitImage = pathArr
          console.log(this.dialogInfo.operatingPermitImage, '申诉图片')
          this.listLoading = false
        })
        .catch((err) => {
          this.listLoading = false
          throw err
        })
    },
    // 点击编辑
    handleUpdate(row) {
      this.rowId = row.id
      console.log(row.zoneId)
      // let zoneId = [row.province, row.city, row.region]
      const zoneId = [row.zoneId]

      // 剔除多余的空字符串，方便组件回显
      // if (zoneId.indexOf('') !== -1) {
      //   zoneId = zoneId.slice(0, zoneId.indexOf('') + 1)
      // }

      this.createFormData = { ...row, zoneId } // 由于表格没有密码，不设置会为undefined
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          // 将zoneId拆分成后端需要的数据
          // const zoneId = this.createFormData.zoneId
          const zoneId = this.createFormData.zoneId
          const requestData = {
            id: this.rowId,
            ...this.createFormData,
            zoneId: zoneId[0] || ''
            // city: zoneId[1] || '',
            // region: zoneId[2] || '',
            // area: this.createFormData.areaText
          }

          updateCount(requestData).then(() => {
            this.dialogFormVisible = false
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
      deleteCount({ userId: row.userId }).then(() => {
        this.dialogFormVisible = false
        this.listLoading = false
        if (this.list.length === 1 && this.listQuery.pageNumber !== 1) {
          this.listQuery.pageNumber--
        }
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
.container {
  width: 700px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  border: 1px solid #999;
}

::v-deep .amap-box {
  height: 100vh !important;
}

.company-information .address ::v-deep.el-form-item__content {
  display: flex;

  .el-input {
    flex: 1;
    margin-right: 10px;
  }

}

</style>

