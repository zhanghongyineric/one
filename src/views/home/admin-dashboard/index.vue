<template>
  <div class="dashboard-container">
    <div class="search-list" :style="{height: searchH}">
      <!--<ul class="map-type">-->
      <!--  <li>电子地图</li>-->
      <!--  <li>卫星地图</li>-->
      <!--</ul>-->
      <el-form class="search" label-width="80px">
        <el-form-item label="归属地:" class="unit-place">
          <AreaSelect v-model="search.unitPlace" size="small" limit-area :area-text.sync="area" @update:areaText="setAreaText" />
        </el-form-item>
        <el-form-item label="企业类别:" class="company-type">
          <el-select v-model="listQuery.categoryId" placeholder="请选择企业类别" @change="getCompanyCode">
            <el-option label="全部" value="" />
            <el-option
              v-for="{label,value} in companyList"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="安全码:" class="code">
          <ul class="code-type">
            <li :class="{red: search.code.indexOf('4') !== -1}" @click="setCode('4')">红码</li>
            <li :class="{yellow: search.code.indexOf('3') !== -1}" @click="setCode('3')">黄码</li>
            <li :class="{blue: search.code.indexOf('2') !== -1}" @click="setCode('2')">蓝码</li>
            <li :class="{green: search.code.indexOf('1') !== -1}" @click="setCode('1')">绿码</li>
          </ul>
        </el-form-item>
        <el-form-item label="关键字:" class="hidden-keyword keyword">
          <RemoteSearch
            v-model="listQuery.keyWord"
            :api-method="searchCompany"
            label="公司"
            @onSelect="selectCompany"
          />
          <span class="clear-keyword el-icon-close" @click="clearKeyword" />
        </el-form-item>
        <el-tooltip class="item" effect="dark" content="展示更多筛选条件" placement="top-start">
          <span v-show="showSearchMoreBtn" class="el-icon-d-arrow-left more" @click="showMoreSearch" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="隐藏更多筛选条件" placement="top-start">
          <span v-show="!showSearchMoreBtn" class="el-icon-d-arrow-right less" @click="showLessSearch" />
        </el-tooltip>
      </el-form>
    </div>

    <div class="gaode-map">
      <GaodeMap :map-infos="mapInfos" />
    </div>

    <!--重点风险企业-->
    <div class="companys-con" :class="{'padding-b-0': !showCompanys}">
      <div class="companys-title">
        <b>重点风险企业</b>
        <!--<div class="tip" @click="showDetails(currTip.id)">-->
        <!--  <span class="el-icon-warning" />-->
        <!--  <span>{{ currTip.info }}，</span>-->
        <!--  <span class="lighter">点击查看详情。</span>-->
        <!--</div>-->
        <i
          v-if="showCompanys"
          class="el-icon-arrow-down"
          @click="showCompanys = !showCompanys"
        />
        <i
          v-if="!showCompanys"
          class="el-icon-arrow-up"
          @click="showCompanys = !showCompanys"
        />
      </div>
      <el-table
        v-if="showCompanys"
        :data="dangerCom"
        style="width: 100%"
        max-height="205"
        :show-header="false"
        stripe
      >
        <el-table-column
          prop="unitName"
          label="企业名称"
          min-width="180"
        />
        <el-table-column
          label="二维码"
          min-width="80"
        >
          <template>
            <svg-icon
              class="dangerCom-code"
              icon-class="code"
              :style="{color: '#ee6666'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="红码数量"
          min-width="160"
        >
          <template slot-scope="scope">
            <span>企业红码数量：{{ scope.row.redCount }}次</span>
          </template>
        </el-table-column>
        <el-table-column
          label="负责人"
          min-width="120"
        >
          <template slot-scope="scope">
            <span>负责人：{{ scope.row.legalPerson }} {{ scope.row.unitTel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="运营车辆"
          min-width="120"
        >
          <template slot-scope="scope">
            <span>运营车辆：{{ scope.row.vehicleAll }}辆</span>
          </template>
        </el-table-column>
        <el-table-column
          label="本周上线"
          min-width="120"
        >
          <template slot-scope="scope">
            <span>本周上线：{{ scope.row.onlineVehicle }}辆</span>
          </template>
        </el-table-column>
        <el-table-column
          label="违规总次数"
          min-width="190"
        >
          <template slot-scope="scope">
            <span>驾驶员违规总次数：{{ scope.row.total }}次</span>
          </template>
        </el-table-column>
        <el-table-column
          label=""
          min-width="120"
        >
          <template>
            <div class="warning">
              <span class="warning-icon el-icon-warning" />
              <span class="show-detail">高风险企业</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="50"
        >
          <template slot-scope="scope">
            <span class="show-detail" @click="showDetails(scope.row.unitId)">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { colors } from '@/options'
import AreaSelect from '@/components/AreaSelect'
import GaodeMap from './components/AMap'
import { searchCompany } from '@/api/company-manage/company'
import RemoteSearch from '@/components/RemoteSearch/select'

import request from '@/utils/request'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: { AreaSelect, GaodeMap, RemoteSearch },
  data() {
    return {
      searchH: '50px',
      showSearchMoreBtn: true,
      showMap: false,
      search: {
        unitPlace: [],
        company: '',
        companyType: 0,
        code: ['1', '2', '3', '4']
      },
      currTip: {
        id: '555',
        info: ''
      },
      listQuery: {
        colorId: '',
        keyWord: '',
        area: '',
        categoryId: '',
        status: 1
      },
      colors: colors,
      score: '',
      area: [],
      companyList: [],
      showCompanys: true,
      mapInfos: [],
      dangerCom: [],
      resizeEnable: true, // 是否监控地图容器尺寸变化
      zoom: 18, // 设置初始化级别
      markers: [],
      center: [103.99996, 30.497646],
      // mapStyle: 'amap://styles/f89be70c784f33f75afec870d99b603d',
      mapStyle: 'amap://styles/darkblue',
      currentWindow: {
        position: [103, 30],
        visible: false,
        offset: [100, 0]
      },
      currInfo: {},
      pointEvents: {
        click: e => {
          // this.$nextTick(() => {
          this.currInfo = e.target.w.extData
          // console.log(this.currInfo)
          this.currentWindow = {
            // position: [103.99996, 30.497646],
            position: [e.lnglat.lng, e.lnglat.lat],
            visible: true,
            // content: this.$refs['infoWindow'].$el,
            offset: [100, 0]
          }
          // })
        }
      },
      infoWinEvents: {
        close: e => {
          this.currentWindow.visible = false
        },
        init: e => {
          console.log(e)
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      role: 'role',
      areaSelect: 'area'
    })
  },
  created() {
    this.getCompanyType()
    this.getArea()
    this.getTopCompany()
    this.getCompanyCode()
  },
  // mounted() {
  //   this.setMap()
  // },
  methods: {
    getCompanyType() {
      request({
        url: `/unitType`,
        method: 'post'
      }).then(res => {
        this.companyList = res.data.map(item => ({ label: item.value, value: item.typeId }))
      })
    },
    searchCompany(query) {
      return searchCompany(query)
    },
    getArea() {
      this.area = this.role === 'admin' ? '' : this.areaSelect// 管理员设置为空 代表中国区域
    },
    getTopCompany() {
      request({
        url: '/unit/top10',
        method: 'post'
      }).then(res => {
        this.dangerCom = res.data.list
      })
    },
    setCode(newCode) {
      const codes = this.search.code
      if (codes.indexOf(newCode) !== -1) {
        codes.splice(codes.indexOf(newCode), 1)
      } else {
        codes.push(newCode)
      }
      this.search.code = codes
      this.getCompanyCode()
    },
    showDetails(id) {
      // 跳转页面
      this.$router.push({
        // path: '/safe-code/apply',
        path: `company-manage/detail/company/${id}`
        // params: { id }
      })
    },
    setAreaText(data) {
      this.listQuery.area = data
      this.getCompanyCode()
    },
    // 企业安全码查询
    getCompanyCode(searchCompany) {
      let search = {}
      if (searchCompany) {
        search.status = 1
        search.keyWord = this.listQuery.keyWord
      } else {
        let colorId = ''
        for (let i = 0, len = this.search.code.length; i < len; i++) {
          colorId += this.search.code[i]
        }
        this.listQuery.colorId = colorId
        search = { ...this.listQuery }
        search.keyWord = ''
      }
      request({
        url: '/unitSafeCode/selectList',
        method: 'POST',
        data: this.listQuery
      }).then(res => {
        this.mapInfos = res.data
        // this.setMap(res.data)
        if (res.data.length === 0) {
          this.$message({
            message: '暂无数据',
            type: 'warning'
          })
        }
      }).catch(err => {
        throw err
      })
    },
    selectCompany(item) {
      this.listQuery = {
        colorId: '',
        area: '',
        categoryId: '',
        status: 1
      }
      this.listQuery.keyWord = item.value
      this.getCompanyCode(true)
    },
    clearKeyword() {
      this.listQuery.keyWord = ''
      this.getCompanyCode()
    },
    showMoreSearch() {
      this.searchH = 'auto'
      this.showSearchMoreBtn = false
    },
    showLessSearch() {
      this.searchH = '50px'
      this.showSearchMoreBtn = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";
.dashboard {
  &-container {
    height: 100%;
    position: relative;
    .search-list {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 222;
      background-color: #fff;
      overflow: hidden;
      display: flex;
      height: 50px;
      ul {
        padding: 0;
        margin: 10px 0 0 0;
        text-align: center;
        li {
          font-size: 12px;
          list-style: none;
          display: inline-block;
          margin: 0 10px;
          &:hover {
            cursor: pointer;
            opacity: 85%;
          }
        }
      }
      //.map-type {
      //  float: left;
      //}
      .code-type {
        display: inline-block;
        // padding-bottom: 10px;
        margin: 0;
        // width: 100%;
        li {
          border: 1px solid #011B39;
          border-radius: 5px;
          width: 58px;
          height: 29px;
          line-height: 29px;
          &.red {
            background-color: $red;
          }
          &.yellow{
            background-color: $yellow;
          }
          &.blue {
            background-color: $blue;
          }
          &.green {
            background-color: $green;
          }
        }
      }
      .keyword {
        .clear-keyword {
          position: absolute;
          top: 11px;
          right: 10px;
          border-radius: 50%;
          padding: 3px;
          background-color: rgba(0,0,0,.1);
          cursor: pointer;
        }
      }
      .search {
        flex: 1;
        margin: 3px 5px 0 5px;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        padding-right: 40px;
        .el-form-item {
          display: inline-block;
        }
        .keyword {
          flex: 1;
          min-width: 250px;
          max-width: 550px;
        }
        //.search-company-group {
        //  display: inline-block;
        //  background-color: #fff;
        //  border: 1px solid #DCDFE6;
        //  border-radius: 4px;
        //  margin-top: 5px;
        //  .el-input {
        //    display: inline-block;
        //    //width: 270px;
        //    height: 31px;
        //  }
        //  i {
        //    line-height: 31px;
        //    font-size: 14px;
        //    &:hover {
        //      cursor: pointer;
        //    }
        //  }
        //}
        .more, .less {
          position: absolute;
          right: 5px;
          font-weight: bold;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
          width: 30px;
          height: 30px;
          line-height: 30px;
          cursor: pointer;
          text-align: center;
        }
      }
    }
    .tip {
      display: inline-block;
      color: #F21313;
      //background-color: rgba(183, 180, 180, .22);
      line-height: 29px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      vertical-align: -7px;
      font-weight: bolder;
      span:first-child {
        margin: 0 5px 0 20px;
      }
      .lighter {
        font-weight: normal;
      }
    }
    .companys-con {
      background-color: #FEFFFF;
      position: absolute;
      bottom: 3px;
      left: 24px;
      right: 6px;
      border-radius: 5px 5px 0 0;
      padding: 0 0 14px 14px;
      .companys-title {
        padding: 8px 14px 8px 0;
        i {
          float: right;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .el-table {
        margin-top: 5px;
        .dangerCom-code {
          width: 30px;
          height: 30px;
          margin-top: 6px;
        }
        .show-detail {
          cursor: pointer;
        }
        .warning {
          background-color: #F21313;
          border-radius: 5px;
          width: 110px;
          line-height: 30px;
          text-align: center;
          color: #101010;
          .warning-icon {
            color: #5B5858;
            margin-right: 9px;
          }
        }
      }
    }
    .padding-b-0 {
      padding-bottom: 0;
    }
    .gaode-map {
      width: 100%;
      //height: calc(100vh - 134px);
      height: calc(100vh - 84px);
    }

  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

@media screen and (max-width: 1230px) {
  .hidden-keyword {
    display: none;
  }
  .code-type {
    width: 312px;
  }
}
@media (max-width: 1305px) {
  .more, .less {
    display: block;
  }
}
@media (min-width: 1305px) {
  .more, .less {
    display: none;
  }
}
</style>
<style lang="scss">
@import "../../../styles/variables";
.el-vue-amap-container {
  height: calc(100vh - 50px - 50px)!important;
//  height: 0;
//  //margin: -30px -30px -30px -30px;
}
.dashboard-container {
  .el-input__inner {
    height: 33px;
  }
  .el-input__icon {
    line-height: 33px;
  }
  // .el-select {
    //&:first-child {
    //  width: 80px;
    //  margin-right: 14px;
    //  margin-left: 18px;
    //}
    //&:nth-child(2) {
    //  width: 140px;
    //  margin-right: 14px;
    //}
  // }
  //.search-company-group {
  //  .el-input__inner {
  //    border: none !important;
  //    height: 31px;
  //  }
  //}

  //.amap-info-contentContainer.bottom-center {
  //  border-radius: 5px;
  //  overflow: hidden;
  //  padding-bottom: 0;
  //
  //  .point-info {
  //    font-size: 13px;
  //    p {
  //      margin: 3px 0;
  //    }
  //
  //    .type {
  //      display: inline-block;
  //      color: #8b0000;
  //      transform: rotate(-30deg);
  //      height: 30px;
  //      width: 120px;
  //      font-size: 25px;
  //      vertical-align: 40px;
  //      text-shadow: #999 1px 0 10px;
  //    }
  //    .red {
  //      color: $red;
  //    }
  //    .yellow {
  //      color: $yellow;
  //    }
  //    .blue {
  //      color: $blue;
  //    }
  //    .green {
  //      color: $green;
  //    }
  //
  //    .code-con {
  //      color: red;
  //      display: inline-block;
  //      text-align: center;
  //    }
  //
  //    .info-code {
  //      width: 80px;
  //      height: 80px;
  //      color: red;
  //    }
  //    .more {
  //      color: #0A93F2;
  //      font-size: 14px;
  //      text-align: right;
  //      padding-top: 10px;
  //      span {
  //        cursor: pointer;
  //        padding: 10px 0 10px 10px;
  //      }
  //    }
  //  }
  //
  //  .amap-info-close {
  //    background-color: #5a5e66;
  //    color: #fff;
  //    border-radius: 50%;
  //    right: 5px !important;
  //    text-align: center;
  //    height: 15px;
  //    width: 15px;
  //  }
  //}
  //
  //.amap-logo, .amap-copyright {
  //  display: none !important;
  //}
  .companys-con {
    .has-gutter {
      display: none;
    }
    .el-table__row {
      background-color: #E7ECF5;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #FEFFFF;
    }
    .el-table td {
      border: none;
      //padding: 8px 0;
      padding: 0;
      height: 41px;
    }
  }

  .el-select {
    width: 100%;
  }
}
</style>
