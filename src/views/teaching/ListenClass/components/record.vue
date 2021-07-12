<template>
  <main-box>
    <filter-box
      :searchCol="searchCol"
      @searchFun="getList"
      :optionObj="{ semesterList, classTypeList, subjectList }"
      :pageConfig="{ pageSize: pageForm.pageSize }"
      slot="mheader"
    ></filter-box>
    <m-table
      slot="mbody"
      @zipDownloadFun="zipDownloadFun"
      @busListenClassAdd="busListenClassAdd"
      @handleDelete="handleDelete"
      @editor="editorFun"
      @fansi="fansiFun"
      @details="detailsFun"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isIndex="true"
      :operationArr="operationArr"
      :wCaozuo="300"
      tableHeight="calc(100vh - 452px)"
      v-loading="tableloading"
    ></m-table>
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
    ></m-pagin>
    <!-- 新增修改弹窗开始 -->
    <m-dialog
      :title="busListenClassTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
    >
      <el-form
        :model="busListenClassFome"
        ref="busListenClassFome"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="听评课标题" prop="title">
          <el-input
            v-model="busListenClassFome.title"
            maxlength="40"
            show-word-limit
            placeholder="请输入听评课标题"
          />
        </el-form-item>
        <el-form-item label="授课教师" prop="userId">
          <el-select
            v-model="busListenClassFome.userId"
            placeholder="请选择授课教师"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.userId"
              :label="item.name"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="听评课类型" prop="listenClassTypeId">
          <el-select
            v-model="busListenClassFome.listenClassTypeId"
            placeholder="请选择听评课类型"
          >
            <el-option
              v-for="item in classTypeList"
              :key="item.listenClassTypeId"
              :label="item.name"
              :value="item.listenClassTypeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学科" prop="subjectId">
          <el-select
            v-model="busListenClassFome.subjectId"
            placeholder="请选择所属学科"
          >
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.name"
              :value="item.subjectId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="听评课时间" prop="time">
          <el-date-picker
            v-model="busListenClassFome.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授课班级" prop="classId">
          <el-select
            v-model="busListenClassFome.classId"
            placeholder="请选择授课班级"
          >
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价方案" prop="schemeId">
          <el-select
            v-model="busListenClassFome.schemeId"
            placeholder="请选择评价方案"
          >
            <el-option
              v-for="item in busScheme"
              :key="item.schemeId"
              :label="item.name"
              :value="item.schemeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课教案" prop="fileList1">
          <el-upload
            class="upload-demo"
            multiple
            accept="docx, .doc, .pdf, .pptx, .ppt"
            :limit="1"
            :file-list="busListenClassFome.fileList1"
            :action="upload.url"
            :headers="upload.headers"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :on-remove="
              (file, fileList) => {
                uploadRemove(file, fileList, 1)
              }
            "
            :on-success="
              (res, file, fileList) => {
                uploadSuccess(res, file, fileList, 1)
              }
            "
          >
            <el-button class="uploadBtn">+教案上传</el-button>
            <span slot="tip" class="upload-tip">
              建议格式：docx，.doc，.pdf，.pptx，.ppt
            </span>
          </el-upload>
        </el-form-item>
        <el-form-item label="授课课件" prop="fileList2">
          <el-upload
            class="upload-demo"
            multiple
            accept="docx, .doc, .pdf, .pptx, .ppt"
            :limit="1"
            :file-list="busListenClassFome.fileList2"
            :action="upload.url"
            :headers="upload.headers"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :on-remove="
              (file, fileList) => {
                uploadRemove(file, fileList, 2)
              }
            "
            :on-success="
              (res, file, fileList) => {
                uploadSuccess(res, file, fileList, 2)
              }
            "
          >
            <el-button class="uploadBtn">+课件上传</el-button>
            <span slot="tip" class="upload-tip">
              建议格式：docx，.doc，.pdf，.pptx，.ppt
            </span>
          </el-upload>
        </el-form-item>
        <el-form-item label="其他附件" prop="fileList3">
          <el-upload
            class="upload-demo"
            multiple
            accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .bmp, .rar, .pdf, .txt"
            :limit="5"
            :file-list="busListenClassFome.fileList3"
            :action="upload.url"
            :headers="upload.headers"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :on-remove="
              (file, fileList) => {
                uploadRemove(file, fileList, 3)
              }
            "
            :on-success="
              (res, file, fileList) => {
                uploadSuccess(res, file, fileList, 3)
              }
            "
          >
            <el-button class="uploadBtn">+附件上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="授课说明" prop="instruction">
          <el-input
            v-model="busListenClassFome.instruction"
            type="textarea"
            :autosize="{ minRows: 2 }"
            maxlength="200"
            show-word-limit
            placeholder="请输入授课说明"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
    <!-- 新增修改弹窗结束 -->

    <!-- 反思弹窗开始 -->
    <m-dialog
      title="反思"
      :visible.sync="fansiVisible"
      @closeFun="fansiVisible = false"
      @sfConfirm="sfConfirm"
      :dialogBtnArr="fsDialogBtn"
    >
      <el-form :model="fsFome" ref="fsFome" label-width="80px" :rules="rules">
        <el-form-item label="正文" prop="reflect">
          <el-input
            v-model="fsFome.reflect"
            type="textarea"
            :autosize="{ minRows: 2 }"
            maxlength="2000"
            show-word-limit
            placeholder="请输入您的描述"
          />
        </el-form-item>
        <el-form-item label="其他附件" prop="listenClassFiles">
          <el-upload
            class="upload-demo"
            multiple
            accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .bmp, .rar, .pdf, .txt"
            :limit="5"
            :file-list="fsFome.listenClassFiles"
            :action="upload.url"
            :headers="upload.headers"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :on-remove="
              (file, fileList) => {
                uploadRemove(file, fileList, 4)
              }
            "
            :on-success="
              (res, file, fileList) => {
                uploadSuccess(res, file, fileList, 4)
              }
            "
          >
            <el-button class="uploadBtn">+附件上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </m-dialog>
    <!-- 反思弹窗结束 -->

    <!-- 查看详情弹窗开始 -->
    <m-dialog
      title="查看听评课记录"
      :visible.sync="detailVisible"
      @closeFun="detailVisible = false"
      class="tabsDialog"
    >
      <tpkDetails :detailsData="detailsData"></tpkDetails>
    </m-dialog>
    <!-- 查看详情弹窗结束 -->
  </main-box>
</template>

<script>
import {
  busListenClassAdd,
  busListenClassDel,
  busListenClassFix,
  busListenClass,
  busListenClassList,
  queryTeacherList,
  querySemesterList,
  queryClassTypeList,
  querySubjectList,
  queryClassList,
  queryBusScheme,
  zipDownload,
  reThink
} from '@/api/teaching/ListenClass/record'
import { getToken } from '@/utils/auth'
import store from '@/store/index.js'
import tpkDetails from '../components/tpkDetails.vue'

export default {
  name: 'record',
  components: { tpkDetails },
  data() {
    return {
      // 校验规则
      rules: {
        title: [
          { required: true, message: '请输入听评课标题', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请选择授课教师', trigger: 'blur' }
        ],
        listenClassTypeId: [
          { required: true, message: '请选择听评课类型', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择所属学科', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请选择完整时间', trigger: 'change' }
        ],
        classId: [
          { required: true, message: '请选择授课班级', trigger: 'change' }
        ],
        schemeId: [
          { required: true, message: '请选择评价方案', trigger: 'change' }
        ],
        fileList1: [
          { required: true, message: '请上传授课教案', trigger: 'change' }
        ],
        fileList2: [
          { required: true, message: '请上传授课课件', trigger: 'change' }
        ],
        fileList3: [
          { required: true, message: '请上传对应文件', trigger: 'change' }
        ],
        reflect: [
          { required: true, message: '请输入您的描述', trigger: 'blur' }
        ]
      },
      // 加载状态
      tableloading: false,
      // 教师列表
      teacherList: [],
      // 学期列表
      semesterList: [],
      // 听评课类型列表
      classTypeList: [],
      // 学科列表
      subjectList: [],
      // 班级列表
      classList: [],
      // 评价方案列表
      busScheme: [],
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
      // 筛选栏
      searchCol: [
        {
          label: '学期',
          propVal: 'semesterId',
          type: 'select',
          optionBd: { label: 'name', value: 'semesterId' },
          optionsIdx: 'semesterList'
        },
        {
          label: '听课标题',
          propVal: 'title'
        },
        {
          label: '授课教师',
          propVal: 'userName'
        },
        {
          label: '听评课类型',
          propVal: 'listenClassTypeId',
          type: 'select',
          optionBd: { label: 'name', value: 'listenClassTypeId' },
          optionsIdx: 'classTypeList'
        },
        {
          label: '学科',
          propVal: 'subjectId',
          type: 'select',
          optionBd: { label: 'name', value: 'subjectId' },
          optionsIdx: 'subjectList'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'busListenClassAdd'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '学期',
          propVal: 'semesterName'
        },
        {
          label: '听评课标题',
          propVal: 'title'
        },
        {
          label: '授课老师',
          propVal: 'userName',
          width: '120'
        },
        {
          label: '听评课类型',
          propVal: 'listenClassTypeName'
        },
        {
          label: '所属学科',
          propVal: 'subjectName'
        },
        {
          label: '听课时间',
          propVal: 'mergeTime',
          width: '220'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '查看详情', eventName: 'details' },
        { label: '下载资源包', eventName: 'zipDownloadFun' },
        { label: '反思', eventName: 'fansi' },
        { label: '修改', eventName: 'editor' },
        {
          label: '删除',
          eventName: 'handleDelete'
        }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        semesterId: '',
        title: '',
        userName: '',
        listenClassTypeId: '',
        subjectId: ''
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 100,
      // 弹窗标题
      busListenClassTitle: '修改听评课',
      // 弹窗显示控制
      dialogVisible: false,
      // 反思弹窗显示控制
      fansiVisible: false,
      // 查看详情弹窗显示控制
      detailVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      fsDialogBtn: [{ btnName: '保存', eventName: 'sfConfirm' }],
      busListenClassFome: {
        title: '',
        userId: '',
        listenClassTypeId: '',
        subjectId: '',
        time: [],
        classId: '',
        schemeId: '',
        fileList1: [],
        fileList2: [],
        fileList3: [],
        instruction: ''
      },
      fsFome: {
        reflect: '',
        listenClassFiles: []
      },
      // 当前所选详情数据
      detailsData: {}
    }
  },
  methods: {
    // 获取表格数据
    async getList(demand) {
      this.listLoading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await busListenClassList(demand)
      } else {
        res = await busListenClassList(this.pageForm)
      }
      this.tableData = res.list
      this.total = res.total
      this.listLoading = false
    },
    // 听评课新增
    busListenClassAdd() {
      this.busListenClassTitle = '新增听评课'
      this.busListenClassFome = {}
      this.dialogVisible = true
    },
    // 修改
    async editorFun(scoped) {
      this.busListenClassTitle = '修改听评课'
      this.busListenClassFome = await busListenClass(scoped.listenClassId)
      this.busListenClassFome.time = [
        this.busListenClassFome.startTime,
        this.busListenClassFome.endTime
      ]
      this.busListenClassFome.fileList1 = []
      this.busListenClassFome.fileList2 = []
      this.busListenClassFome.fileList3 = []
      this.busListenClassFome.listenClassFiles.forEach((item) => {
        item.name = item.fileName
        if (item.fileType == 1) {
          console.log(item.fileType)
          this.busListenClassFome.fileList1.push(item)
        } else if (item.fileType == 2) {
          this.busListenClassFome.fileList2.push(item)
        } else if (item.fileType == 3) {
          this.busListenClassFome.fileList3.push(item)
        }
      })
      this.dialogVisible = true
    },
    // 反思
    fansiFun(scope) {
      this.fsFome = {
        listenClassId: scope.listenClassId,
        reflect: '',
        listenClassFiles: []
      }
      this.fansiVisible = true
    },
    // 查看详情
    async detailsFun(scoped) {
      this.detailsData = await busListenClass(scoped.listenClassId)
      this.detailVisible = true
    },
    async confirm() {
      this.$refs.busListenClassFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          console.log(this.busListenClassFome, 999)
          let needFiles = [
            ...this.busListenClassFome.fileList1,
            ...this.busListenClassFome.fileList2,
            ...this.busListenClassFome.fileList3
          ].map((item) => {
            return {
              fileType: item.fileType,
              fileName: item.fileName,
              filePath: item.filePath
            }
          })
          let reqData = {
            listenClassId: this.busListenClassFome.listenClassId
              ? this.busListenClassFome.listenClassId
              : '',
            title: this.busListenClassFome.title,
            userId: this.busListenClassFome.userId,
            listenClassTypeId: this.busListenClassFome.listenClassTypeId,
            subjectId: this.busListenClassFome.subjectId,
            classId: this.busListenClassFome.classId,
            schemeId: this.busListenClassFome.schemeId,
            instruction: this.busListenClassFome.instruction,
            listenClassFiles: needFiles,
            startTime: this.busListenClassFome.time[0],
            endTime: this.busListenClassFome.time[1]
          }
          console.log(reqData, 'reqData')
          if (this.busListenClassTitle == '新增听评课') {
            await busListenClassAdd(reqData)
          } else if (this.busListenClassTitle == '修改听评课') {
            await busListenClassFix(reqData)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    // 反思提交
    sfConfirm() {
      this.$refs.fsFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          let needFiles = this.fsFome.listenClassFiles.map((item) => {
            return {
              fileType: item.fileType,
              fileName: item.fileName,
              filePath: item.filePath
            }
          })
          await reThink({
            listenClassId: this.fsFome.listenClassId,
            reflect: this.fsFome.reflect,
            listenClassFiles: needFiles
          })
          this.fansiVisible = false
          this.getList()
        }
      })
    },
    // 删除
    handleDelete(scope) {
      let row = scope ? scope : null
      this.$confirm('该听评课下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await busListenClassDel(row.listenClassId)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 下载资源包
    async zipDownloadFun(scope) {
      this.tableloading = true
      await zipDownload({ listenClassId: scope.listenClassId })
      this.tableloading = false
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    },
    handlePreview(file) {
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
    // 上传前校验
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('单个附件最大不可超过5M!')
      }
      return isLt5M
    },
    uploadRemove(file, fileList, fileType) {
      console.log(file, fileList, 9999999)
      let fileArr = fileList.map((item) => {
        if (item.response) {
          return {
            fileType,
            name: item.name,
            fileName: item.response.body.fileName,
            filePath: item.response.body.url
          }
        } else {
          return item
        }
      })
      if (fileType == 1) {
        this.$set(this.busListenClassFome, 'fileList1', fileArr)
      } else if (fileType == 2) {
        this.$set(this.busListenClassFome, 'fileList2', fileArr)
      } else if (fileType == 3) {
        this.$set(this.busListenClassFome, 'fileList3', fileArr)
      } else if (fileType == 4) {
        this.$set(this.fsFome, 'listenClassFiles', fileArr)
      }
    },
    // 上传成功
    uploadSuccess(res, file, fileList, fileType) {
      console.log(fileList, 666)
      let fileArr = fileList.map((item) => {
        if (item.response) {
          return {
            fileType,
            name: item.name,
            fileName: item.response.body.fileName,
            filePath: item.response.body.url
          }
        } else {
          return item
        }
      })
      if (fileType == 1) {
        this.$set(this.busListenClassFome, 'fileList1', fileArr)
      } else if (fileType == 2) {
        this.$set(this.busListenClassFome, 'fileList2', fileArr)
      } else if (fileType == 3) {
        this.$set(this.busListenClassFome, 'fileList3', fileArr)
      } else if (fileType == 4) {
        this.$set(this.fsFome, 'listenClassFiles', fileArr)
      }
    }
  },
  async created() {
    this.getList()
    this.teacherList = await queryTeacherList()
    this.semesterList = await querySemesterList()
    this.classTypeList = await queryClassTypeList()
    this.subjectList = await querySubjectList()
    this.classList = await queryClassList()
    this.busScheme = await queryBusScheme()
  }
}
</script>

<style lang="" scoped></style>
