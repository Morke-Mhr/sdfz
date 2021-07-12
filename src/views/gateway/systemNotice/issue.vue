<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <!-- <m-table
      slot="mbody"
      @handleAdd="handleAdd"
      @handleSee="handleSee"
      @handleDelete="handleDelete"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :operationArr="operationArr"
      :wCaozuo="300"
      :isIndex="true"
      v-loading="tableloading"
    >
    </m-table> -->
    <div class="mTable" slot="mbody">
      <div class="tableBtn">
        <template>
          <el-button @click="handleAdd()">新增</el-button>
        </template>
      </div>
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
            <el-button type="text" @click="handleDelete(scope.row)"
              >撤回</el-button
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
      :title="dialogType === 'get' ? '查看通知' : '新增通知'"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      v-if="dialogVisible"
      v-loading="dialogloading"
      :dialogBtnArr="dialogType == 'get' ? [] : czArr"
    >
      <!-- 查看 -->
      <el-tabs v-model="activeName" v-if="dialogType == 'get'">
        <el-tab-pane label="详情" name="first">
          <el-form :model="ruleForm" ref="operationFome" label-width="120px">
            <el-form-item label="通知标题">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="发布人">
              <el-input v-model="ruleForm.publisher"></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-input v-model="ruleForm.createTime"></el-input>
            </el-form-item>
            <el-form-item label="推送范围">
              <div>
                <span>{{ ruleForm.sendUserList.length }}人</span>
              </div>
            </el-form-item>
            <el-form-item label="正文">
              <quill-editor 
                  ref="viewTextEditor" 
                  :options="editorOption"
                  v-model="ruleForm.content" 
                >
              </quill-editor>
            </el-form-item>
            <el-form-item label="附件">
              <el-upload
                ref="upload"
                class="upload-demo"
                :on-error="uploadFileError"
                :on-success="uploadFileSuccess"
                :on-remove="uploadFileRemove"
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
              <el-row v-for="(v, index) of ruleForm.sendUserList" :key="index">
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
              <el-row v-for="(v, index) of ruleForm.sendUserList" :key="index">
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
      <!-- 新增 -->
      <el-form
        v-else
        :model="ruleForm"
        :rules="formRules"
        ref="operationFome"
        label-width="120px"
      >
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="推送范围" prop="sendUserList">
          <el-button
            icon="el-icon-plus"
            v-if="!ruleForm.sendUserList"
            @click="range"
            >范围选择</el-button
          >
          <div v-else>
            <span>{{ ruleForm.sendUserList.length }}人</span>
            <el-button type="text" @click="range">修改</el-button>
          </div>
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <quill-editor 
                  ref="viewTextEditor" 
                  :options="editorOption"
                  v-model="ruleForm.content" 
                >
          </quill-editor>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            ref="upload"
            class="upload-demo"
            :on-error="uploadFileError"
            :on-success="uploadFileSuccess"
            :on-remove="uploadFileRemove"
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
    </m-dialog>
    <rangePeople
      ref="rangePeople"
      v-if="dialogVisible"
      @choiceUser="choiceUser"
      :treedata="treedata"
      :treeProps="treeProps"
    ></rangePeople>
  </main-box>
</template>
<script>
import {
  getlistByPage2,
  postbusNotice,
  getidbusNotice,
  delbusNotice
} from '@/api/gateway/journalism.js'
import {
  getqueryTeacherList,
  getqueryStudentParent
} from '@/api/comment/index.js'
import rangePeople from '@/components/rangePeople' //通过部门选择人
import { getToken } from '@/utils/auth'
import store from '@/store/index.js'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor,
    rangePeople
  },
  data() {
    return {
      editorOption: {
        modules:{
           toolbar:[
             ['bold', 'italic', 'underline'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['image'],
            ['clean']
           ]
          },
          placeholder: '编辑文本内容'
        },
      activeName: 'first',
      datalist: [],

      treeProps: {
        // 子数据
        children: 'children',
        // 唯一标识
        id: 'id',
        // 名称
        label: 'label'
      },
      // 部门树形
      treedata: [],
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
        sendUserList: [
          {
            type: 'array',
            required: true,
            message: '请选择推送范围',
            trigger: 'change'
          }
        ],
        content: [
          { required: true, message: '请填写正文', trigger: 'blur' }
        ]
      },
      total: 0,
      dialogloading: false,
      tableloading: false,
      czArr: [{ btnName: '保存', eventName: 'confirm' }],
      dialogType: 'add',
      dialogVisible: false,
      tableData: []
    }
  },
  mounted() {
    this.getList()
    this.getqueryTeacherList()
  },
  methods: {
    // 部门树形
    async getqueryTeacherList() {
      //  教师
      let Student = await getqueryStudentParent()
      // 学生
      let Teacher = await getqueryTeacherList()
      this.treedata = [...Student, ...Teacher]
    },
    // 列表查询
    async getList(demand) {
      console.log(demand)
      this.tableloading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        this.pageForm.noticeType = 2
        res = await getlistByPage2(this.pageForm)
      } else {
        res = await getlistByPage2(this.pageForm)
      }
      this.tableData = res.list
      this.total = res.total
      this.tableloading = false
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
    // 新增按钮
    handleAdd() {
      this.dialogloading = true
      this.dialogType = 'add'
      this.ruleForm = {
        noticeFiles: []
      }
      this.filelist = []
      this.dialogVisible = true
      this.dialogloading = false
    },
    // 范围选择
    range() {
      this.$refs.rangePeople.isShow = true
    },
    choiceUser(data) {
      // 选择人员数组
      console.log(data)
      let datalist = []
      for (let v of data) {
        let obj = {}
        obj.userId = v.id
        obj.userName = v.label
        datalist.push(obj)
      }
      this.$set(this.ruleForm, 'sendUserList', datalist)
      this.$refs.operationFome.validateField('sendUserList')
      this.$refs.rangePeople.isShow = false
    },
    // 确定按钮
    confirm() {
      // 表单验证
      this.$refs['operationFome'].validate(async (valid) => {
        if (valid) {
          // 新增
          this.ruleForm.noticeType = 2
          await postbusNotice(this.ruleForm)
          this.dialogVisible = false
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传
    uploadFileSuccess(response, file) {
      console.log(response, file)
      if (response.code == 200) {
        let obj = {}
        obj.filePath = response.body.url
        obj.fileName = response.body.fileName
        this.ruleForm.noticeFiles.push(obj)
      }
    },
    uploadFileError(err, file) {
      this.$message.error('网络繁忙，请稍后再试！')
      console.log(err, file)
    },
    // 点击文件列表下载
    async uploadFilePreview(file) {
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
    // 文件列表移除文件时的钩子
    uploadFileRemove(file, fileList) {
      console.log(file, fileList)
      for (let v in this.ruleForm.noticeFiles) {
        if (
          this.ruleForm.noticeFiles[v].filePath ==
          (file.response ? file.response.body.url : file.filePath)
        ) {
          this.ruleForm.noticeFiles.splice(v, 1)
        }
      }
      console.log(this.ruleForm.noticeFiles)
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
    },
    // 撤回
    async handleDelete(v) {
      this.$confirm('确定撤回此通知吗?', '撤回通知', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delbusNotice(v.noticeId)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
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
