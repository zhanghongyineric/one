<template>
  <div class="point-info">
    <p><b>企业性质：</b>{{ currInfo.unitCategory }}</p>
    <p><b>企业名称：</b>{{ currInfo.unitName }}</p>
    <p><b>车辆数量：</b>{{ currInfo.vehicleAll ? currInfo.vehicleAll : 0 }}辆</p>
    <p><b>联系电话：</b>{{ currInfo.unitTel }}</p>
    <div v-if="currInfo.safeLevelWeightId == 4">
      <span class="type red">高风险</span>
      <div class="code-con">
        <svg-icon class="info-code" icon-class="code" :style="{color: colors.red}" />
      </div>
    </div>
    <div v-if="currInfo.safeLevelWeightId == 3">
      <span class="type yellow">较高风险</span>
      <div class="code-con">
        <svg-icon class="info-code" icon-class="code" :style="{color: colors.yellow}" />
      </div>
    </div>
    <div v-if="currInfo.safeLevelWeightId == 2">
      <span class="type blue">一般风险</span>
      <div class="code-con">
        <svg-icon class="info-code" icon-class="code" :style="{color: colors.blue}" />
      </div>
    </div>
    <div v-if="currInfo.safeLevelWeightId == 1">
      <span class="type green">低风险</span>
      <div class="code-con">
        <svg-icon class="info-code" icon-class="code" :style="{color: colors.green}" />
      </div>
    </div>
    <div class="more">
      <span @click="showDetails(1)">更多</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoWindow',
  props: ['currInfo']
}
</script>

<style scoped lang="scss">
@import "../../../../styles/variables";
.point-info {
  font-size: 13px!important;
  width: 200px;
  height: 200px;
p {
  margin: 3px 0;
}
.type {
  display: inline-block;
  color: #8b0000;
  transform: rotate(-30deg);
  height: 30px;
  width: 120px;
  font-size: 25px;
  vertical-align: 40px;
  text-shadow: #999 1px 0 10px;
}
.red {
  color: $red;
//color: red;
}
.yellow {
  color: $yellow;
//color: yellow;
}
.blue {
  color: $blue;
//color: blue;
}
.green {
  color: $green;
//color: green;
}

.code-con {
  color: red;
  display: inline-block;
  text-align: center;
}

.info-code {
  width: 80px;
  height: 80px;
  color: red;
}
.more {
  color: #0A93F2;
  font-size: 14px;
  text-align: right;
span {
  cursor: pointer;
}
}
}
</style>
