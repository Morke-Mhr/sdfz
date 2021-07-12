<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ statusArr }"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @handleClean="handleClean"
      @handleDelete="handleDelete"
      @getSelectData="getSelectData"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isSelection="true"
      :operationArr="operationArr"
      :wCaozuo="100"
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
import {
  getLogininforList,
  cleanLogininfor,
  deleteLogininfor
} from '@/api/system/logininfor.js'

const MODULE_NAME = '登录日志'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:logininfor:remove',
        query: 'system:logininfor:query',
        add: 'system:logininfor:add',
        edit: 'system:logininfor:edit'
      },
      statusArr: [{ label: '正常', value: '0' }, { label: '异常', value: '1' }],
      // 筛选栏
      searchCol: [
        {
          label: '登录IP',
          propVal: 'ipaddr'
        },
        {
          label: '用户账号',
          propVal: 'userName'
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
          has: 'system:logininfor:remove'
        },
        {
          label: '清空日志',
          eventName: 'handleClean',
          has: 'system:logininfor:remove'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '用户账号',
          propVal: 'userName'
        },
        {
          label: '浏览器类型',
          propVal: 'browser'
        },
        {
          label: '访问ID',
          propVal: 'infoId'
        },
        {
          label: '登录IP',
          propVal: 'ipaddr'
        },
        {
          label: '登录地点',
          propVal: 'loginLocation'
        },
        {
          label: '提示消息',
          propVal: 'msg'
        },
        {
          label: '操作系统',
          propVal: 'os'
        },
        {
          label: '访问时间',
          propVal: 'loginTime'
        },
        {
          label: '操作状态',
          propVal: 'status',
          atFilter: 'logStatus'
        }
      ],
      // 操作栏按钮
      operationArr: [
        {
          label: '删除',
          eventName: 'handleDelete',
          has: 'system:logininfor:remove'
        }
      ],
      dateList: [],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        userName: '',
        ipaddr: '',
        status: '',
        beginTime: '',
        endTime: ''
      },
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
        return item.infoId
      })
    },
    handleClean() {
      this.$confirm('确定清空' + MODULE_NAME + '吗?', '清空' + MODULE_NAME, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await cleanLogininfor()
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
          await deleteLogininfor(row ? row.infoId : this.multipleSelection)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
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
        res = await getLogininforList(demand)
      } else {
        res = await getLogininforList(this.pageForm)
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

<style lang="scss" scoped></style>
