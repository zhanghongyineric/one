<template>
  <div class="flex">
    <span class="tit-s">{{ list.typeName }}：</span>
    <ul class="content">
      <li
        v-for="info in list.tagList"
        :key="info.id"
        :class="{ active: info.id === currValue.tagId }"
        @click="changeChoose(info.id, info.tagName)"
      >{{ info.tagName }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SingleMarker',
  props: {
    list: {
      type: Object
    },
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currValue: 0
    }
  },
  created() {
    this.currValue = this.value
  },
  methods: {
    changeChoose(id, name) {
      this.currValue.tagId = id
      this.currValue.tagName = name
      this.$emit('update:value', this.currValue)
    }
  }
}
</script>

<style scoped lang="scss">
.flex {
  display: flex;

  .tit-s {
    width: 70px;
    color: #777;
    padding: 8px 0;
  }

  .content {
    flex: 1;
    margin: 0;
    padding: 0;

    li {
      display: inline-block;
      border: 1px solid #f0f0f0;
      border-radius: 5px;
      padding: 7px 15px;
      margin: 0 10px 10px;
      cursor: pointer;

      &.active {
        background-color: #0A93F2;
        color: #fff;
      }
    }
  }
}
</style>
