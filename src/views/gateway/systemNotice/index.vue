<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="我收到的" name="reptile">
        <main-box>
          <filter-box
            slot="mheader"
            :searchCol="searchCol"
            @searchFun="getList"
            :pageConfig="{ pageSize: pageForm.pageSize }"
          ></filter-box>
          <!-- <m-table
            slot="mbody"
            @handleSee="handleSee"
            :tableData="tableData"
            :tableCol="tableCol"
            :operationArr="operationArr"
            :wCaozuo="300"
            :isIndex="true"
            v-loading="tableloading"
          >
          </m-table> -->
          <!--  -->
          <div class="mTable" slot="mbody">
            <el-table
              v-loading="tableloading"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="light"
              style="width: 100%"
              :border="false"
              :height="`calc(100vh - 414px)`"
              :stripe="true"
            >
              <el-table-column label="序号">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column
                prop="title"
                label="通知标题"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="publisher"
                label="发布人"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="createTime"
                label="发布时间"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="已读">
                <template slot-scope="scope">
                  {{ scope.row.uncheckCount }}/{{ scope.row.sendUserCount }}
                </template>
              </el-table-column>
              <el-table-column label="操作" :width="300">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleSee(scope.row)"
                    >查看详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--  -->
          <m-pagin
            slot="mfooter"
            :total="total"
            :pageSize="pageForm.pageSize"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
            :currentPage.sync="pageForm.pageNum"
          ></m-pagin>
          <m-dialog
            title="查看详情"
            :visible.sync="dialogVisible"
            @closeFun="dialogVisible = false"
            v-loading="dialogloading"
            v-if="dialogVisible"
            :dialogBtnArr="[]"
          >
            <el-tabs v-model="active" v-if="dialogType == 'get'">
              <el-tab-pane label="详情" name="first">
                <el-form
                  :model="ruleForm"
                  :rules="formRules"
                  ref="operationFome"
                  label-width="120px"
                >
                  <el-form-item label="通知标题" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                  </el-form-item>
                  <el-form-item label="发布人">
                    <el-input v-model="ruleForm.publisher"></el-input>
                  </el-form-item>
                  <el-form-item label="发布时间">
                    <el-input v-model="ruleForm.createTime"></el-input>
                  </el-form-item>
                  <el-form-item label="推送范围" prop="range">
                    <div>
                      <span>{{ ruleForm.sendUserList.length }}人</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="正文" prop="content">
                    <el-input
                      type="textarea"
                      :rows="5"
                      maxlength="2000"
                      show-word-limit
                      v-model="ruleForm.content"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="附件">
                    <el-upload
                      ref="upload"
                      class="upload-demo"
                      :on-preview="uploadFilePreview"
                      multiple
                      accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .bmp, .rar, .pdf, .txt"
                      :limit="5"
                      :headers="upload.headers"
                      :action="upload.url"
                      :file-list="filelist"
                    >
                      <el-button
                        v-show="dialogType != 'get'"
                        size="small"
                        icon="el-icon-plus"
                        >点击上传</el-button
                      >
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="已读" name="second">
                <div class="issue">
                  <div class="issue_read">
                    <h3>
                      已读&nbsp;{{
                        ruleForm.sendUserList.filter((v) => {
                          return v.checkFlag == 1
                        }).length
                      }}
                    </h3>
                    <el-row
                      v-for="(v, index) of ruleForm.sendUserList"
                      :key="index"
                    >
                      <el-col
                        v-if="v.checkFlag == 1"
                        :span="14"
                        class="issue_read_col"
                      >
                        <!-- 后台未返回头像地址 暂时用个默认的 -->
                        <img
                          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                          alt=""
                        />
                        <p>{{ v.userName }}</p>
                      </el-col>
                      <el-col
                        v-if="v.checkFlag == 1"
                        :span="10"
                        class="issue_read_col"
                      >
                        <p>{{ v.checkTime }}</p>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="issue_unread">
                    <h3>
                      未读&nbsp;{{
                        ruleForm.sendUserList.filter((v) => {
                          return v.checkFlag == 0
                        }).length
                      }}
                    </h3>
                    <el-row
                      v-for="(v, index) of ruleForm.sendUserList"
                      :key="index"
                    >
                      <el-col
                        v-if="v.checkFlag == 0"
                        :span="24"
                        class="issue_read_col"
                      >
                        <img
                          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                          alt=""
                        />
                        <p>{{ v.userName }}</p>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </m-dialog>
        </main-box>
      </el-tab-pane>
      <el-tab-pane label="我发出的" name="inside">
        <issue></issue>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getidbusNotice,getlistRcvByPage } from '@/api/gateway/journalism.js'
import issue from './issue.vue'
import { getToken } from '@/utils/auth'
import store from '@/store/index.js'
export default {
  components: {
    issue
  },
  data() {
    return {
      activeName: 'reptile',
      active: 'first',
      datalist: [
        {
          name: 'asdasasd',
          time: '2021-05-05  12:23:23',
          imgurl: 'logotitle.ico'
        },
        {
          name: 'wanwan',
          time: '2021-05-20  12:23:23',
          imgurl: 'logotitle.ico'
        }
      ],
      // 筛选栏
      searchCol: [
        {
          label: '通知标题',
          propVal: 'title'
        }
      ],
      // 请求参数
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        noticeType: 2,
        title: ''
      },
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
      },
      filelist: [],
      // 新增表单
      ruleForm: {
        noticeFiles: []
      },
      formRules: {
        title: [{ required: true, message: '请填写通知标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请填写正文', trigger: 'blur' }
        ]
      },
      total: 0,
      dialogloading: false,
      tableloading: false,

      dialogType: 'get',
      dialogVisible: false,
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 列表查询
    async getList(demand) {
      console.log(demand)
      this.tableloading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        this.pageForm.noticeType = 2
        res = await getlistRcvByPage(this.pageForm)
      } else {
        res = await getlistRcvByPage(this.pageForm)
      }
      this.tableData = res.list
      this.total = res.total
      this.tableloading = false
    },
    handleClick(tab) {
      console.log(tab)
      if (tab.name == 'reptile') {
        this.getList()
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    },
    // 点击文件列表下载
    async uploadFilePreview(file) {
      console.log(file)
      let download =
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction //下载地址
      let fileDowloadName =
        download +
        `/fs/download?name=${encodeURI(
          encodeURI(file.response ? file.response.body.fileName : file.fileName)
        )}&path=${file.response ? file.response.body.url : file.filePath}`
      location.href = fileDowloadName
    },
    // 查看
    async handleSee(v) {
      this.dialogloading = true
      this.dialogType = 'get'
      let res = await getidbusNotice(v.noticeId)
      this.ruleForm = res
      this.filelist = JSON.parse(JSON.stringify(res.noticeFiles))
      for (let v of this.filelist) {
        v.name = v.fileName
      }
      this.dialogloading = false
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container /deep/ {
  margin: 0px 20px;
  background-color: #fff;
  height: calc(100vh - 185px);
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .mainBox .mbody {
    height: calc(100vh - 277px);
  }
  .mainBox .mfooter {
    bottom: -10px;
  }
}
.issue {
  width: 100%;
  display: flex;
  min-height: 30vh;
}
.issue > div {
  width: 50%;
}
.issue_read {
  border-right: 1px solid #99999999;
}
.issue_read > h3 {
  color: #009b4c;
}
.issue_unread > h3 {
  color: #ff0600;
}
.issue_unread {
  margin-left: 0.5rem;
}
.issue_read_col {
  display: flex;
  color: #7c7c7c;
  align-items: center;
  height: 2rem;
  margin: 0.4rem 0;
}
.issue_read_col > img {
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
}
</style>
