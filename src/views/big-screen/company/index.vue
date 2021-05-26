<!--
  - FileName: 企业账号大屏
  - @author: ChenHaiPing
  - @date: 2021/4/12 下午5:35
  -->

<template>

  <div class="city">
    <el-image :src="img1" class="img1" />
    <!--     头部样式-->
    <div class="top">
      <!--       时间-->
      <div class="date">
        <span>{{ this.date }}</span>
        <span>{{ this.time }}</span>
      </div>
      <!--       标题-->
      <div class="title">
        <span>{{ title }}</span>
        <p class="p1" />
        <p class="p2" />
        <p class="l1" />
        <p class="l2" />
        <p class="l3" />
        <p class="r1" />
        <p class="r2" />
        <p class="r3" />
      </div>
      <!--       温度-->
      <div class="temperature">
        <div style="height: 34px;overflow:hidden;" class="f-c">
          <div id="he-plugin-simple" />
        </div>
      </div>
    </div>
    <!--     内容-->
    <div class="container">
      <!--       左-->
      <div class="left">
        <!--         企业安全码模块-->
        <div class="companySafeCode">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            企业安全码
            <i class="el-icon-d-arrow-left" />
          </div>
          <div class="box">
            <div>
              <span style="color:rgba(255, 37, 37, 0.89);">历史红码：{{ preRed }}家</span>
              <span style="color:rgba(252, 202, 0, 1);">历史黄码：{{ preYellow }}家</span>
            </div>
            <div>
              <span style="color:rgba(50, 145, 248, 1);">历史蓝码：{{ preBlue }}家</span>
              <span style="color:rgba(82, 204, 111, 1);">历史绿码：{{ preGreen }}家</span>
            </div>
            <p class="p1" />
            <p class="p2" />
            <p class="p3" />
            <p class="p4" />
            <p class="p5" />
            <p class="p6" />
            <p class="p7" />
            <p class="p8" />
          </div>
          <div class="title2">
            当前周期：红码
          </div>
          <p class="p1" />
          <p class="p2" />
          <p class="p3" />
          <p class="p4" />
          <p class="a1" />
          <p class="a2" />
          <p class="a3" />
          <p class="a4" />
        </div>
        <!--         车辆统计、驾驶员统计模块-->
        <div class="total">
          <div class="total-left">
            <div class="title1">
              <i class="el-icon-d-arrow-right" />
              车辆统计
              <i class="el-icon-d-arrow-left" />
            </div>
            <div class="carCount">
              <p>共计</p> <span>{{ carCount }}</span> <p>辆</p>
              <p class="p1" />
              <p class="p2" />
              <p class="p3" />
              <p class="p4" />
            </div>
            <div class="carLine">
              <p>当前在线：</p>
              <p style="margin-top: -13px">{{ carLine }}辆</p>
              <p class="p1" />
              <p class="p2" />
              <p class="p3" />
              <p class="p4" />
              <p class="a1" />
              <p class="a2" />
              <p class="a3" />
              <p class="a4" />
            </div>
          </div>
          <div class="total-right">
            <div class="title2">
              <i class="el-icon-d-arrow-right" />
              驾驶员统计
              <i class="el-icon-d-arrow-left" />
            </div>
            <div class="carCount">
              <p>共计</p> <span>{{ carCountDriver }}</span> <p>人</p>
              <p class="p1" />
              <p class="p2" />
              <p class="p3" />
              <p class="p4" />
            </div>
            <div class="carLine">
              <p>当前在线：</p>
              <p style="margin-top: -13px">{{ carLineDriver }}人</p>
              <p class="p1" />
              <p class="p2" />
              <p class="p3" />
              <p class="p4" />
              <p class="a1" />
              <p class="a2" />
              <p class="a3" />
              <p class="a4" />
            </div>
          </div>
          <p class="p1" />
          <p class="p2" />
          <p class="p3" />
          <p class="p4" />
          <p class="a1" />
          <p class="a2" />
          <p class="a3" />
          <p class="a4" />
        </div>
        <!--         各种安全码数量统计模块-->
        <div class="driver">
          <div class="driver-top">
            <div class="driver-red">
              <div class="title1">
                <i class="el-icon-d-arrow-right" />
                驾驶员红码
                <i class="el-icon-d-arrow-left" />
              </div>
              <div class="carCount">
                <p>红码</p> <span>{{ driverRed }}</span> <p>个</p>
                <p class="p1" />
                <p class="p2" />
                <p class="p3" />
                <p class="p4" />
              </div>
            </div>
            <div class="driver-yellow">
              <div class="title2">
                <i class="el-icon-d-arrow-right" />
                驾驶员黄码
                <i class="el-icon-d-arrow-left" />
              </div>
              <div class="carCount">
                <p>黄码</p> <span>{{ driverYellow }}</span> <p>个</p>
                <p class="p1" />
                <p class="p2" />
                <p class="p3" />
                <p class="p4" />
              </div>
            </div>
          </div>
          <div class="driver-bottom">
            <div class="driver-blue">
              <div class="title1">
                <i class="el-icon-d-arrow-right" />
                驾驶员蓝码
                <i class="el-icon-d-arrow-left" />
              </div>
              <div class="carCount">
                <p>蓝码</p> <span>{{ driverBlue }}</span> <p>个</p>
                <p class="p1" />
                <p class="p2" />
                <p class="p3" />
                <p class="p4" />
              </div>
            </div>
            <div class="driver-green">
              <div class="title2">
                <i class="el-icon-d-arrow-right" />
                驾驶员绿码
                <i class="el-icon-d-arrow-left" />
              </div>
              <div class="carCount">
                <p>绿码</p> <span>{{ driverGreen }}</span> <p>个</p>
                <p class="p1" />
                <p class="p2" />
                <p class="p3" />
                <p class="p4" />
              </div>
            </div>
          </div>
          <p class="p1" />
          <p class="p2" />
          <p class="p3" />
          <p class="p4" />
          <p class="a1" />
          <p class="a2" />
          <p class="a3" />
          <p class="a4" />
        </div>
      </div>
      <!--       中-->
      <div class="spread">
        <div class="spreadTop">
          <!--           企业驾驶员违章排名模块-->
          <div class="rank">
            <div class="title">
              <i class="el-icon-d-arrow-right" />
              企业驾驶员违章排名
              <i class="el-icon-d-arrow-left" />
            </div>
            <el-collapse-transition>
              <el-table
                :data="list"
                size="small"
                height="436px"
                border
                fit
                highlight-current-row
                style="width: 100%; color:white;"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  type="index"
                  width="35"
                />
                <el-table-column label="姓名" prop="unitName" width="50" align="center" />
                <el-table-column v-slot="{row}" label="安全码" prop="safeLevelWeightId" width="90" align="center">
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
                <el-table-column v-slot="{row}" label="分值" prop="listEqual" width="50" align="center">
                  {{ row.listEqual }}分
                </el-table-column>
                <el-table-column v-slot="{row}" label="违章率" prop="ratio" width="70" align="center">
                  <span style="color:#eac366;">{{ row.ratio }}%</span>
                </el-table-column>
              </el-table>
            </el-collapse-transition>
          </div>
          <!--           车辆实时分布情况模块-->
          <div class="area">
            <div class="title">
              <i class="el-icon-d-arrow-right" />
              车辆实时分布情况
              <i class="el-icon-d-arrow-left" />
            </div>
            <div class="map" />
          </div>
          <p class="p1" />
          <p class="p2" />
          <p class="p3" />
          <p class="p4" />
          <p class="a1" />
          <p class="a2" />
          <p class="a3" />
          <p class="a4" />
        </div>
        <!--         驾驶员违章实时情况模块-->
        <div class="spreadBottom">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            驾驶员违章实时情况
            <i class="el-icon-d-arrow-left" />
          </div>
          <el-table
            :data="carList"
            size="small"
            height="200px"
            border
            fit
            highlight-current-row
            style="width: 100%; color:white;"
            :row-class-name="tableRowClassName"
          >
            <el-table-column v-slot="{row}" prop="carMarkName" width="190" align="left" show-overflow-tooltip>
              车牌号：{{ row.carMarkName }}
            </el-table-column>
            <el-table-column v-slot="{row}" prop="carPeopleName" width="190" align="left" show-overflow-tooltip>
              驾驶员：{{ row.carPeopleName }}
            </el-table-column>
            <el-table-column v-slot="{row}" prop="driveText" align="left" show-overflow-tooltip>
              违章内容：{{ row.driveText }}
            </el-table-column>
          </el-table>
          <p class="p1" />
          <p class="p2" />
          <p class="p3" />
          <p class="p4" />
          <p class="a1" />
          <p class="a2" />
          <p class="a3" />
          <p class="a4" />
        </div>
      </div>
      <!--       右-->
      <div class="right">
        <!--         驾驶员重点违章占比模块-->
        <div class="accident">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            驾驶员重点违章占比
            <i class="el-icon-d-arrow-left" />
          </div>
          <div class="box">
            <div>
              <span style="color:white;">日间超速：{{ daySpeed }}次</span>
              <span style="color:white;">日间疲劳：{{ dayLazy }}次</span>
              <span style="color:white;">时段禁行：{{ timeNo }}次</span>
            </div>
            <div>
              <span style="color:white;">夜间超速：{{ darkSpeed }}次</span>
              <span style="color:white;">夜间疲劳：{{ darkLazy }}次</span>
              <span style="color:white;">离线位移：{{ outLine }}次</span>
            </div>
            <p class="p1" />
            <p class="p2" />
            <p class="p3" />
            <p class="p4" />
            <p class="p5" />
            <p class="p6" />
            <p class="p7" />
            <p class="p8" />
          </div>
          <div class="pieChart">
            <PieChart width="390px" height="280px" :chart-data="pieChart" /></div>
          <p class="p1" />
          <p class="p2" />
          <p class="p3" />
          <p class="p4" />
          <p class="a1" />
          <p class="a2" />
          <p class="a3" />
          <p class="a4" />
        </div>
        <!--         驾驶员安全码占比模块-->
        <div class="labelMark">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            驾驶员安全码占比
            <i class="el-icon-d-arrow-left" />
          </div>
          <div class="pieSecondChart">
            <PieSecond width="390px" height="280px" :chart-data="pieSecond" /></div>
          <p class="p1" />
          <p class="p2" />
          <p class="p3" />
          <p class="p4" />
          <p class="a1" />
          <p class="a2" />
          <p class="a3" />
          <p class="a4" />
        </div>
      </div>
    </div>
    <!--    登录按钮-->
    <div class="login">

      <el-dropdown size="small">
        <span>admin
          <i class="el-icon-switch-button" />
        </span>
        <el-dropdown-menu slot="dropdown" @click.native="logout">
          <el-dropdown-item style="font-size: 15px;font-weight: 600;font-family: '微软雅黑';display: block;">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>

</template>

<script>
import { parseTime } from '@/utils'
import img1 from '@/assets/big-screen_images/1.png'
import PieChart from '../../company-manage/components/city-bigscreen/PieChart'
import PieSecond from '../../company-manage/components/city-bigscreen/PieSecond'
import { colorOption } from '@/options'

export default {
  name: 'City',
  components: {
    PieSecond,
    PieChart
  },
  data() {
    return {
      date: '-',
      time: '-',
      title: '安全码可视化大屏',
      img1: img1,
      preRed: 2,
      preYellow: 20,
      preBlue: 2,
      preGreen: 221,
      carCount: 217,
      carLine: 189,
      carCountDriver: 256,
      carLineDriver: 189,
      driverRed: 82,
      driverYellow: 203,
      driverBlue: 117,
      driverGreen: 17,
      // listLoading: true, // 表格加载状态
      list: [{
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 23,
        ratio: 87
      }, {
        unitName: '李四',
        safeLevelWeightId: '',
        listEqual: 33,
        ratio: 82
      }, {
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 36,
        ratio: 79
      }, {
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 36,
        ratio: 79
      }, {
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 36,
        ratio: 79
      }, {
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 36,
        ratio: 79
      }, {
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 36,
        ratio: 79
      }, {
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 36,
        ratio: 79
      }, {
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 36,
        ratio: 79
      }, {
        unitName: '张三',
        safeLevelWeightId: '',
        listEqual: 36,
        ratio: 79
      }],
      carList: [
        {
          carMarkName: '川Q12345',
          carPeopleName: '张三',
          driveText: '2021/04/10 17:09:45在四川成都市武侯立交匝道超速行驶'
        },
        {
          carMarkName: '川Q12345',
          carPeopleName: '李四思',
          driveText: '2021/04/10 17:09:45在四川成都市武侯立交匝道超速行驶'
        },
        {
          carMarkName: '川Q12345',
          carPeopleName: '张三',
          driveText: '2021/04/10 17:09:45在四川成都市武侯立交匝道超速行驶'
        },
        {
          carMarkName: '川Q12345',
          carPeopleName: '张三',
          driveText: '2021/04/10 17:09:45在四川成都市武侯立交匝道超速行驶'
        },
        {
          carMarkName: '川Q12345',
          carPeopleName: '张三',
          driveText: '2021/04/10 17:09:45在四川成都市武侯立交匝道超速行驶'
        },
        {
          carMarkName: '川Q12345',
          carPeopleName: '张三',
          driveText: '2021/04/10 17:09:45在四川成都市武侯立交匝道超速行驶'
        }
      ],
      optionGroup: {
        codeList: colorOption.list
      },
      pieSecond: [],
      pieChart: [],
      daySpeed: 15,
      dayLazy: 20,
      timeNo: 12,
      darkSpeed: 24,
      darkLazy: 17,
      outLine: 16
    }
  },
  created() {
    this.setTime()
    setInterval((item, index) => {
      this.setTime()
    }, 1000)
  },
  mounted() {
    setTimeout(() => {
      this.pieChart = [{
        value: 15,
        name: '日间超速'
      }, {
        value: 24,
        name: '夜间超速'
      }, {
        value: 20,
        name: '日间疲劳'
      }, {
        value: 17,
        name: '夜间疲劳'
      }, {
        value: 12,
        name: '时段禁行'
      }, {
        value: 16,
        name: '离线位移'
      }]
      this.pieSecond = [{
        value: 20,
        name: '蓝码'
      }, {
        value: 20,
        name: '绿码'
      }, {
        value: 13,
        name: '黄码'
      }, {
        value: 17,
        name: '红码'
      }]
    }, 0)
    window.WIDGET = {
      'CONFIG': {
        'modules': '01234',
        'background': '5',
        'tmpColor': 'white',
        'tmpSize': '20',
        'cityColor': 'white',
        'citySize': '20',
        'aqiColor': 'white',
        'aqiSize': '20',
        'weatherIconSize': '24',
        'alertIconSize': '18',
        'padding': '10px 0 10px 0',
        'shadow': '0',
        'language': 'auto',
        'fixed': 'false',
        'vertical': 'top',
        'horizontal': 'left',
        'key': 'd1f6aa034c234ecca3d998d02d94165b'
      }
    };
    (function(d) {
      const script = d.getElementsByTagName('script')[0]
      const newScript = d.createElement('script')
      newScript.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0'
      script.parentNode.insertBefore(newScript, script)
    })(document) // 温度
  },

  methods: {
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 获取时间
    setTime() {
      this.date = parseTime(new Date(), '{y}年{m}月{d}日')
      this.time = parseTime(new Date(), '{h}:{i}:{s}')
    },
    // 获取颜色
    getCodeColor(id) {
      return this.optionGroup.codeList.find(item => item.value === id).color
    },
    // 设置表格奇数行，偶数行背景色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else if (rowIndex % 2 === 0) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.city{
  position: relative;
  .img1{
    position:fixed;
    z-index: -5;
    width: 100%;
    height: 100%;
  }
  //background-image: url("@/assets/big-screen_images/1.png");
  .top{
    padding:20px 30px 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    .date{
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20px;
      font-family: "Helvetica Neue";
      :nth-child(1){
        margin-bottom: 5px;
      }
    }
    .title{
      font-family: "Microsoft YaHei";
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 10px;
      width: 621px;
      height: 82px;
      box-shadow: rgb(162 161 161) 0px 0px 6px 0px;
      display: flex;
      align-items: center;
      justify-content:center;
      position: relative;
      .p1{
        position: absolute;
        top: -34px;
        width: 400px;
        height: 2px;
        background-color: rgba(2,205,230,1);
      }
      .p2{
        position: absolute;
        bottom:-33px;
        width: 240px;
        height: 2px;
        background-color: rgba(2,205,230,1);
      }
      .l1{
        position: absolute;
        left:-380px;
        top:-20px;
        width: 380px;
        height: 2px;
        background-color: rgba(28,103,166,1);
      }
      .l2{
        position: absolute;
        left:-320px;
        top:10px;
        width: 320px;
        height: 2px;
        background-color: rgba(28,103,166,1);
      }
      .l3{
        position: absolute;
        left:-240px;
        top:40px;
        width: 240px;
        height: 2px;
        background-color: rgba(28,103,166,1);
      }
      .r1{
        position: absolute;
        right:-380px;
        top:-20px;
        width: 380px;
        height: 2px;
        background-color: rgba(28,103,166,1);
      }
      .r2{
        position: absolute;
        right:-320px;
        top:10px;
        width: 320px;
        height: 2px;
        background-color: rgba(28,103,166,1);
      }
      .r3{
        position: absolute;
        right:-240px;
        top:40px;
        width: 240px;
        height: 2px;
        background-color: rgba(28,103,166,1);
      }
    }
  }
  .container{
    display: flex;
    .left{
      padding:20px 0 0 30px;
      .companySafeCode{
        width: 390px;
        height: 310px;
        border-style: solid;
        border-width:1px;
        box-shadow: rgb(36, 128, 180) 0px 0px 5px 0px;
        font-family: '微软雅黑';
        font-weight: 600;
        font-size: 20px;
        color:rgb(35, 125, 191);
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        background: #093068;
        .title{
          width: 388px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 2px;
          background-color: black;
          i{
            font-family: "Arial Black";
            font-size: 17px;
            margin: 0 5px 0 5px;
          }
        }
        .box{
          height: 42px;
          width: 370px;
          border-style: solid;
          border-color: rgb(36, 128, 180);
          border-width: 1px;
          font-size: 14px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          position: relative;
          div{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
          p{
            width: 10px;
            height: 3px;
            background-color: rgb(2, 205, 230);
            position: absolute;
          }
          .p1{
            left: 0;
            top: -16px;
          }
          .p2{
            left: 0;
            top: 25px;
          }
          .p3{
            right: 0;
            top: -16px;
          }
          .p4{
            right: 0;
            top: 25px;
          }
          .p5,.p6,.p7,.p8{
            transform:rotate(90deg);
          }
          .p5{
            left: -5px;
            top: -12px;
          }
          .p6{
            left: -5px;
            top: 21px;
          }
          .p7{
            right: -5px;
            top: -12px;
          }
          .p8{
            right: -5px;
            top: 21px;
          }
        }
        .title2{
          color: white;
          font-size: 19px;
          position: absolute;
          bottom: 5px;
        }
        .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
          position: absolute;
          width: 10px;
          height: 3px;
          background-color: rgb(2, 205, 230);
        }
        .p1{
          left: 0;
          top:-22px;
        }
        .p2{
          left: 0;
          top:287px;
        }
        .p3{
          right: 0;
          top:-22px;
        }
        .p4{
          right: 0;
          top:287px;
        }
        .a1,.a2,.a3,.a4{
          transform:rotate(90deg);
        }
        .a1{
          left: -5px;
          top:-18px;
        }
        .a2{
          left: -5px;
          top:283px;
        }
        .a3{
          right: -5px;
          top:-18px;
        }
        .a4{
          right: -5px;
          top:283px;
        }
      }
      .total{
        margin-top: 10px;
        width: 390px;
        height:237px;
        border-style: solid;
        border-width: 1px;
        box-shadow: rgb(36, 128, 180) 0px 0px 5px 0px;
        display: flex;
        font-family: '微软雅黑';
        font-weight: 600;
        font-size: 20px;
        color:rgb(35, 125, 191);
        position: relative;
        background: #093068;
        i{
          font-family: "Arial Black";
          font-size: 17px;
          margin: 0 5px 0 5px;
        }
        .total-left{
          .title1{
            height: 35px;
            width: 183px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 2px;
            background-color: black;

          }
          .carCount{
            margin-top: 20px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            p{
              font-size: 16px;
              font-weight: 500;
            }
            span{
              width: 98px;
              height: 39px;
              border: solid 1px rgb(28, 103, 166);
              border-left: none;
              border-right: none;
              font-family: FZGongYeHei;
              font-size: 36px;
              color: rgb(255, 255, 32);
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .p1{
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: rgb(28, 103, 166);
              transform:rotate(0deg);
              left:50px;
              top: -10px;
            }
            .p2{
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: rgb(28, 103, 166);
              transform:rotate(0deg);
              left:50px;
              top: 19px;
            }
            .p3{
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: rgb(28, 103, 166);
              transform:rotate(0deg);
              right:34px;
              top: -10px;
            }
            .p4{
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: rgb(28, 103, 166);
              transform:rotate(0deg);
              right:34px;
              top: 19px;
            }
          }
          .carLine{
            position: relative;
            margin-left: 40px;
            margin-top: 20px;
            width: 120px;
            height: 75px;
            border: solid 1px rgb(28, 103, 166);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding:0 0 0 18px;
            p{
              font-size: 18px;
              color:#52CC6f;
              font-weight: 500;
            }
            .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
              width: 3px;
              height: 10px;
              background-color: rgb(2, 205, 230);
              position: absolute;
            }
            .p1{
              transform:rotate(0deg);
              left:-2px;
              top: -20px;
            }
            .p2{
              transform:rotate(0deg);
              left:-2px;
              top: 46px;
            }
            .p3{
              transform:rotate(0deg);
              right:-2px;
              top: -20px;
            }
            .p4{
              transform:rotate(0deg);
              right:-2px;
              top: 46px;
            }
            .a1{
              transform:rotate(90deg);
              left:3px;
              top: -24px;
            }
            .a2{
              transform:rotate(90deg);
              left:3px;
              top: 50px;
            }
            .a3{
              transform:rotate(90deg);
              right:3px;
              top: -24px;
            }
            .a4{
              transform:rotate(90deg);
              right:3px;
              top: 50px;
            }
          }
        }
        .total-right{
          margin-left: 5px;
          .title2 {
            height: 35px;
            width: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 2px;
            background-color: black;
          }
          .carCount{
            margin-top: 20px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            p{
              font-size: 16px;
              font-weight: 500;
            }
            span{
              width: 116px;
              height: 39px;
              border: solid 1px rgb(28, 103, 166);
              border-left: none;
              border-right: none;
              font-family: FZGongYeHei;
              font-size: 36px;
              color: rgb(255, 255, 32);
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .p1{
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: rgb(28, 103, 166);
              transform:rotate(0deg);
              left:50px;
              top: -10px;
            }
            .p2{
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: rgb(28, 103, 166);
              transform:rotate(0deg);
              left:50px;
              top: 19px;
            }
            .p3{
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: rgb(28, 103, 166);
              transform:rotate(0deg);
              right:34px;
              top: -10px;
            }
            .p4{
              position: absolute;
              width: 1px;
              height: 10px;
              background-color: rgb(28, 103, 166);
              transform:rotate(0deg);
              right:34px;
              top: 19px;
            }
          }
          .carLine{
            position: relative;
            margin-left: 48px;
            margin-top: 20px;
            width: 120px;
            height: 75px;
            border: solid 1px rgb(28, 103, 166);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding:0 0 0 18px;
            p{
              font-size: 18px;
              color:#52CC6f;
              font-weight: 500;
            }
            .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
              width: 3px;
              height: 10px;
              background-color: rgb(2, 205, 230);
              position: absolute;
            }
            .p1{
              transform:rotate(0deg);
              left:-2px;
              top: -20px;
            }
            .p2{
              transform:rotate(0deg);
              left:-2px;
              top: 46px;
            }
            .p3{
              transform:rotate(0deg);
              right:-2px;
              top: -20px;
            }
            .p4{
              transform:rotate(0deg);
              right:-2px;
              top: 46px;
            }
            .a1{
              transform:rotate(90deg);
              left:3px;
              top: -24px;
            }
            .a2{
              transform:rotate(90deg);
              left:3px;
              top: 50px;
            }
            .a3{
              transform:rotate(90deg);
              right:3px;
              top: -24px;
            }
            .a4{
              transform:rotate(90deg);
              right:3px;
              top: 50px;
            }
          }
        }
        .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
          position: absolute;
          width: 10px;
          height: 3px;
          background-color: rgb(2, 205, 230);
        }
        .p1{
          left: 0;
          top:-22px;
        }
        .p2{
          left: 0;
          top:214px;
        }
        .p3{
          right: 0;
          top:-22px;
        }
        .p4{
          right: 0;
          top:214px;
        }
        .a1,.a2,.a3,.a4{
          transform:rotate(90deg);
        }
        .a1{
          left: -5px;
          top:-18px;
        }
        .a2{
          left: -5px;
          top:210px;
        }
        .a3{
          right: -5px;
          top:-18px;
        }
        .a4{
          right: -5px;
          top:210px;
        }
      }
      .driver{
        margin-top: 10px;
        width: 390px;
        height: 239px;
        border-style: solid;
        border-width: 1px;
        box-shadow: rgb(36, 128, 180) 0px 0px 5px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: '微软雅黑';
        font-weight: 600;
        font-size: 20px;
        color:rgb(35, 125, 191);
        position: relative;
        background: #093068;

        i{
          font-family: "Arial Black";
          font-size: 17px;
          margin: 0 5px 0 5px;
        }
        .driver-top {
          display: flex;
          p{
            color:rgb(35, 125, 191);
          }
          .driver-red {
            .title1 {
              height: 35px;
              width: 183px;
              display: flex;
              align-items: center;
              justify-content: center;
              letter-spacing: 2px;
              background-color: black;
            }

            .carCount {
              margin-top: 10px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;

              p {
                font-size: 16px;
                font-weight: 500;
              }

              span {
                width: 98px;
                height: 39px;
                border: solid 1px rgb(28, 103, 166);
                border-left: none;
                border-right: none;
                font-family: FZGongYeHei;
                font-size: 36px;
                color: rgb(255, 37, 37);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .p1 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                left: 50px;
                top: -10px;
              }

              .p2 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                left: 50px;
                top: 19px;
              }

              .p3 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                right: 34px;
                top: -10px;
              }

              .p4 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                right: 34px;
                top: 19px;
              }
            }

          }

          .driver-yellow {
            margin-left: 5px;
            .title2 {
              height: 35px;
              width: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
              letter-spacing: 2px;
              background-color: black;
            }

            .carCount {
              margin-top: 10px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;

              p {
                font-size: 16px;
                font-weight: 500;
              }

              span {
                width: 116px;
                height: 39px;
                border: solid 1px rgb(28, 103, 166);
                border-left: none;
                border-right: none;
                font-family: FZGongYeHei;
                font-size: 36px;
                color: rgb(255, 255, 32);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .p1 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                left: 50px;
                top: -10px;
              }

              .p2 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                left: 50px;
                top: 19px;
              }

              .p3 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                right: 34px;
                top: -10px;
              }

              .p4 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                right: 34px;
                top: 19px;
              }
            }

          }
        }
        .driver-bottom {
          margin-top: 30px;
          display: flex;
          p{
            color:rgb(35, 125, 191);
          }
          .driver-blue {
            .title1 {
              height: 35px;
              width: 183px;
              display: flex;
              align-items: center;
              justify-content: center;
              letter-spacing: 2px;
              background-color: black;
            }

            .carCount {
              margin-top: 10px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;

              p {
                font-size: 16px;
                font-weight: 500;
              }

              span {
                width: 98px;
                height: 39px;
                border: solid 1px rgb(28, 103, 166);
                border-left: none;
                border-right: none;
                font-family: FZGongYeHei;
                font-size: 36px;
                color: rgba(50, 145, 248, 1);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .p1 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                left: 50px;
                top: -10px;
              }

              .p2 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                left: 50px;
                top: 19px;
              }

              .p3 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                right: 34px;
                top: -10px;
              }

              .p4 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                right: 34px;
                top: 19px;
              }
            }

          }

          .driver-green {
            margin-left: 5px;
            .title2 {
              height: 35px;
              width: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
              letter-spacing: 2px;
              background-color: black;
            }

            .carCount {
              margin-top: 10px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;

              p {
                font-size: 16px;
                font-weight: 500;
              }

              span {
                width: 116px;
                height: 39px;
                border: solid 1px rgb(28, 103, 166);
                border-left: none;
                border-right: none;
                font-family: FZGongYeHei;
                font-size: 36px;
                color: rgba(39, 177, 72, 1);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .p1 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                left: 50px;
                top: -10px;
              }

              .p2 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                left: 50px;
                top: 19px;
              }

              .p3 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                right: 34px;
                top: -10px;
              }

              .p4 {
                position: absolute;
                width: 1px;
                height: 10px;
                background-color: rgb(28, 103, 166);
                transform: rotate(0deg);
                right: 34px;
                top: 19px;
              }
            }

          }
        }
        .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
          position: absolute;
          width: 10px;
          height: 3px;
          background-color: rgb(2, 205, 230);
        }
        .p1{
          left: 0;
          top:-22px;
        }
        .p2{
          left: 0;
          top:216px;
        }
        .p3{
          right: 0;
          top:-22px;
        }
        .p4{
          right: 0;
          top:216px;
        }
        .a1,.a2,.a3,.a4{
          transform:rotate(90deg);
        }
        .a1{
          left: -5px;
          top:-18px;
        }
        .a2{
          left: -5px;
          top:212px;
        }
        .a3{
          right: -5px;
          top:-18px;
        }
        .a4{
          right: -5px;
          top:212px;
        }
      }
    }
    .spread{
      margin-top: 20px;
      margin-left: 60px;
      margin-right: 90px;
      width: 910px;
      .spreadTop{
        width:910px;
        border-style: solid;
        box-shadow: rgb(36, 128, 180) 0px 0px 5px 0px;
        border-width: 1px;
        color: #237dbf;
        height: 506px;
        display: flex;
        background-color: #093068;
        position: relative;
        .rank{
          margin-right: 3px;
          width: 310px;
          .title{
            height: 35px;
            font-family: '微软雅黑';
            font-weight: 600;
            font-size: 20px;
            color:rgb(35, 125, 191);
            letter-spacing: 2px;
            background-color: black;
            display: flex;
            align-items: center;
            justify-content: center;
            i{
              font-family: "Arial Black";
              font-size: 17px;
              margin: 0 5px 0 5px;
            }
          }
        }
        .area{
          width: 650px;
          .title{
            height: 35px;
            font-family: '微软雅黑';
            font-weight: 600;
            font-size: 20px;
            color:rgb(35, 125, 191);
            letter-spacing: 2px;
            background-color: black;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            i{
              font-family: "Arial Black";
              font-size: 17px;
              margin: 0 5px 0 5px;
            }
          }
          .map{
            width: 595px;
            height: 455px;
            padding: 0 10px 10px 10px;
            ::v-deep .point-info{
              display: none;
            }
          }
        }
        .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
          position: absolute;
          width: 10px;
          height: 3px;
          background-color: rgb(2, 205, 230);
        }
        .p1{
          left: 0;
          top:-18px;
        }
        .p2{
          left: 0;
          top:487px;
        }
        .p3{
          right: 0;
          top:-18px;
        }
        .p4{
          right: 0;
          top:487px;
        }
        .a1,.a2,.a3,.a4{
          transform:rotate(90deg);
        }
        .a1{
          left: -5px;
          top:-14px;
        }
        .a2{
          left: -5px;
          top:483px;
        }
        .a3{
          right: -5px;
          top:-14px;
        }
        .a4{
          right: -5px;
          top:483px;
        }
      }
      .spreadBottom{
        width: 910px;
        margin-top: 10px;
        border-style: solid;
        height: 290px;
        background-color: #093068;
        border-width:1px;
        box-shadow: rgb(36, 128, 180) 0px 0px 5px 0px;
        color: #237dbf;
        position: relative;
        .title{
          height: 35px;
          font-family: '微软雅黑';
          font-weight: 600;
          font-size: 20px;
          color:rgb(35, 125, 191);
          letter-spacing: 2px;
          background-color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          i{
            font-family: "Arial Black";
            font-size: 17px;
            margin: 0 5px 0 5px;
          }
        }
        .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
          position: absolute;
          width: 10px;
          height: 3px;
          background-color: rgb(2, 205, 230);
        }
        .p1{
          left: 0;
          top:-18px;
        }
        .p2{
          left: 0;
          top:271px;
        }
        .p3{
          right: 0;
          top:-18px;
        }
        .p4{
          right: 0;
          top:271px;
        }
        .a1,.a2,.a3,.a4{
          transform:rotate(90deg);
        }
        .a1{
          left: -5px;
          top:-14px;
        }
        .a2{
          left: -5px;
          top:267px;
        }
        .a3{
          right: -5px;
          top:-14px;
        }
        .a4{
          right: -5px;
          top:267px;
        }
      }
    }
    .right{
    padding:20px 30px 0 0;
    .accident{
      width: 390px;
      //height: 350px;
      border-style: solid;
      font-family: '微软雅黑';
      font-weight: 600;
      font-size: 20px;
      color:rgb(35, 125, 191);
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      border-width: 1px;
      box-shadow: rgb(36, 128, 180) 0px 0px 5px 0px;
      color: #237dbf;
      background: #093068;
      .title{
        width: 388px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 2px;
        background-color: black;
        i{
          font-family: "Arial Black";
          font-size: 17px;
          margin: 0 5px 0 5px;
        }
      }
      .box{
        height: 75px;
        width: 370px;
        border-style: solid;
        border-color: rgb(36, 128, 180);
        border-width: 1px;
        font-size: 14px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: relative;
        div{
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        p{
          width: 10px;
          height: 3px;
          background-color: rgb(2, 205, 230);
          position: absolute;
        }
        .p1{
          left: 0;
          top: -16px;
        }
        .p2{
          left: 0;
          top: 58px;
        }
        .p3{
          right: 0;
          top: -16px;
        }
        .p4{
          right: 0;
          top: 58px;
        }
        .p5,.p6,.p7,.p8{
          transform:rotate(90deg);
        }
        .p5{
          left: -5px;
          top: -12px;
        }
        .p6{
          left: -5px;
          top: 54px;
        }
        .p7{
          right: -5px;
          top: -12px;
        }
        .p8{
          right: -5px;
          top: 54px;
        }
      }
      .pieChart{
        width:388px;
        height:274px;
        margin-top: 10px;
        margin-bottom: 19px;
        background-color: black;
        .chart{
          padding-top: 10px;
          padding-bottom: 10px;
        }
      }
      .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
        position: absolute;
        width: 10px;
        height: 3px;
        background-color: rgb(2, 205, 230);
      }
      .p1{
        left: 0;
        top:-22px;
      }
      .p2{
        left: 0;
        top:402px;
      }
      .p3{
        right: 0;
        top:-22px;
      }
      .p4{
        right: 0;
        top:402px;
      }
      .a1,.a2,.a3,.a4{
        transform:rotate(90deg);
      }
      .a1{
        left: -5px;
        top:-18px;
      }
      .a2{
        left: -5px;
        top:398px;
      }
      .a3{
        right: -5px;
        top:-18px;
      }
      .a4{
        right: -5px;
        top:398px;
      }
    }
    .labelMark{
      width: 390px;
      //height: 350px;
      border-style: solid;
      border-color: rgb(36, 128, 180);
      font-family: '微软雅黑';
      font-weight: 600;
      font-size: 20px;
      color:rgb(35, 125, 191);
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      border-width: 1px;
      box-shadow: rgb(36, 128, 180) 0px 0px 5px 0px;
      color: #237dbf;
      position: relative;
      background: #093068;
      .title{
        width: 388px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 2px;
        background-color: black;
        i{
          font-family: "Arial Black";
          font-size: 17px;
          margin: 0 5px 0 5px;
        }
      }
      .pieSecondChart{
        width:388px;
        height:305px;
        margin-top: 10px;
        margin-bottom: 19px;
        background-color: black;
        display: flex;
        align-items:center;
        justify-content: center;
      }
      .p1,.p2,.p3,.p4,.a1,.a2,.a3,.a4{
        position: absolute;
        width: 10px;
        height: 3px;
        background-color: rgb(2, 205, 230);
      }
      .p1{
        left: 0;
        top:-22px;
      }
      .p2{
        left: 0;
        top:348px;
      }
      .p3{
        right: 0;
        top:-22px;
      }
      .p4{
        right: 0;
        top:348px;
      }
      .a1,.a2,.a3,.a4{
        transform:rotate(90deg);
      }
      .a1{
        left: -5px;
        top:-18px;
      }
      .a2{
        left: -5px;
        top:344px;
      }
      .a3{
        right: -5px;
        top:-18px;
      }
      .a4{
        right: -5px;
        top:344px;
      }
    }
  }
  }
  .login{
    position: absolute;
    top: 10px;
    right: 10px;
    span{
      color:white;
      font-size: 22px;
      cursor: pointer;
      display: flex;
      align-items: center;
      i{
        margin-left: 5px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep {
  .el-table thead{
    color:white;
  }
  .rank .el-table__body tr.current-row>td{
    background: #093068;
  }
  .rank .el-table--enable-row-hover .el-table__body tr:hover>td{
    background: #093068;
  }
  .rank .el-table {
    background-color: #093068;
    padding: 6px 10px 0 10px;
    border: none;
  }

  .el-table--border::after, .el-table--group::after, .el-table::before {
    background-color: #093068;
  }

  .rank .el-table th, .el-table tr {
    background-color: #093068;
  }

  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border: none;
  }
  .rank .el-table .warning-row{
    background: #7787A15E;
  }

  .rank .el-table .success-row{
    background: #031A41;
  }

  .spreadBottom .el-table {
    background-color: #093068;
    padding: 0 10px 0 10px;
    border: none;
  }

  .spreadBottom .el-table th, .el-table tr {
    background-color: #093068;
    padding: 0 10px 0 10px;
    border: none;
  }

  .spreadBottom .el-table__body tr.current-row>td{
    background: #7787A15E;
  }
  .spreadBottom .el-table--enable-row-hover .el-table__body tr:hover>td{
    background: #7787A15E;
  }

  .el-table--border th.gutter:last-of-type {
    border: none;
  }
}
</style>
