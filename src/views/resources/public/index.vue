<template :needFoot="false">
  <main-box class="res-public">
    <div class="mTable" slot="mbody">
      <div class="tableBtn">
        <span v-if="breadCrumbArr.length <= 0">全部文件</span>
        <template v-else>
          <el-button type="text" @click="goBack">返回上一级 |</el-button>
          <el-button type="text" @click="getList()">{{
            '全部文件' + ' > '
          }}</el-button>
          <template v-for="(item, idx) in breadCrumbArr">
            <el-button
              v-if="idx != breadCrumbArr.length - 1"
              :key="idx"
              @click="specify(item, idx)"
              type="text"
              >{{ item.name + ' > ' }}</el-button
            >
            <span v-else :key="idx">{{ item.name }}</span>
          </template>
        </template>
        <div class="rightBtn">
          <el-button @click="addFun">新建文件夹</el-button>
          <el-upload
            class="upload-demo"
            multiple
            :show-file-list="false"
            :action="upload.url"
            :headers="upload.headers"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
          >
            <el-button>上传</el-button>
          </el-upload>
          <el-button @click="downloadFun">下载</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        :border="false"
        @selection-change="getSelectData"
        height="calc(100vh - 384px)"
        :stripe="true"
        v-loading="listLoading"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          label="名称"
          show-overflow-tooltip
          align="left"
          min-width="450"
        >
          <div @click="fun" class="flieName" slot-scope="scope">
            <template v-if="scope.row.classType == 1">
              <img :src="folderIcon" />
              <el-button
                v-if="!scope.row.show"
                type="text"
                @click="clickName(scope.row)"
                >{{ scope.row.name }}</el-button
              >
              <template v-else>
                <el-input
                  v-model="scope.row.name"
                  maxlength="20"
                  show-word-limit
                  placeholder="请输入文件夹名称"
                />
                <el-button
                  class="red"
                  icon="el-icon-close"
                  circle
                  @click="scope.row.show = flase"
                ></el-button>
                <el-button
                  icon="el-icon-check"
                  circle
                  @click="folderUpdateFun(scope.row, scope.$index)"
                ></el-button>
              </template>
            </template>
            <template v-else-if="scope.row.classType == 2">
              <img :src="documentIcon" />
              <span v-if="!scope.row.show">{{ scope.row.name }}</span>
              <template v-else>
                <el-input
                  v-model="scope.row.name"
                  maxlength="20"
                  show-word-limit
                  placeholder="请输入文件名称"
                />
                <el-button
                  class="red"
                  icon="el-icon-close"
                  circle
                  @click="scope.row.show = flase"
                ></el-button>
                <el-button
                  icon="el-icon-check"
                  circle
                  @click="folderUpdateFun(scope.row, scope.$index)"
                ></el-button>
              </template>
            </template>
          </div>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="上传时间"
          show-overflow-tooltip
          width="220"
        >
        </el-table-column>
        <el-table-column
          prop="createBy"
          label="上传用户"
          show-overflow-tooltip
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="fileType"
          label="类型"
          show-overflow-tooltip
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="fileSize"
          label="大小"
          show-overflow-tooltip
          width="120"
        >
        </el-table-column>

        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="rename(scope.row, scope.$index)"
              >重命名</el-button
            >
            <el-button type="text" @click="deletefun(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <m-dialog
      title="新建文件夹"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
    >
      <el-form
        :model="resourcesFome"
        ref="resourcesFome"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="文件夹名称" prop="name">
          <el-input
            v-model="resourcesFome.name"
            maxlength="20"
            show-word-limit
            placeholder="请输入文件夹名称"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  publicFolderList,
  addFolder,
  folderDelete,
  downloadFile,
  addFile,
  folderUpdate
} from '@/api/resources/public'
import { getToken } from '@/utils/auth'
import folderIcon from '@/assets/images/icon/folderIcon.png'
import documentIcon from '@/assets/images/icon/documentIcon.png'
import store from '@/store/index.js'
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }]
      },
      // 文件夹图标
      folderIcon: folderIcon,
      // 文件图标
      documentIcon: documentIcon,
      listLoading: false,
      tableData: [],
      // 面包屑
      breadCrumbArr: [],
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      dialogVisible: false,
      resourcesFome: {
        name: '',
        parentFolderId: ''
      },
      // 批量操作数据
      multipleSelection: [],
      // 上传配置
      upload: {
        // 设置上传的请求头部
        headers: {
          Authorization: getToken()
        },
        // 上传的地址
        url:
          store.state.apiConfiguration.url +
          store.state.serviceName.jurisdiction +
          '/fs/upload'
      }
    }
  },
  methods: {
    // 获取表格数据
    async getList(demand) {
      this.listLoading = true
      if (demand) {
        this.tableData = await publicFolderList(demand)
      } else {
        this.breadCrumbArr = []
        this.tableData = await publicFolderList()
      }
      this.listLoading = false
    },
    fun() {
      console.log(11)
    },
    // 返回上一级
    goBack() {
      console.log(this.breadCrumbArr.length)
      let parentFolderId =
        this.breadCrumbArr.length - 2 >= 0
          ? this.breadCrumbArr[this.breadCrumbArr.length - 2].id
          : ''
      this.breadCrumbArr.splice(this.breadCrumbArr.length - 1, 1)
      console.log(this.breadCrumbArr)
      this.getList({
        parentFolderId
      })
    },
    // 面包屑指定跳转
    specify(scope, idx) {
      this.breadCrumbArr = this.breadCrumbArr.slice(0, idx + 1)
      this.getList({ parentFolderId: scope.id })
    },
    // 重命名
    rename(scope, idx) {
      this.$set(this.tableData[idx], 'show', true)
    },
    // 新建文件夹
    addFun() {
      this.resourcesFome = {
        name: ''
      }
      this.dialogVisible = true
    },
    // 重命名提交
    async folderUpdateFun(scope, idx) {
      await folderUpdate({
        folderBeans: [
          { id: scope.id, classType: scope.classType, name: scope.name }
        ]
      })
      this.$set(this.tableData[idx], 'show', false)
    },
    // 删除
    deletefun(scope) {
      this.$confirm('该文件下的数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await folderDelete({
            folderBeans: [
              {
                id: scope.id,
                classType: scope.classType
              }
            ]
          })
          if (this.breadCrumbArr.length > 0) {
            this.getList({
              parentFolderId: this.breadCrumbArr[this.breadCrumbArr.length - 1]
                .id
            })
          } else {
            this.getList()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 点击文件夹
    clickName(scope) {
      this.breadCrumbArr.push(scope)
      this.getList({ parentFolderId: scope.id })
    },
    confirm() {
      this.$refs.resourcesFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          if (this.breadCrumbArr.length > 0) {
            this.resourcesFome.parentFolderId = this.breadCrumbArr[
              this.breadCrumbArr.length - 1
            ].id
          }
          await addFolder(this.resourcesFome)
          this.dialogVisible = false
          this.getList({ parentFolderId: this.resourcesFome.parentFolderId })
        }
      })
    },
    // 表格数据批量操作
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return { id: item.id, classType: item.classType }
      })
    },
    // 下载
    async downloadFun() {
      this.listLoading = true
      if (this.multipleSelection.length > 0) {
        await downloadFile({
          folderBeans: this.multipleSelection
        })
        this.listLoading = false
      } else {
        this.$message.warning('请勾选需要下载的文件夹或文件')
        this.listLoading = false
      }
    },
    // 上传前校验
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('单个附件最大不可超过10M!')
      }
      return isLt10M
    },
    async uploadSuccess(file, fileList) {
      let parentFolderId
      if (this.breadCrumbArr.length > 0) {
        parentFolderId = this.breadCrumbArr[this.breadCrumbArr.length - 1].id
      }
      await addFile({
        parentFolderId,
        fileName: fileList.response.body.fileName,
        filePath: fileList.response.body.url,
        fileSize: fileList.size,
        fileType: '2'
      })
      this.getList({ parentFolderId })
      console.log(fileList)
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.res-public {
  .mTable {
    .tableBtn {
      height: 32px;
      line-height: 32px;
      span {
        font-size: 14px;
        height: 32px;
      }
      .el-button + .el-button {
        margin-left: 0;
      }
      .rightBtn {
        float: right;
        .upload-demo {
          display: inline-block;
          margin: 0 10px;
        }
      }
    }
  }
  .flieName {
    :hover {
      box-shadow: none !important;
    }
    .el-button.is-circle {
      width: 28px;
      height: 28px !important;
      background-color: #009b4c;
      color: #fff;
      padding: 0;
      margin-left: 10px;
    }
    .el-button.is-circle.red {
      background-color: #ff0024;
      border-color: #ff0024;
    }
    img {
      vertical-align: middle;
      width: 14px;
    }
  }
}
</style>
