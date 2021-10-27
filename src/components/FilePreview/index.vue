<!--文件预览-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    fullscreen
  >
    <el-image v-if="fileType ==='image'" :src="fileUrl" fit="contain" style="max-width: 100%;max-height: 100%" />
    <iframe v-else-if="fileType ==='pdf'" :src="fileUrl" frameborder="0" style="width: 100%;height: 100%;" />
    <video v-else-if="fileType ==='video'" controls style="width: 100%;height: 100%">
      <source :src="fileUrl" type="video/mp4">
      <p>Your browser doesn't support HTML5 video. Here is
        a <a href="myVideo.mp4">link to the video</a> instead.
      </p>
    </video>
    <p v-else class="f ai-c">
      该文件格式暂不支持预览，请下载后查看:<el-link type="primary" :href="fileUrl">下载该文件</el-link>
    </p>

    <!--关闭图标-->
    <span class="el-image-viewer__btn el-image-viewer__close" @click="dialogVisible = false">
      <i class="el-icon-close" />
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'FilePreview',
  props: {
    // 文件在线地址
    fileUrl: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      }
    },
    // 文件类型
    fileType() {
      const suffix = this.fileUrl.slice(this.fileUrl.lastIndexOf('.') + 1)
      const imageFormat = ['bmp', 'jpg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp', 'avif', 'apng']
      const videoFormat = ['mp4', 'webm', 'avi']
      // const docFormat = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']

      if (imageFormat.includes(suffix)) return 'image'
      if (videoFormat.includes(suffix)) return 'video'
      if (suffix === 'pdf') return 'pdf'
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    height: 100%;
  }
}
</style>
