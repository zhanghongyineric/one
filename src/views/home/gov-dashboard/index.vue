
<!--
  - FileName: 政府-企业安全风险看板
  - @author: ChenHaiPing
  - @date: 2021/4/14 下午2:23
  -->

<template>
  <div class="company-safe">
    <div class="top">
      <el-form class="search" label-width="80px">
        <el-form-item label="归属地:" class="unit-place">
          <AreaSelect v-model="search.unitPlace" size="small" limit-area :full-area-text.sync="area" @change="getFull" />
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <div class="left">
        <el-card class="left-top">
          <div slot="header" class="title">
            <p>所有企业历史安全码占比</p>
            <el-radio-group v-model="radio1" size="mini" @change="flagThings">
              <button style="margin-left: 390px">
                <el-radio-button :label="1">
                  本月
                </el-radio-button>
              </button>
              <button style="margin-left: 50px">
                <el-radio-button :label="2">
                  本季度
                </el-radio-button>
              </button>
              <button style="margin-left: 50px">
                <el-radio-button :label="3">
                  本年
                </el-radio-button>
              </button>
            </el-radio-group>
          </div>
          <div class="chart">
            <PieChart width="700px" height="360px" :chart-data="pieChart" />
          </div>
        </el-card>
        <div class="left-bottom">
          <el-card class="car-company">
            <div class="title">
              <span>本周期客运企业安全码占比</span>
            </div>
            <div class="chart">
              <PieChart width="560px" height="270px" :chart-data="pieChart1" />
            </div>
          </el-card>
          <el-card class="danger-company">
            <div class="title">
              <span>本周期危货企业安全码占比</span>
            </div>
            <div class="chart">
              <PieChart width="560px" height="270px" :chart-data="pieChart2" />
            </div>
          </el-card>
        </div>
      </div>
      <div class="right">
        <el-card class="right-top">
          <div slot="header" class="title">
            本周企业安全码变化
          </div>
          <el-table
            ref="driverTable"
            :data="tableData"
            :show-header="false"
            highlight-current-row
          >
            <el-table-column
              v-slot="slotProps"
              prop="code"
              label="个数"
            >
              当前{{ slotProps.row.codeId | codeFilter }}
              <el-link
                type="primary"
                :disabled="!slotProps.row.code"
                style="margin:0 5px -1px 5px;"
                @click="showCode(slotProps.row.code)"
              >
                {{ slotProps.row.code }}
              </el-link>
              个
            </el-table-column>
            <el-table-column
              v-slot="{row}"
              prop="count"
              label="增减"
              style="padding-right: 5px"
            >
              <span>{{ Math.abs(row.count) }}</span>
              <i v-if="row.count>0" class="el-icon-top" style="color: red" />
              <i v-else-if="row.count<0" class="el-icon-bottom" style="color: green" />
              <i v-else class="el-icon-minus" style="color: black" />
            </el-table-column>
            <el-table-column
              v-slot="{row}"
              prop="radio"
              label="比例"
            >
              {{ row.radio | radioFilter }}
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="right-center">
          <div slot="header" class="title">
            连续两周以上红码企业
          </div>
          <ul
            v-infinite-scroll="loadMoreRed"
            :infinite-scroll-immediate="false"
            :infinite-scroll-disabled="!hasMore"
            class="infinite-list"
            style="overflow:auto"
          >
            <li v-for="(item,index) in redCompany" :key="index" class="infinite-list-item f">
              <el-tooltip effect="dark" :content="item.unitName" placement="right" style="width:350px;">
                <span class="driver">{{ item.unitName }}</span>
              </el-tooltip>
              连续
              <span class="safe-code">{{ item.count }}</span>
              周红码
            </li>
            <p v-if="!hasMore && redCompany.length>0" class="tip" style="text-align:center;margin-top: 10px;">没有更多了</p>
            <p v-if="redCompany.length === 0" class="tip" style="text-align:center;">暂无数据</p>
          </ul>
        </el-card>
        <el-card class="right-bottom">
          <div slot="header" class="title">
            连续两周以上绿码企业
          </div>
          <ul
            v-infinite-scroll="loadMoresGreen"
            :infinite-scroll-immediate="false"
            :infinite-scroll-disabled="!hasMores"
            class="infinite-list"
            style="overflow:auto"
          >
            <li v-for="(item,index) in greenCompany" :key="index" class="infinite-list-item f">
              <el-tooltip effect="dark" :content="item.unitName" placement="right" style="width:350px;">
                <span class="driver">{{ item.unitName }}</span>
              </el-tooltip>
              连续
              <span class="safe-code">{{ item.count }}</span>
              周绿码
            </li>
            <p v-if="!hasMores && greenCompany.length>0" class="tip" style="text-align:center;margin-top: 10px;">没有更多了</p>
            <p v-if="greenCompany.length === 0" class="tip" style="text-align:center;">暂无数据</p>
          </ul>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import AreaSelect from '@/components/AreaSelect'
import PieChart from '../../company-manage/components/company-safe/PieChart'
import { fetchCodeChange, fetchSafeRatio, fetchRedCompany, fetchGreenCompany } from '@/api/company-manage/company-safe'
import { colorOption } from '@/options'

export default {
  name: 'CompanySafe',
  components: {
    AreaSelect,
    PieChart
  },
  filters: {
    codeFilter: function(level) {
      return colorOption.map[level]
    },
    radioFilter: function(radio) {
      return `环比上周${radio > 0 ? '上升' : (radio < 0 ? '下降' : '持平')}${radio === 0 ? '' : Math.abs(radio) + '%'}`
    }
  },
  data() {
    return {
      loading: true,
      search: {
        unitPlace: []
      },
      area: '',
      radio1: 1,
      pieChart: [],
      pieChart1: [],
      pieChart2: [],
      companyInfo: {},
      tableData: [],
      redCompany: [],
      greenCompany: [],
      hasMore: true,
      hasMores: true,
      weekTransformParams: {
        pageSize: 10,
        pageNum: 0
      },
      greenTransformParams: {
        pageSize: 10,
        pageNum: 0
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.pieChart1 = [
        {
          value: 13,
          name: '蓝码'
        }, {
          value: 21,
          name: '绿码'
        }, {
          value: 16,
          name: '黄码'
        }, {
          value: 15,
          name: '红码'
        }]
      this.pieChart2 = [
        {
          value: 13,
          name: '蓝码'
        }, {
          value: 21,
          name: '绿码'
        }, {
          value: 16,
          name: '黄码'
        }, {
          value: 15,
          name: '红码'
        }]
    }, 0)
    this.getData()
    this.flagThings(1)
    this.loadMoreRed()
    this.loadMoresGreen()
  },
  methods: {
    // 所有企业饼图数据获取
    flagThings(flag) {
      const params = {
        area: this.area || '四川省',
        flag
      }
      fetchSafeRatio(params).then(res => {
        // this.pieChart = res.data || []
        const a1 = (res.data || {})
        this.pieChart = Object.keys(a1).map(key => ({
          value: a1[key],
          name: key
        }))
      })
    },
    // 客运企业饼图数据获取
    // carCompany() {
    //   const params = {
    //     area: this.area || '四川省'
    //   }
    //   fetchCarCompany(params).then(res => {
    //     console.log(res.data)
    //     const a1 = (res.data || {})
    //     this.pieChart = Object.keys(a1).map(key => ({
    //       value: a1[key],
    //       name: key
    //     }))
    //   })
    // },
    // 危货企业饼图数据获取
    // dangerCompany() {
    //   const params = {
    //     area: this.area || '四川省'
    //   }
    //   fetchDangerCompany(params).then(res => {
    //     console.log(res.data)
    //     const a1 = (res.data || {})
    //     this.pieChart = Object.keys(a1).map(key => ({
    //       value: a1[key],
    //       name: key
    //     }))
    //   })
    // },
    // 格式化表格数据
    formatTableData(codeChangeData) {
      this.tableData = [
        {
          codeId: '1',
          code: codeChangeData.greenCount,
          count: codeChangeData.greenRateCount,
          radio: codeChangeData.greenRate
        },
        {
          codeId: '2',
          code: codeChangeData.blueCount,
          count: codeChangeData.blueRateCount,
          radio: codeChangeData.blueRate
        },
        {
          codeId: '3',
          code: codeChangeData.yellowCount,
          count: codeChangeData.yellowRateCount,
          radio: codeChangeData.yellowRate
        },
        {
          codeId: '4',
          code: codeChangeData.redCount,
          count: codeChangeData.redRateCount,
          radio: codeChangeData.redRate
        }
      ]
    },
    showCode(codeId) {
      this.$router.push({
        name: 'CompanyCategory',
        query: {
          area: '',
          codeId
          // type 本周，两周以上
        }
      })
    },
    // 获取并设置图标数据
    getData() {
      const params = {
        area: this.area || '四川省'
      }
      Promise.all([
        fetchCodeChange(params)
      ]).then((res) => {
        this.loading = false
        // 格式化表格数据
        this.formatTableData(res[0].data || {})
      }).catch(e => {
        this.loading = false
        console.log(e)
      })
    },
    // 加载更多红码
    loadMoreRed() {
      if (this.hasMore) {
        this.weekTransformParams.pageNum++
        this.setRedCompany(true)
      }
    },
    // 2周以上红码企业
    setRedCompany(concatData) {
      const params = {
        area: this.area || '四川省'
      }
      fetchRedCompany({ ...params, ...this.weekTransformParams }).then(res => {
        console.log(res.data)
        this.hasMore = this.weekTransformParams.pageNum < res.data.totalPage
        if (concatData) {
          this.redCompany = this.redCompany.concat(res.data.list)
        } else {
          this.redCompany = res.data.list
        }
      })
    },
    // 加载更多绿码
    loadMoresGreen() {
      if (this.hasMores) {
        this.greenTransformParams.pageNum++
        this.setGreenCompany(true)
      }
    },
    // 2周以上绿码企业
    setGreenCompany(concatData) {
      const params = {
        area: this.area || '四川省'
      }
      fetchGreenCompany({ ...params, ...this.greenTransformParams }).then(res => {
        console.log(res.data)
        this.hasMores = this.greenTransformParams.pageNum < res.data.totalPage
        if (concatData) {
          this.greenCompany = this.greenCompany.concat(res.data.list)
        } else {
          this.greenCompany = res.data.list
        }
      })
    },
    getFull({ fullAreaText }) {
      this.area = fullAreaText
      this.radio1 = 1
      this.flagThings(1)
      this.getData()
      this.loadMoreRed()
      this.loadMoresGreen()
    }
  }
}
</script>

<style lang="scss" scoped>
  .company-safe{
    .top{
      height: 37px;
      margin-bottom: 5px;
      margin-top: 10px;
    }
    .container{
      display: flex;
      .left {
        .left-top {
          //margin-top: 20px;
          width: 963px;
          height: 437px;
          padding: 10px 10px 0 10px;
          border: solid 1px lightgrey;
          border-radius: 10px;
          margin-left: 40px;
          margin-bottom: 10px;

          .title {
            height: 35px;
            border-bottom: solid;
            border-width: 1px;
            border-color: lightgrey;
            padding-left: 10px;
            display: flex;
            align-items: center;

          }
          .chart{
            margin-left: 78px;
            margin-top: -30px;
          }
        }
        .left-bottom {
          //width: 900px;
          height: 350px;
          display: flex;
          //padding-top: 10px;
          margin-left: 40px;
          .car-company {
            border: solid 1px lightgrey;
            border-radius: 10px;
            .title {
              width: 448px;
              height: 35px;
              border-bottom: solid;
              border-width: 1px;
              border-color: lightgrey;
              padding-left: 10px;
              display: flex;
              align-items: center;
              margin-top: 10px;
            }
            .chart{
              margin-top: 16px;
            }
          }

          .danger-company {
            border: solid 1px lightgrey;
            border-radius: 10px;
            margin-left: -119px;
            width: 481px;
            border-left: solid 1px lightgrey;
            .title {
              width: 442px;
              height: 35px;
              border-bottom: solid;
              border-width: 1px;
              border-color: lightgrey;
              padding-left: 10px;
              display: flex;
              align-items: center;
              margin-top: 10px;
            }
            .chart{
              margin-top: 16px;
            }
          }
        }
      }
      .right{
        width: 600px;
        margin-left: 30px;
        .right-top{
          padding: 10px 10px 0 10px;
          height: 255px;
          border: solid 1px lightgrey;
          border-radius: 10px;
          .title{
            padding-left: 10px;
            height: 35px;
            border-bottom: solid;
            border-width: 1px;
            border-color: lightgrey;
            display: flex;
            align-items: center;
          }
        }
        .right-center{
          width: 600px;
          height: 261px;
          border: solid 1px lightgrey;
          border-radius: 10px;
          padding: 10px 10px 0 10px;
          margin-top: 10px;
          .title{
            height: 35px;
            border-bottom: solid;
            border-width: 1px;
            border-color: lightgrey;
            display: flex;
            align-items: center;
            padding-left: 10px;
          }
          ul{
            width: 550px;
            height: 150px;
            margin-left: -20px;
            li{
              margin-top: 5px;
              padding-top: 5px;
              padding-left:10px ;
              height: 25px;
              border-bottom: solid 1px #dddddd;
              display: flex;
              span{
                margin-right: 5px;
                margin-left: 5px;
              }
            }
          }
        }
        .right-bottom{
          width: 600px;
          height: 261px;
          border: solid 1px lightgrey;
          border-radius: 10px;
          padding: 10px 10px 0 10px;
          margin-top: 10px;
          .title{
            height: 35px;
            border-bottom: solid;
            border-width: 1px;
            border-color: lightgrey;
            display: flex;
            align-items: center;
            padding-left: 10px;
          }
          ul{
            width: 550px;
            height: 150px;
            margin-left: -20px;
            li{
              margin-top: 5px;
              padding-top: 5px;
              padding-left:10px ;
              height: 25px;
              border-bottom: solid 1px #dddddd;
              display: flex;
              span{
                margin-right: 5px;
                margin-left: 5px;
              }
            }
          }
        }

      }
    }
  }
</style>
<style lang="scss" scoped>
::v-deep {
  .el-card__header{
    border-bottom: none;
  }
  .right .el-card__body{
    padding-top: 0;
  }
  .right .el-card__header{
    padding-bottom: 0;
  }
  .el-radio-button:first-child .el-radio-button__inner{
    border-radius: 0;
  }
  .el-radio-butto:focus, .el-radio-butto:hover{
    color: #ffffff;
    border-color: #409EFF;
    background-color: #409EFF;
  }
  .el-radio-button__inner{
    border-left:solid 1px #DCDFE6;
  }
  .el-radio-button:last-child .el-radio-button__inner{
    border-radius: 0;
  }
  .el-input{
    width:210px;
  }
  .el-table {
    padding: 0 10px 0 30px;
    border: none;
  }
  .el-table th, .el-table tr {
    padding: 0 10px 0 10px;
    border: none;
  }
  .el-radio-group button{
    border:none;
    padding: 0;
  }
  .el-radio-group button:focus{
    padding: 0;
  }
  .el-table_1_column_2 .cell{
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .el-table .cell{
    padding-right: 0;
  }

}

</style>
