<template>
  <main-box class="tTask">
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ statusArr, sys_job_group }"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @handleAdd="handleAdd"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @runOnce="runOnce"
      @getSelectData="getSelectData"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isSelection="true"
      :operationArr="operationArr"
      :wCaozuo="210"
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
      :title="dTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @addSubmit="addSubmit"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input
                v-model="ruleForm.jobName"
                placeholder="请输入任务名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select
                v-model="ruleForm.jobGroup"
                placeholder="请选择任务分组"
              >
                <el-option
                  v-for="item in sys_job_group"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第一行结束 -->
        <!-- <el-row> -->
        <el-form-item
          label="调用方法"
          prop="invokeTarget"
          label-width="80px"
        >
          <el-input
            v-model="ruleForm.invokeTarget"
            placeholder="请输入调用方法"
          ></el-input>
        </el-form-item>
        <!-- </el-row> -->
        <!-- 第二行结束 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input
                v-model="ruleForm.cronExpression"
                placeholder="请输入cron表达式"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发">
              <el-radio-group v-model="ruleForm.concurrent">
                <el-radio-button label="0">允许</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="错误策略">
          <el-radio-group v-model="ruleForm.misfirePolicy">
            <el-radio-button label="1">立即执行</el-radio-button>
            <el-radio-button label="2">执行一次</el-radio-button>
            <el-radio-button label="3">放弃执行</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import { getSelectTechItem } from '@/api/comment'
import {
  jobList,
  addTask,
  editTask,
  runTask,
  deleteTask,
  byJobId
} from '@/api/timedTask/tTask'
export default {
  data() {
    return {
      // 加载状态
      listLoading: false,
      statusArr: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
      searchCol: [
        {
          label: '任务名称',
          propVal: 'jobName'
        },
        {
          label: '任务组名',
          propVal: 'jobGroup',
          type: 'select',
          optionBd: { label: 'dictLabel', value: 'dictValue' },
          optionsIdx: 'sys_job_group'
        },
        {
          label: '任务状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusArr'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        { label: '新增任务', eventName: 'handleAdd', has: 'upds:job:add' },
        { label: '删除任务', eventName: 'handleDelete', has: 'upds:job:remove' }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '任务编号',
          propVal: 'jobId'
        },
        {
          label: '任务名称',
          propVal: 'jobName'
        },
        {
          label: '任务组名',
          propVal: 'jobGroup'
        },
        {
          label: '调用目标字符串',
          propVal: 'invokeTarget'
        },
        {
          label: 'cron执行表达式',
          propVal: 'cronExpression'
        },
        {
          label: '状态',
          propVal: 'status',
          atFilter: 'roleStatus'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '编辑', eventName: 'handleEdit', has: 'upds:job:edit' },
        { label: '执行一次', eventName: 'runOnce', has: 'upds:job:run' },
        { label: '删除', eventName: 'handleDelete', has: 'upds:job:remove' }
      ],
      // 控制弹窗显示
      dialogVisible: false,
      // 弹窗标题
      dTitle: '添加任务',
      // 弹窗按钮配置
      czArr: [{ btnName: '提交', eventName: 'addSubmit' }],
      // 弹窗表单绑定数据
      ruleForm: {
        jobName: '',
        jobGroup: '',
        invokeTarget: '',
        cronExpression: '',
        concurrent: '1',
        misfirePolicy: '1',
        status: '0'
      },
      // 校验规则
      rules: {
        jobName: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: ['blur', 'change']
          }
        ],
        invokeTarget: [
          {
            required: true,
            message: '请输入调用方法',
            trigger: ['blur', 'change']
          }
        ],
        cronExpression: [
          {
            required: true,
            message: '请输入cron表达式',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 记录选中项的jobId
      multipleSelection: [],
      // 查询表单参数
      pageForm: {
        jobName: '',
        jobGroup: '',
        status: '',
        pageNum: 1,
        pageSize: 10
      },
      // 总页数
      total: 0,
      // 表格数据
      tableData: [],
      // 任务组名字典
      sys_job_group: []
    }
  },
  methods: {
    // 获取选中项
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.jobId
      })
    },
    // 获取表格数据
    async getList(demand) {
      this.listLoading = true
      let res
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await jobList(demand)
      } else {
        res = await jobList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 新增方法
    handleAdd() {
      this.dTitle = '添加任务'
      this.ruleForm = {
        jobName: '',
        jobGroup: '',
        invokeTarget: '',
        cronExpression: '',
        concurrent: '1',
        misfirePolicy: '1',
        status: '0'
      }
      this.dialogVisible = true
    },
    // 修改方法
    async handleEdit(scope) {
      this.dTitle = '编辑任务'
      this.ruleForm = await byJobId(scope.jobId)
      this.dialogVisible = true
    },
    // 执行一次
    async runOnce(scope) {
      await runTask(scope.jobId)
    },
    // 删除方法
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的任务!'
        })
        return
      }
      this.$confirm('确定删除任务吗?', '删除任务', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteTask(scope ? scope.jobId : this.multipleSelection)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 提交
    addSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.dTitle == '添加任务') {
            await addTask(this.ruleForm)
          } else {
            await editTask(this.ruleForm)
          }
          this.getList()
          this.dialogVisible = false
        } else {
          console.log(valid)
        }
      })
    },
    // 分页操作方法
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    }
  },
  async created() {
    this.getList()
    // 获取各项字典数据
    this.sys_job_group = await getSelectTechItem('sys_job_group')
  }
}
</script>
