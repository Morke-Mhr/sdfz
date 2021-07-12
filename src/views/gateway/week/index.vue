<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
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
    </m-table>
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
    ></m-pagin>
    <m-dialog
      :title="
          dialogType === 'get'
          ? '查看周历'
          : '新增周历'
      "
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      v-loading="dialogloading"
      :dialogBtnArr="dialogType == 'get' ? [] : czArr"
    >
      <el-form
        :model="ruleForm"
        :rules="formRules"
        ref="operationFome"
        label-width="120px"
      >
        <el-form-item label="周历标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
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
            <el-button v-show="dialogType != 'get'" size="small" icon="el-icon-plus"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>
<script>
import {
  getbusNotice,
  postbusNotice,
  getidbusNotice,
  delbusNotice
} from '@/api/gateway/journalism.js'

import { getToken } from '@/utils/auth'
import store from '@/store/index.js'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
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
      // 筛选栏
      searchCol: [
        {
          label: '周历标题',
          propVal: 'title'
        }
      ],
      // 请求参数
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        noticeType: 3,
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
        title: [{ required: true, message: '请填写周历标题', trigger: 'blur' }],
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
      // 表格上方按钮
      tableBtnArr: [
        { label: '新增', eventName: 'handleAdd', has: 'system:user:add' }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '周历标题',
          propVal: 'title'
        },
        {
          label: '发布人',
          propVal: 'publisher'
        },
        {
          label: '发布时间',
          propVal: 'createTime'
        },
        // { 后台暂时没给
        //   label: '已读',
        //   propVal: 'source'
        // }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '查看详情', eventName: 'handleSee', has: 'system:user:resetPwd' },
        { label: '撤回', eventName: 'handleDelete', has: 'system:user:remove' }
      ],
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
   components: {
      quillEditor
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
        this.pageForm.noticeType = 3
        res = await getbusNotice(this.pageForm)
      } else {
        res = await getbusNotice(this.pageForm)
      }
      this.tableData = res.rows
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
    // 确定按钮
    confirm() {
      // 表单验证
      this.$refs['operationFome'].validate(async valid => {
        if (valid) {
          // 新增
          this.ruleForm.noticeType = 3
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
    uploadFileSuccess(response, file, ) {
      console.log(response, file)
      if (response.code == 200) {
        let obj = {}
        obj.filePath = response.body.url
        obj.fileName = response.body.fileName
        this.ruleForm.noticeFiles.push(obj)
      }
    },
    uploadFileError(err, file, ) {
      this.$message.error('网络繁忙，请稍后再试！')
      console.log(err, file)
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
      this.$confirm('确定撤回此周历吗?', '撤回周历', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delbusNotice(v.noticeId)
          this.getList()
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
