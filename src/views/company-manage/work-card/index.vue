<template>
  <div class="work-card layout-content demo-page">
    <el-card class="box-card">
      <!--搜索-->
      <el-form class="table-page-search-wrapper search" label-width="80px" size="small">
        <el-col :md="6" :sm="24">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="search.startTime"
              type="datetime"
              placeholder="选择日期时间"
              @change="getList"
            />
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="24">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="search.endTime"
              type="datetime"
              placeholder="选择日期时间"
              @change="getList"
            />
          </el-form-item>
        </el-col>

        <el-col :md="6" :sm="24">
          <el-form-item label-width="20px">
            <el-checkbox-group v-model="search.state" @change="getList">
              <el-checkbox label="进行中" />
              <el-checkbox label="已结束" />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="24">
          <el-form-item label-width="0px">
            <el-input
              v-model="search.input"
              placeholder="请输入车牌号或驾驶员"
              clearable
              suffix-icon="el-icon-search"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <!--表格-->
      <el-table
        class="main-table"
        :data="dangerCom"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          type="index"
          label="编号"
          width="50"
        />
        <el-table-column
          prop="name"
          label="驾驶员"
          min-width="100"
        >
          <template slot-scope="scope">
            <span
              v-for="item in scope.row.driverId"
              :key="item"
              class="driver"
            >{{ item }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="doubleDrive"
          label="单双驾"
          min-width="70"
        />
        <el-table-column
          prop="vehicleType"
          label="车辆类型"
          min-width="120"
        />
        <el-table-column
          prop="vehicleColor"
          label="车辆颜色"
          min-width="80"
        />
        <el-table-column
          prop="vehicleNo"
          label="车牌号"
          min-width="120"
        />
        <el-table-column
          prop="drivingTime"
          label="驾驶时长"
          min-width="120"
        />
        <el-table-column
          prop="startPlace"
          label="作业地点起止"
          min-width="280"
        >
          <template slot-scope="scope">
            <div>起：{{ scope.row.startPlace }}</div>
            <div v-if="scope.row.endPlace">止：{{ scope.row.endPlace }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="unitId"
          label="所属企业"
          width="180"
        />
        <el-table-column
          prop="startTime"
          label="打卡起止时间"
          min-width="180"
        >
          <template slot-scope="scope">
            <div>起：{{ scope.row.startTime }}</div>
            <div v-if="scope.row.endTime">止：{{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="作业状态"
          prop="state"
          min-width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1" class="green">进行中</span>
            <span v-if="scope.row.state === 2">已结束</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="80"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              class="show-detail"
              size="small"
              @click="showDetails(scope.row.workId)"
            >详情</el-button>
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

      <el-dialog
        class="dialog"
        title=""
        :visible.sync="dialogVisible"
        width="680px"
      >
        <p><b>驾驶员：</b>张三  李四{{ dialogInfo.driverId }}</p>
        <p><b>单双驾：</b>双驾{{ dialogInfo.doubleDrive }}</p>
        <p><b>车辆类型：</b>旅客运输车辆{{ dialogInfo.vehicleType }}</p>
        <p><b>车辆颜色：</b>白色{{ dialogInfo.vehicleColor }}</p>
        <p><b>车牌号：</b>川Q12345   黄牌{{ dialogInfo.vehicleNo }}</p>
        <p><b>驾驶时长：</b>5小时3分20秒{{ dialogInfo.drivingTime }}</p>
        <p><b>作业地点起：</b>四川省宜宾市高县光明街11号附2号{{ dialogInfo.startPlace }}</p>
        <p><b>作业地点止：</b>四川省宜宾市高县兴盛路28号{{ dialogInfo.endPlace }}</p>
        <p><b>作业时间起：</b>2021-1-29 13:05:15{{ dialogInfo.startTime }}</p>
        <p><b>作业时间止：</b>2021-1-29 18:08:15{{ dialogInfo.endTime }}</p>
        <p class="img-tit"><b>作业图片：</b></p>
        <div class="dialog-imgs">
          <div v-for="img in dialogInfo.workPicUrl" :key="img.url" class="img-con">
            <el-image
              class="dialog-img"
              :src="img.url"
              fit="cover"
            />
            <div>上传时间： {{ img.time }}</div>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'WorkCard',
  components: {
    Pagination
  },
  data() {
    return {
      search: {
        startTime: '',
        endTime: '',
        state: ['进行中', '已结束'],
        input: '',
        workerId: '1'
      },
      dialogVisible: false,
      dangerCom: [{
        unitId: '宜宾某某运输有限公司',
        driverId: ['张三', '李四'],
        drivingTime: '5小时3分20秒',
        startTime: '2021-1-29 13:05:15',
        endTime: '2021-1-29 13:05:15',
        doubleDrive: '双驾',
        vehicleType: '危险品运输车辆',
        vehicleColor: '白色',
        vehicleNo: '川Q12345 黄牌',
        startPlace: '四川省宜宾市高县光明街11号附2号',
        endPlace: '四川省宜宾市高县兴盛路28号',
        state: 1
      }, {
        unitId: '宜宾某某运输有限公司',
        driverId: ['张三', '李四'],
        drivingTime: '5小时3分20秒',
        startTime: '2021-1-29 13:05:15',
        endTime: '',
        doubleDrive: '双驾',
        vehicleType: '危险品运输车辆',
        vehicleColor: '白色',
        vehicleNo: '川Q12345 黄牌',
        startPlace: '四川省宜宾市高县光明街11号附2号',
        endPlace: '',
        state: 1
      }],
      dialogInfo: {
        workPicUrl: [
          {
            url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            time: '2021-1-29 13:05:15'
          }, {
            url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            time: '2021-1-29 13:05:15'
          }, {
            url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            time: '2021-1-29 13:05:15'
          }, {
            url: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            time: '2021-1-29 13:05:15'
          }
        ]
      },
      total: 1,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    getList() {
      // console.log(this.search)
      // request({
      //   url: '/safeCode/pc/work/selectList',
      //   method: 'post',
      //   data: this.search
      // }).then(res => {
      //   console.log(res)
      //   this.dangerCom = res.data.list
      //   this.total = res.data.total
      // })
    },
    showDetails(workId) {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.work-card {
  .main-table {
    .driver {
      padding: 0 5px;
    }

    .show-detail {
      cursor: pointer;
      display: block;
    }
    .green {
      color: #0ABB05;
    }
  }
  .dialog {
    p {
      margin: 8px 0;
    }
    .img-tit {
      margin-top: 20px;
    }
    .dialog-imgs {
      .img-con {
        text-align: center;
        display: inline-block;
        .dialog-img {
          width: 180px;
          height: 150px;
          margin: 10px 13px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.work-card {
  .dialog {
    .el-dialog__header {
      padding: 0;
      height: 10px;
    }

    .el-dialog__body {
      max-height: 500px;
      overflow: auto;
      padding-top: 10px;
    }
  }
  //.main-table {
  //  color: #151515;
  //
  //  td, th {
  //    border-right: 1px solid #bbb;
  //  }
  //
  //  .main-table-header {
  //    text-align: center;
  //    background-color: #B0B3B3;
  //    color: #101010;
  //  }
  //
  //  .el-table__body tr.el-table__row--striped td {
  //    background-color: rgba(183, 180, 180, .26);
  //  }
  //}
}
</style>
