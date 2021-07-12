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
      @handleDelete="handleDelete"
      @getSelectData="getSelectData"
      @logClean="logClean"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isSelection="true"
      :isCaozuo="false"
    ></m-table>
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
    ></m-pagin>
  </main-box>
</template>

<script>
import { getSelectTechItem } from '@/api/comment'
import { logList, deleteTask, logClean } from '@/api/timedTask/taskLog'
export default {
  data() {
    return {
      // 加载状态
      listLoading: false,
      statusArr: [{ label: '正常', value: '0' }, { label: '失败', value: '1' }],
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
          label: '执行状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusArr'
        },
        {
          label: '执行时间',
          propVal: ['startTime', 'stopTime'],
          type: 'datePicker',
          dataType: 'daterange',
          valFormat: 'yyyy-MM-dd'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        { label: '删除', eventName: 'handleDelete', has: 'upds:jobLog:remove' },
        { label: '清空', eventName: 'logClean', has: 'upds:jobLog:clean' }
      ],
      // 表格列配置
      tableCol: [
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
          label: '日志信息',
          propVal: 'jobMessage'
        },
        {
          label: '执行状态',
          propVal: 'status',
          atFilter: 'taskLogStatus'
        },
        {
          label: '执行时间',
          propVal: 'createTime'
        },
        {
          label: '异常信息',
          propVal: 'exceptionInfo'
        }
      ],
      // 记录选中项的jobId
      multipleSelection: [],
      // 查询表单参数
      pageForm: {
        jobName: '',
        jobGroup: '',
        status: '',
        startTime: '',
        stopTime: '',
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
        return item.jobLogId
      })
    },
    // 获取表格数据
    async getList(demand) {
      this.listLoading = true
      let res
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await logList(demand)
      } else {
        res = await logList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
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
          await deleteTask(scope ? scope.jobLogId : this.multipleSelection)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async logClean() {
      await logClean()
      this.getList()
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
