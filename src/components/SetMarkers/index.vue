<template>
  <div class="set-markers">
    <span @click="showDetail">
      <slot>
        <el-button type="success" size="small" class="marker-btn">打标签</el-button>
      </slot>
    </span>
    <el-dialog
      v-if="setMarkerDialog"
      title="违章详情"
      :visible.sync="setMarkerDialog"
      width="40%"
      max-height="500"
      :before-close="cancel"
      :append-to-body="true"
    >
      <singleMarker
        v-for="(item, index) in markersList"
        :key="item.typeName"
        :list="item"
        :value.sync="markersForm[index]"
      />
      <span v-if="!markersList.length">暂无标签，请先到标签页添加并启用标签</span>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitForm"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SingleMarker from '@/components/SetMarkers/singleMarker'
import { getMarkersList, setMarkers } from '@/api/government-report/government-report'
export default {
  name: 'SetMarkers',
  components: { SingleMarker },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      setMarkerDialog: false,
      markersForm: {},
      listLoading: false,
      markersList: [],
      flag: false
    }
  },
  watch: {
    flag: function(val) {
      if (val) {
        this.getMarkersList()
      }
    }
  },
  activated() {
    const m = localStorage.getItem('markerList')
    this.markersList = JSON.parse(m)
    this.setMarkerChoosed(this.markersList)
  },
  methods: {
    getMarkersList() {
      const m = localStorage.getItem('markerList')
      if (m) {
        this.markersList = JSON.parse(m)
        this.setMarkerChoosed(this.markersList)
      } else {
        getMarkersList()
          .then(res => {
            this.markersList = res.data
            this.setMarkerChoosed(res.data)
          }).catch(err => {
            throw err
          })
      }
    },
    setMarkerChoosed(markersList) {
      const markers = []
      markersList.forEach(marker => {
        if (marker.status === '0') {
          // this.markersForm[marker.id] = marker.tagList[0].id
          markers.push({
            typeName: marker.typeName,
            tagName: marker.tagList[0].tagName,
            tagId: marker.tagList[0].id
          })
        }
      })
      this.markersForm = markers
    },
    showDetail() {
      this.setMarkerDialog = true
      this.flag = true
    },
    cancel() {
      this.setMarkerDialog = false
    },
    submitForm() {
      console.log(this.markersForm)
      const form = {
        vehicleLogTagId: this.id,
        tagList: this.markersForm
      }
      console.log(form)
      setMarkers(form, 'log/add')
        .then(res => {
          this.setMarkerDialog = false
          this.$emit('refresh')
        })
    }
  }
}
</script>

<style scoped lang="scss">
.set-markers {
  display: inline-block;
  .marker-btn {
    margin: 0 5px;
  }
}
</style>
