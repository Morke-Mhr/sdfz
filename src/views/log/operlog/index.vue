<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ businessTypeArr, statusArr }"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @handleSee="handleSee"
      @handleClean="handleClean"
      @handleDelete="handleDelete"
      @getSelectData="getSelectData"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isSelection="true"
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
      title="查看详情"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
    >
      <el-form
        :model="operlog"
        ref="operationFome"
        label-width="80px"
      >
        <el-form-item label="模块标题" prop="title">
          <el-input
            v-model="operlog.title"
            maxlength="30"
            disabled="disabled"
            placeholder="模块标题"
          />
        </el-form-item>
        <el-form-item label="操作人员" prop="operName">
          <el-input
            v-model="operlog.operName"
            maxlength="30"
            disabled="disabled"
            placeholder="操作人员"
          />
        </el-form-item>
        <el-form-item label="操作地点" prop="operLocation">
          <el-input
            v-model="operlog.operLocation"
            maxlength="30"
            disabled="disabled"
            placeholder="操作地点"
          />
        </el-form-item>
        <el-form-item label="操作时间" prop="operTime">
          <el-input
            v-model="operlog.operTime"
            maxlength="30"
            disabled="disabled"
            placeholder="操作时间"
          />
        </el-form-item>
        <el-form-item label="主机地址" prop="operIp">
          <el-input
            v-model="operlog.operIp"
            maxlength="30"
            disabled="disabled"
            placeholder="主机地址"
          />
        </el-form-item>
        <el-form-item label="请求URL" prop="operUrl">
          <el-input
            v-model="operlog.operUrl"
            maxlength="30"
            disabled="disabled"
            placeholder="请求URL"
          />
        </el-form-item>
        <el-form-item label="请求参数" prop="operParam">
          <el-input
            v-model="operlog.operParam"
            maxlength="30"
            disabled="disabled"
            placeholder="请求参数"
          />
        </el-form-item>
        <el-form-item label="请求方式" prop="requestMethod">
          <el-input
            v-model="operlog.requestMethod"
            maxlength="30"
            disabled="disabled"
            placeholder="请求方式"
          />
        </el-form-item>
        <el-form-item label="方法名称" prop="method">
          <el-input
            v-model="operlog.method"
            maxlength="30"
            disabled="disabled"
            placeholder="方法名称"
          />
        </el-form-item>

        <el-form-item label="返回参数">
          <el-input
            v-model="operlog.jsonResult"
            disabled="disabled"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="用户描述"
          />
        </el-form-item>

        <el-form-item label="错误消息" prop="errorMsg">
          <el-input
            v-model="operlog.errorMsg"
            maxlength="30"
            disabled="disabled"
          />
        </el-form-item>

        <el-form-item label="操作状态" prop="businessType">
          <el-radio-group v-model="operlog.businessType">
            <el-radio disabled :label="0">其他</el-radio>
            <el-radio disabled :label="1">新增</el-radio>
            <el-radio disabled :label="2">修改</el-radio>
            <el-radio disabled :label="3">删除</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="操作状态" prop="status">
          <el-radio-group v-model="operlog.status">
            <el-radio disabled :label="0">正常</el-radio>
            <el-radio disabled :label="1">异常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  getOperLogList,
  cleanOperLog,
  deleteOperLog,
  getOperLogInfo
} from '@/api/system/operLog.js'

const MODULE_NAME = '操作日志'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:operlog:remove',
        see: 'system:operlog:see',
        query: 'system:operlog:query',
        add: 'system:operlog:add',
        edit: 'system:operlog:edit'
      },
      statusArr: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
      businessTypeArr: [
        { label: '其它', value: '0' },
        { label: '新增', value: '1' },
        { label: '修改', value: '2' },
        { label: '删除', value: '3' }
      ],
      // 筛选栏
      searchCol: [
        {
          label: '模块标题',
          propVal: 'title'
        },
        {
          label: '操作人员',
          propVal: 'operName'
        },
        {
          label: '业务类型',
          propVal: 'businessType',
          type: 'select',
          optionsIdx: 'businessTypeArr'
        },
        {
          label: '操作状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusArr'
        },
        {
          label: '日期范围',
          propVal: ['beginTime', 'endTime'],
          type: 'datePicker',
          dataType: 'daterange',
          valFormat: 'yyyy-MM-dd'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '删除日志',
          eventName: 'handleDelete',
          has: 'system:operlog:remove'
        },
        {
          label: '清空日志',
          eventName: 'handleClean',
          has: 'system:operlog:remove'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '操作人员',
          propVal: 'operName'
        },
        {
          label: '操作地点',
          propVal: 'operLocation'
        },
        {
          label: '模块标题',
          propVal: 'title'
        },
        {
          label: '业务类型',
          propVal: 'businessType'
        },
        {
          label: '操作状态',
          propVal: 'status',
          atFilter: 'logStatus'
        },
        {
          label: '操作时间',
          propVal: 'operTime'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '查看', eventName: 'handleSee', has: 'system:operlog:query' },
        {
          label: '删除',
          eventName: 'handleDelete',
          has: 'system:operlog:remove'
        }
      ],
      dateList: [],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        operName: '',

        businessType: '',
        status: '',
        beginTime: '',
        endTime: ''
      },
      operlog: {},
      dialogVisible: false,
      multipleSelection: [],
      tableData: [],
      tableKey: 0,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      listLoading: false
    }
  },
  computed: {},
  created: function() {
    this.getList()
  },
  methods: {
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.operId
      })
    },
    handleClean() {
      this.$confirm('确定清空' + MODULE_NAME + '吗?', '清空' + MODULE_NAME, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await cleanOperLog()
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的' + MODULE_NAME + '!'
        })
        return
      }
      let row = scope ? scope : null
      this.$confirm('确定删除' + MODULE_NAME + '吗?', '删除' + MODULE_NAME, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteOperLog(row ? row.operId : this.multipleSelection)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async handleSee(scope) {
      let operId = scope.operId
      this.operlog = await getOperLogInfo(operId)
      this.dialogVisible = true
    },
    async getList(demand) {
      this.listLoading = true
      if (this.dateList.length > 0) {
        this.pageForm.beginTime = this.$dateFormat(
          'yyyy-MM-dd',
          this.dateList[0]
        )
        this.pageForm.endTime = this.$dateFormat('yyyy-MM-dd', this.dateList[1])
      }
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await getOperLogList(demand)
      } else {
        res = await getOperLogList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    }
  }
}
</script>
