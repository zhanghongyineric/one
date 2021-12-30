<template>
  <el-table
    ref="table"
    :data="tableData"
    border
    fit
    highlight-current-row
    height="100%"
    stripe
  >
    <el-table-column type="index" label="序号" width="60" align="center" />
    <el-table-column prop="status" label="ACC状态" width="100" align="center" />
    <el-table-column prop="time" label="上报时间" width="160" align="center" />
    <el-table-column
      v-slot="{row}"
      prop="speed"
      label="速度"
      width="80"
      align="center"
    >
      {{ row.speed + '\xa0km/h' }}
    </el-table-column>
    <el-table-column
      prop="positionDes"
      label="位置描述"
      width="220"
      align="center"
      show-overflow-tooltip
    />
  </el-table>
</template>

<script>
import { pagingPosition } from '@/api/live-monitor/history'

export default {
  name: 'Table',
  props: {
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    },
    vehicleId: {
      type: String,
      default: ''
    },
    clearData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [], // 表格数据
      listQuery: {
        pageNum: 1,
        pageSize: 20
      },
      totalPage: 0 // 数据总页数
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('clear-data', () => {
        Object.assign(this.$data, this.$options.data()) // 重置 data 数据，恢复初始值
      })
    })
    this.tableListener()
  },
  methods: {
    // 通过经纬度获取地理位置
    getLocation(list) {
      let geocoder
      AMap.plugin('AMap.Geocoder', function() {
        geocoder = new AMap.Geocoder({ city: '', radius: 1000 })
      })
      const lnglats = []
      for (let i = 0; i < list.length; i++) {
        lnglats.push([list[i].longitude, list[i].latitude])
      }
      geocoder.getAddress(lnglats, (status, result) => {
        if (status === 'complete' && result.regeocodes.length) {
          for (let i = 0; i < result.regeocodes.length; i += 1) {
            list[i].positionDes = result.regeocodes[i].formattedAddress
          }
          list.forEach(item => {
            this.tableData.push({
              status: item.acc === '0' ? 'ACC关闭' : 'ACC开启',
              time: item.reportTime,
              speed: item.speed,
              positionDes: item.positionDes
            })
          })
        }
      })
    },
    // 分页获取表格数据
    getTableData() {
      console.log(this.listQuery.pageNum)
      pagingPosition({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        vehicleId: this.vehicleId,
        startTime: this.startTime,
        endTime: this.endTime
      })
        .then(({ data }) => {
          this.getLocation(data.list)
          this.totalPage = data.totalPage
        })
        .catch(err => {
          throw err
        })
    },
    // 监听表格滚动，实现懒加载
    tableListener() {
      const dom = this.$refs.table.bodyWrapper
      dom.addEventListener('scroll', () => {
        const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight
        if (scrollDistance <= 0) { // 等于 0 证明已经到底，可以请求接口
          if (this.listQuery.pageNum < this.totalPage) {
            this.listQuery.pageNum++
            this.getTableData()
          }
        }
      })
    }
  }
}
</script>
