<!--
  - FileName: 市级账号大屏
  - @author: ChenHaiPing
  - @date: 2021/4/12 下午5:34
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
        <!--         全市交通运输企业统计模块-->
        <div class="company">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            全市交通运输企业统计
            <i class="el-icon-d-arrow-left" />
          </div>
          <!--           全市交通运输企业统计图表-->
          <div class="barChart">
            <div class="companyCount">
              <p>共计</p> <span>437</span> <p>家企业</p>
              <p class="p1" />
              <p class="p2" />
              <p class="p3" />
              <p class="p4" />
            </div>
            <BarChart width="380px" height="225px" :chart-data="barChart" />
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
        <!--         全市两客一危车辆统计模块-->
        <div class="car">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            全市两客一危车辆统计
            <i class="el-icon-d-arrow-left" />
          </div>
          <div class="carChart">
            <div class="carCount">
              <p>共计</p> <span>2137</span> <p>辆</p>
              <p class="p1" />
              <p class="p2" />
              <p class="p3" />
              <p class="p4" />
            </div>
            <div class="carline">
              <span>上线车辆：{{ online }}辆</span>
              <span>上线率：{{ onlineRate }}%</span>
              <span>同比上月：下降{{ download }}%</span>
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
        <!--         全市驾驶员数量统计模块-->
        <div class="driver">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            全市驾驶员数量统计
            <i class="el-icon-d-arrow-left" />
          </div>
          <div class="driverChart">
            <div class="driverCount">
              <p>共计</p> <span>6137</span> <p>人</p>
              <p class="p1" />
              <p class="p2" />
              <p class="p3" />
              <p class="p4" />
            </div>
            <div class="driverline">
              <span>危险品运输：{{ danger }}人</span>
              <span>旅客运输：{{ tourist }}人</span>
              <span>普通货运运输：下降{{ finalGoods }}人</span>
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
          <!--           全市驾驶员违章排名模块-->
          <div class="rank">
            <div class="title">
              <i class="el-icon-d-arrow-right" />
              全市驾驶员违章排名
              <i class="el-icon-d-arrow-left" />
            </div>
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
          </div>
          <!--           企业地域分布情况模块-->
          <div class="area">
            <div class="title">
              <i class="el-icon-d-arrow-right" />
              企业地域分布情况
              <i class="el-icon-d-arrow-left" />
            </div>
            <div class="map">
              <GaodeMap :map-infos="mapInfos" />
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
        <!--         红码占比排名模块-->
        <div class="spreadBottom">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            红码占比排名
            <i class="el-icon-d-arrow-left" />
          </div>
          <el-table
            :data="redList"
            size="small"
            height="200px"
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
            <el-table-column prop="companyName" width="180" align="center" show-overflow-tooltip />
            <el-table-column v-slot="{row}" prop="number" width="120" align="center">
              红码{{ row.number.number1 }}次占比{{ row.number.number2 }}%
            </el-table-column>
            <el-table-column v-slot="{row}" prop="count" width="160" align="center">
              驾驶员违章总次数：{{ row.count }}次
            </el-table-column>
            <el-table-column v-slot="{row}" prop="car" width="110" align="center">
              营运车辆：{{ row.car }}辆
            </el-table-column>
            <el-table-column prop="information" width="100" align="center" show-overflow-tooltip />
            <el-table-column align="center">
              <el-button type="text" size="small">更多</el-button>
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
        <!--         全市企业车辆事故统计模块-->
        <div class="accident">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            全市企业车辆事故统计
            <i class="el-icon-d-arrow-left" />
          </div>
          <div class="box">
            <div>
              <span style="color:rgba(255, 37, 37, 0.89);">特大事故：{{ veryThings }}次</span>
              <span style="color:rgba(252, 202, 0, 1);">一般事故：{{ normalThings }}次</span>
            </div>
            <div>
              <span style="color:rgba(50, 145, 248, 1);">重大事故：{{ bigThings }}次</span>
              <span style="color:rgba(82, 204, 111, 1);">轻微事故：{{ litteThings }}次</span>
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
        <!--         全市企业安全码统计模块-->
        <div class="labelMark">
          <div class="title">
            <i class="el-icon-d-arrow-right" />
            全市企业安全码统计
            <i class="el-icon-d-arrow-left" />
          </div>
          <div class="box">
            <div>
              <span style="color:rgba(255, 37, 37, 0.89);">红码：{{ redMark }}家</span>
              <span style="color:rgba(252, 202, 0, 1);">黄码：{{ yellowMark }}家</span>
            </div>
            <div>
              <span style="color:rgba(50, 145, 248, 1);">蓝码：{{ blueMark }}家</span>
              <span style="color:rgba(82, 204, 111, 1);">绿码：{{ greenMark }}家</span>
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
import BarChart from '../../company-manage/components/city-bigscreen/BarChart'
import PieChart from '../../company-manage/components/city-bigscreen/PieChart'
import PieSecond from '../../company-manage/components/city-bigscreen/PieSecond'
import GaodeMap from '../../home/admin-dashboard/components/AMap'
import { colorOption } from '@/options'

export default {
  name: 'City',
  components: {
    PieSecond,
    BarChart,
    PieChart,
    GaodeMap
  },
  data() {
    return {
      date: '-',
      time: '-',
      title: '川运安全码可视化大屏',
      img1: img1,
      barChart: [],
      pieChart: [],
      pieSecond: [],
      online: 20321,
      onlineRate: 85.2,
      download: 2.71,
      danger: 1232,
      tourist: 1232,
      finalGoods: 1232,
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
      mapInfos: [],
      redList: [
        {
          companyName: '遂宁某某危险品运输有限公司',
          number: {
            number1: 22,
            number2: 70
          },
          count: 52,
          car: 22,
          information: '张三  13287608765'
        },
        {
          companyName: '遂宁某某危险品运输有限公司',
          number: {
            number1: 22,
            number2: 70
          },
          count: 52,
          car: 22,
          information: '张三  13287608765'
        },
        {
          companyName: '遂宁某某危险品运输有限公司',
          number: {
            number1: 22,
            number2: 70
          },
          count: 52,
          car: 22,
          information: '张三  13287608765'
        },
        {
          companyName: '遂宁某某危险品运输有限公司',
          number: {
            number1: 22,
            number2: 70
          },
          count: 52,
          car: 22,
          information: '张三  13287608765'
        },
        {
          companyName: '遂宁某某危险品运输有限公司',
          number: {
            number1: 22,
            number2: 70
          },
          count: 52,
          car: 22,
          information: '张三  13287608765'
        }
      ],
      optionGroup: {
        codeList: colorOption.list
      },
      veryThings: 40,
      normalThings: 37,
      bigThings: 31,
      litteThings: 34,
      redMark: 12,
      yellowMark: 20,
      blueMark: 15,
      greenMark: 35
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
      this.barChart = [120, 160, 150, 80, 70]
      this.pieChart = [{
        value: 13,
        name: '前后碰撞'
      }, {
        value: 21,
        name: '刮擦'
      }, {
        value: 16,
        name: '翻车'
      }, {
        value: 15,
        name: '碰固定物'
      }, {
        value: 20,
        name: '碾压'
      }, {
        value: 17,
        name: '坠车'
      }, {
        value: 15,
        name: '失火'
      }, {
        value: 25,
        name: '爆炸'
      }]
      this.pieSecond = [{
        value: 15,
        name: '蓝码'
      }, {
        value: 35,
        name: '绿码'
      }, {
        value: 20,
        name: '黄码'
      }, {
        value: 12,
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
    })(document)
  },

  methods: {
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
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
    .company{
      width: 390px;
      //height: 350px;
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
      .barChart{
        font-weight: 500;
        font-size: 16px;
        margin-top: 10px;
        .companyCount{
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          span{
            width: 217px;
            height: 39px;
            border: solid 1px rgb(28, 103, 166);
            border-left: none;
            border-right: none;
            font-family: FZGongYeHei;
            font-size: 36px;
            color: rgb(255, 255, 32);
            text-align: center;
          }
          .p1{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            left:73px;
            top: -10px;
          }
          .p2{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            left:73px;
            top: 19px;
          }
          .p3{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            right:88px;
            top: -10px;
          }
          .p4{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            right:88px;
            top: 19px;
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
        top:299px;
      }
      .p3{
        right: 0;
        top:-22px;
      }
      .p4{
        right: 0;
        top:299px;
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
        top:295px;
      }
      .a3{
        right: -5px;
        top:-18px;
      }
      .a4{
        right: -5px;
        top:295px;
      }
    }
    .car{
      margin-top: 10px;
      width: 390px;
      height: 300px;
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
      .title{
        width: 388px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: black;
        letter-spacing: 2px;
        i{
          font-family: "Arial Black";
          font-size: 17px;
          margin: 0 5px 0 5px;
        }
      }
      .carChart{
        font-weight: 500;
        font-size: 16px;
        margin-top: 10px;
        text-align: center;
        .carCount{
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          span{
            width: 217px;
            height: 39px;
            border: solid 1px rgb(28, 103, 166);
            border-left: none;
            border-right: none;
            font-family: FZGongYeHei;
            font-size: 36px;
            color: rgb(255, 255, 32);
            text-align: center;
          }
          .p1{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            left:94px;
            top: -10px;
          }
          .p2{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            left:94px;
            top: 19px;
          }
          .p3{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            right:78px;
            top: -10px;
          }
          .p4{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            right:78px;
            top: 19px;
          }
        }
        .carline{
          font-size: 12px;
          margin-top: 5px;
          width: 390px;
          height: 20px;
          background-color: #7787A15E;
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: white;
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
        top:277px;
      }
      .p3{
        right: 0;
        top:-22px;
      }
      .p4{
        right: 0;
        top:277px;
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
        top:273px;
      }
      .a3{
        right: -5px;
        top:-18px;
      }
      .a4{
        right: -5px;
        top:273px;
      }
    }
    .driver{
      margin-top: 10px;
      width: 390px;
      height: 164px;
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
      .title{
        width: 388px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: black;
        letter-spacing: 2px;
        i{
          font-family: "Arial Black";
          font-size: 17px;
          margin: 0 5px 0 5px;
        }
      }
      .driverChart{
        font-weight: 500;
        font-size: 16px;
        margin-top: 25px;
        text-align: center;
        .driverCount{
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          span{
            width: 217px;
            height: 39px;
            border: solid 1px rgb(28, 103, 166);
            border-left: none;
            border-right: none;
            font-family: FZGongYeHei;
            font-size: 36px;
            color: rgb(255, 255, 32);
            text-align: center;
          }
          .p1{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            left:94px;
            top: -10px;
          }
          .p2{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            left:94px;
            top: 19px;
          }
          .p3{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            right:78px;
            top: -10px;
          }
          .p4{
            position: absolute;
            width: 1px;
            height: 10px;
            background-color: rgb(28, 103, 166);
            transform:rotate(0deg);
            right:78px;
            top: 19px;
          }
        }
        .driverline{
          color:white;
          font-size: 12px;
          width: 390px;
          height: 20px;
          background-color: #7787A15E;
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-top: 32px;
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
        top:141px;
      }
      .p3{
        right: 0;
        top:-22px;
      }
      .p4{
        right: 0;
        top:141px;
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
        top:137px;
      }
      .a3{
        right: -5px;
        top:-18px;
      }
      .a4{
        right: -5px;
        top:137px;
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
       .pieChart{
         width:388px;
         height:280px;
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
         top:375px;
       }
       .p3{
         right: 0;
         top:-22px;
       }
       .p4{
         right: 0;
         top:375px;
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
         top:371px;
       }
       .a3{
         right: -5px;
         top:-18px;
       }
       .a4{
         right: -5px;
         top:371px;
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
       .pieSecondChart{
         width:388px;
         height:280px;
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
         top:375px;
       }
       .p3{
         right: 0;
         top:-22px;
       }
       .p4{
         right: 0;
         top:375px;
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
         top:371px;
       }
       .a3{
         right: -5px;
         top:-18px;
       }
       .a4{
         right: -5px;
         top:371px;
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

  .rank .el-table .warning-row {
    background: #7787A15E;
  }

  .rank .el-table .success-row {
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
