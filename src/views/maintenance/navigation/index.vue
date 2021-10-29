<template>
  <div class="layout-content">
    <el-card class="box-card">
      <el-row :gutter="20" class="card-list">
        <el-col v-for="item in navigationList" :key="item.name" :xs="12" :sm="8" :md="6" :lg="4">
          <a
            :href="item.url"
            target="_blank"
          >
            <div class="item">
              {{ item.name }}
            </div>
          </a>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      navigationList: [
        { 'name': 'nacos', url: 'http://www.gosmooth.com.cn:8888/nacos' },
        { 'name': 'sentinel', url: 'http://www.gosmooth.com.cn:8877/#/login' },
        { 'name': 'spring-admin', url: 'http://139.9.139.113:8899/login' },
        { 'name': 'minio', url: 'http://www.image.gosmooth.com.cn/minio/login' },
        { 'name': 'xxl-job-admin', url: 'http://www.gosmooth.com.cn:8866/xxl-job-admin/' },
        { 'name': 'kubernetes', url: 'http://www.gosmooth.com.cn:8811' },
        // { 'name': 'grafana', url: 'http://www.gosmooth.com.cn:8822/login' },
        { 'name': 'emq', url: 'http://www.gosmooth.com.cn:8833/#/' },
        // { 'name': 'flink', url: 'http://www.gosmooth.com.cn:8800/#/overview' },
        // { 'name': 'hadoop-yarn', url: 'http://www.gosmooth.com.cn:8855/cluster/nodes' },
        // { 'name': 'hadoop-hdfs ', url: 'http://www.gosmooth.com.cn:8844/dfshealth.html#tab-overview' },
        { 'name': 'eolinker', url: 'http://www.srelocal.gosmooth.com.cn:9966/eolinker_os/index.html#/index' },
        { 'name': 'gitlab', url: 'http://www.srelocal.gosmooth.com.cn:9988/users/sign_in' },
        { 'name': 'Jenkins', url: 'http://www.srelocal.gosmooth.com.cn:9977/login' },
        { 'name': 'SonarQube', url: 'http://www.srelocal.gosmooth.com.cn:9944' },
        { 'name': 'zentao ', url: 'http://www.srelocal.gosmooth.com.cn:9955/zentao/user-login-L3plbnRhby8=.html' },
        { 'name': 'Nexus ', url: 'http://www.srelocal.gosmooth.com.cn:9933' },
        { 'name': '华为云', url: 'https://www.huaweicloud.com/' },
        { 'name': '百度云', url: 'https://login.bce.baidu.com/' },
        { 'name': '阿里云', url: 'https://account.aliyun.com/login/login.htm' },
        { 'name': '墨刀', url: 'https://org.modao.cc/' },
        { 'name': '蓝湖', url: 'https://lanhuapp.com/web/#/item?fid=6d4951ea-d238-4173-8339-edae654b9e35&commonly=all' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.card-list {
  .el-col {
    margin-bottom: 20px;
  }

  .item {
    position: relative;
    height: 150px;
    text-align: center;
    line-height: 150px;
    color: white;
    font-size: 24px;
    border-radius: 5px;
    background-image: linear-gradient(to top, rgb(92, 159, 247) 20%, rgb(211, 34, 255) 100%);
    transition: all .5s;
    overflow: hidden;

    &:before,&:after{
      content: '';
      position: absolute;
      width: 0;
      height: 5px;
      background: rgb(92, 159, 247);
      transition: all .5s;
    }
    &:before{
      top: 0;
      left: 0;

    }
    &:after{
      right: 0;
      bottom: 0;
      background: rgb(211, 34, 255);
    }
    &:hover{
      letter-spacing: 5px;
      background-image: linear-gradient(to top, rgb(92, 159, 247) 0%, rgb(211, 34, 255) 100%);
    }
    &:hover:before,&:hover:after{
      width: 100%;
    }
  }
}
</style>
