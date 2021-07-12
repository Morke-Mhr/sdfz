<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ statusData }"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @editor="editorFun"
      @handleDelete="handleDelete"
      @workbenchAdd="workbenchAdd"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isIndex="true"
      :operationArr="operationArr"
      :wCaozuo="150"
    ></m-table>
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
    ></m-pagin>

    <m-dialog
      :title="workbenchTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
    >
      <el-form
        :model="workbenchFome"
        ref="workbenchFome"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="模块名称" prop="name">
          <el-input
            v-model="workbenchFome.name"
            maxlength="10"
            show-word-limit
            placeholder="请输入模块名称"
          />
        </el-form-item>
        <el-form-item label="上传封面" prop="iconAdd">
          <el-upload
            :class="
              workbenchFome.iconAdd
                ? 'avatar-uploader hasImage'
                : 'avatar-uploader'
            "
            style="float:left"
            :action="upload.url"
            :headers="upload.headers"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png, .gif, .bmp"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <img
              style="float:left"
              v-if="workbenchFome.iconAdd"
              :src="workbenchFome.iconAdd | showImg"
              class="avatar"
            />
            <template v-else>
              <div class="uploadIcon">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <span class="el-upload__text">上传封面</span>
              </div>
            </template>
          </el-upload>
          <div class="uploadTxt">
            <p>建议尺寸：4:3</p>
            <p>建议格式：jpg、jpeg、gif、png、bmp</p>
          </div>
        </el-form-item>
        <el-form-item label="模块地址" prop="url">
          <el-input
            v-model="workbenchFome.url"
            placeholder="请输入模块地址，例:https://"
          />
        </el-form-item>
        <el-form-item label="排序" prop="displayOrder">
          <el-input
            v-model.number="workbenchFome.displayOrder"
            maxlength="3"
            show-word-limit
            placeholder="请输入排列序号"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import { getToken } from '@/utils/auth'
import store from '@/store/index.js'
import {
  workbenchAdd,
  workbenchDel,
  workbenchFix,
  workbench,
  workbenchList
} from '@/api/workRegulate/index'

export default {
  data() {
    return {
      // 校验规则
      rules: {
        name: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: ['blur', 'change']
          }
        ],
        iconAdd: [
          { required: true, message: '请上传封面', trigger: ['blur', 'change'] }
        ],
        url: [
          {
            required: true,
            message: '请输入模块地址',
            trigger: ['blur', 'change']
          }
        ],
        displayOrder: [
          {
            required: true,
            message: '请输入排列序号',
            trigger: ['blur', 'change']
          }
        ]
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
      // 部门数据
      statusData: [
        {
          label: '显示',
          value: '1'
        },
        {
          label: '隐藏',
          value: '2'
        }
      ],
      // 筛选栏
      searchCol: [
        {
          label: '模块',
          propVal: 'name'
        },
        {
          label: '模块状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusData'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'workbenchAdd'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '模块名称',
          propVal: 'name'
        },
        {
          label: '模块状态',
          propVal: 'displayStatus'
        },
        {
          label: '排序',
          propVal: 'displayOrder'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '修改', eventName: 'editor' },
        {
          label: '删除',
          eventName: 'handleDelete'
        }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        name: ''
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 100,
      // 弹窗标题
      workbenchTitle: '修改模块',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '提交', eventName: 'confirm' }],
      workbenchFome: {
        name: '',
        iconAdd: '',
        url: '',
        displayOrder: '',
        displayStatus: '1'
      }
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
        res = await workbenchList(demand)
      } else {
        res = await workbenchList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 模块新增
    workbenchAdd() {
      this.workbenchTitle = '新增模块'
      this.workbenchFome = {
        name: '',
        iconAdd: '',
        url: '',
        displayOrder: '',
        displayStatus: '0'
      }
      this.dialogVisible = true
    },
    // 修改
    async editorFun(scoped) {
      console.log(scoped)
      this.workbenchTitle = '修改模块'
      this.workbenchFome = await workbench(scoped.workbenchId)
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.workbenchFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          if (this.workbenchTitle == '新增模块') {
            await workbenchAdd(this.workbenchFome)
          } else if (this.workbenchTitle == '修改模块') {
            await workbenchFix(this.workbenchFome)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    // 删除
    handleDelete(scope) {
      let row = scope ? scope : null
      this.$confirm('该模块下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await workbenchDel(row.workbenchId)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    },
    // 上传前
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('单个附件最大不可超过5M!')
      }
      return isLt5M
    },
    // 上传成功
    uploadSuccess(response) {
      this.$set(this.workbenchFome, 'iconAdd', response.body.url)
      this.$forceUpdate()
    }
  },
  created() {
    this.getList()
  }
}
</script>
