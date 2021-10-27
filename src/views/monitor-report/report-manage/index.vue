<template>
  <div class="layout-content dictionary">
    <el-card class="box-card">

      <!--搜索栏-->
      <nav slot="header" class="f jc-sb">
        <div class="table-page-search-wrapper">
          <el-button type="text" size="small" icon="el-icon-arrow-left" class="back" @click="$router.go(-1)">返回</el-button>
          <label for="keyword">搜索:</label>
          <el-input
            id="keyword"
            v-model="listQuery.keyword"
            placeholder="请输入关键字"
            size="small"
            class="keyword"
            @keyup.enter.native="getList"
          />
          <el-button size="small" @click="resetQuery">重置</el-button>
          <el-button type="primary" size="small" @click="getList">查询</el-button>
        </div>
        <div class="toolbox">
          <el-button type="primary" plain size="small" icon="el-icon-circle-plus-outline">新建文件夹</el-button>
          <el-button type="primary" size="small" icon="el-icon-upload2">上传周报</el-button>
        </div>
      </nav>
      <!--表格-->
      <main>
        <div class="breadcrumb" />
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            v-slot="{row}"
            prop="fileName"
            label="名称"
          >
            <el-link :underline="false" type="primary" class="file" @click="fileClick(row)">
              <i :class="row.fileType === '1'?'el-icon-document':'el-icon-folder-opened'" />
              {{ row.fileName }}
            </el-link>
          </el-table-column>
          <el-table-column
            prop="creator"
            label="创建人"
          />
          <el-table-column
            prop="lastModified"
            label="最近修改"
          />
          <el-table-column
            v-slot="{row}"
            width="120"
            label="操作"
            class="f"
          >
            <div class="f ai-c jc-sb">
              <el-link class="primary" @click="edit(row)">
                <i class="el-icon-edit" />
              </el-link>
              <el-link class="primary" @click="download(row)">
                <i class="el-icon-download" />
              </el-link>
              <el-popconfirm
                title="确认删除吗？"
                @confirm="handleDelete(row)"
              >
                <el-link slot="reference" class="danger">
                  <i class="el-icon-delete" />
                </el-link>
              </el-popconfirm>
            </div>
          </el-table-column>
        </el-table>
      </main>
    </el-card>

    <!--文件预览弹窗-->
    <FilePreview :file-url="previewFileUrl" :visible.sync="previewDialogVisible" />
  </div>
</template>

<script>
import FilePreview from '@/components/FilePreview'
export default {
  name: 'ReportManage',
  components: { FilePreview },
  data() {
    return {
      listQuery: {
        keyword: ''
      },
      listQueryReset: {
        keyword: ''
      },
      tableData: [
        {
          fileName: '图片',
          fileType: '1',
          fileUrl: 'https://www.w3school.com.cn/i/eg_tulip.jpg',
          creator: '星星',
          lastModified: '2021年10月22日17:24:11'
        },
        {
          fileName: 'pdf',
          fileType: '1',
          fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
          creator: '星星',
          lastModified: '2021年10月22日17:24:11'
        },
        {
          fileName: 'doc',
          fileType: '1',
          fileUrl: 'https://www.jq22.com/demo/pdfjs-141101174753/test.doc',
          creator: '星星',
          lastModified: '2021年10月22日17:24:11'
        },
        {
          fileName: 'mp4',
          fileType: '1',
          fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          creator: '星星',
          lastModified: '2021年10月22日17:24:11'
        },
        {
          fileName: '文件夹',
          fileType: '2',
          creator: '点点',
          lastModified: '2021年10月22日17:24:11'
        }
      ],
      previewFileUrl: '',
      previewDialogVisible: false
    }
  },
  methods: {
    // 查询数据
    getList() {

    },
    // 重置查询条件
    resetQuery() {
      this.listQuery = { ...this.listQueryReset }
      this.getList()
    },
    // 编辑
    edit(row) {

    },
    // 下载
    download(row) {

    },
    // 删除
    handleDelete(row) {

    },
    // 点击文件/文件夹
    fileClick({ fileType, fileUrl }) {
      if (fileType === '1') {
        this.previewFileUrl = fileUrl
        this.previewDialogVisible = true
      } else {
        console.log('文件夹')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.back{
  margin-right: 30px;
}
label {
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-weight: 700;
}

.keyword {
  width: 200px;
  margin-right: 20px;
}
.primary{
  color:#409EFF
}
.danger{
  color:#F56C6C
}
.file{
  width: 100%;
  justify-content: flex-start;
  ::v-deep .el-link--inner{
    display: flex;
    align-items: center;
    i{
      margin-right: 5px;
      font-size: 20px;
    }
  }

}
</style>
