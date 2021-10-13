<template>
  <el-card class="box-card">
    <div slot="header" class="f jc-sb ai-c">
      <span class="title">区县车辆统计情况</span>
      <div class="buttons">
        <el-button v-show="!editing" type="primary" plain size="mini" icon="el-icon-edit" @click="editing = true">编辑表格</el-button>
        <el-button v-show="editing" type="primary" plain size="mini" icon="el-icon-check" @click="finishEdit">完成编辑
        </el-button>
        <el-button type="primary" plain size="mini" icon="el-icon-download">导出表格</el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%;margin-bottom: 30px;"
      border
    >
      <el-table-column
        prop="title"
        label="地区"
      >
      </el-table-column>
      <el-table-column
        v-for="head in tableHead"
        :prop="head"
        :label="head"
      >
        <template v-slot="{row}">
          <span v-show="!editing">{{ row[head] }}</span>
          <el-input v-show="editing" v-model="row[head]" size="small"/>
        </template>
      </el-table-column>
      <!--<el-table-column
        prop="巴中"
        label="巴中"
      >
        <template v-slot="{row}">
          <span v-show="!editing">{{row['巴中']}}</span>
          <el-input v-show="editing" v-model="row['巴中']" size="small"/>
        </template>
      </el-table-column>-->
    </el-table>
    <Echarts ref="lineChart"/>
  </el-card>
</template>

<script>
import Echarts from '@/components/Echarts'

export default {
  name: 'RegionVehicle',
  components: { Echarts },
  props: {
    data: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editing: false,//编辑中
      tableHead: [],//表头
      tableData: []//表格数据
    }
  },
  watch: {
    data(data) {
      this.setOption(data)
    }
  },
  methods: {
    finishEdit() {
      this.editing = false
      this.renderChartByTableData()
    },
    //把数据格式化为表格和图表需要的数据
    setOption(data) {
      // 格式化表格数据
      this.tableHead = data.map(item => item.name)
      const tableData = [
        { title: '上月上线数' },
        { title: '本月上线数' },
        { title: '上月车辆报警数' },
        { title: '本月车辆报警数' }
      ]
      data.forEach(item => {
        tableData[0][item.name] = item.a
        tableData[1][item.name] = item.b
        tableData[2][item.name] = item.c
        tableData[3][item.name] = item.d
      })
      this.tableData = tableData //tableData[0][item.name] = item.a 修改this.tableData[0]不会触发响应式
      this.renderChartByTableData()
    },
    //通过表格数据渲染图表
    renderChartByTableData() {
      let lastMonthOnline = []//上月上线数
      let thisMonthOnline = []//本月上线数
      let lastMonthAlarms = []//上月车辆报警数
      let thisMonthAlarms = []//本月车辆报警数
      this.tableData.forEach((row, index) => {
        const chartData = Object.values(row).slice(1)
        switch (index) {
          case 0: {
            lastMonthOnline = chartData
            break
          }
          case 1: {
            thisMonthOnline = chartData
            break
          }
          case 2: {
            lastMonthAlarms = chartData
            break
          }
          case 3: {
            thisMonthAlarms = chartData
            break
          }
        }

      })
      this.$refs['lineChart'].setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['上月上线数', '本月上线数', '上月车辆报警数', '本月车辆报警数']
        },
        color: ['#D97559', '#E4C477', '#5087EC', '#68BBC4'],
        grid: {
          // left: '3%',
          // right: '4%',
          // bottom: '3%',
          // containLabel: true
        },
        toolbox: {
          right: 10,
          feature: {
            saveAsImage: {
              title: '下载图表',
              name: '区县车辆统计情况',
              iconStyle: {
                borderColor: '#409EFF'
              }
            }
          }
        },
        xAxis: {
          type: 'category',
          data: this.tableHead
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '上月上线数',
            type: 'bar',
            barWidth: 30,
            data: lastMonthOnline
          },
          {
            name: '本月上线数',
            type: 'bar',
            barWidth: 30,
            data: thisMonthOnline
          },
          {
            name: '上月车辆报警数',
            type: 'line',
            data: lastMonthAlarms
          },
          {
            name: '本月车辆报警数',
            type: 'line',
            data: thisMonthAlarms
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table__row td {
  padding: 5px 0;

  span {
    line-height: 32px;
  }
}
</style>
