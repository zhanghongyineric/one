<template>
  <div class="industry-markers">
    <el-button class="detail-btn" type="warning" size="small" @click="showDetail">
      查看标签
    </el-button>
    <el-dialog
      v-if="dialogVisible"
      class="industry-markers-dialog"
      title="行业标签"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="cancel"
      :append-to-body="true"
    >
      <div style="max-height: 430px;overflow: auto;">
        <div v-for="marker in info" :key="marker.typeName" class="flex">
          <span class="tit-s btn-tit">{{ marker.typeName }}：</span>
          <span class="btn">{{ marker.tagName }}</span>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="cancel"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'IndustryMarkers',
  props: {
    info: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    showDetail() {
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  max-width: 400px;
}
.industry-markers {
  display: inline-block;
  .detail-btn {
    margin: 0 5px;
  }
}
.industry-markers-dialog {
   text-align: left;
   .flex {
     display: flex;
     padding: 5px 0;
     .tit-s {
       width: 70px;
       color: #777;
       &.btn-tit {
         padding: 5px 0;
       }
     }
     .content {
       flex: 1;
     }
     .btn {
       width: 100px;
       display: inline-block;
       border-radius: 5px;
       padding: 5px 15px;
       margin: 0 10px 10px;
       background-color: #0A93F2;
       color: #fff;
       text-align: center;
     }
   }
 }
</style>

