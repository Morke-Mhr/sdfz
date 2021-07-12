<template>
  <div class="app-container container-table">
    333
    <div class="table-query-form">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="ipaddr" label="登录IP">
          <el-input
            v-model="pageForm.ipaddr"
            maxlength="15"
            show-word-limit
            placeholder="登录IP"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="用户账号">
          <el-input
            v-model="pageForm.userName"
            maxlength="30"
            show-word-limit
            placeholder="用户账号"
          ></el-input>
        </el-form-item>

        <el-form-item prop="status" label="操作状态">
          <el-select v-model="pageForm.status" placeholder="操作状态">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常" value="0"></el-option>
            <el-option label="异常" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="status" label="日期范围">
          <el-date-picker
            v-model="dateList"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            class="query-btn"
            icon="el-icon-search"
            v-has="has.query"
            @click="getList()"
            >查询</el-button
          >
          <el-button @click="resetForm('pageForm')" class="reset-btn"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-button
        class="table-default-btn"
        v-has="has.remove"
        @click="handleDelete()"
      >
        删除日志
      </el-button>
      <el-button
        class="table-default-btn"
        v-has="has.remove"
        @click="handleClean()"
      >
        清空日志
      </el-button>

      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%;margin-top:30px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="用户账号 ">
          <template slot-scope="scope">
            {{ scope.row.userName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="浏览器类型">
          <template slot-scope="scope">
            {{ scope.row.browser }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="访问ID">
          <template slot-scope="scope">
            {{ scope.row.infoId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="登录IP">
          <template slot-scope="scope">
            {{ scope.row.ipaddr }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="登录地点">
          <template slot-scope="scope">
            {{ scope.row.loginLocation }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="提示消息">
          <template slot-scope="scope">
            {{ scope.row.msg }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作系统">
          <template slot-scope="scope">
            {{ scope.row.os }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="访问时间">
          <template slot-scope="scope">
            {{ scope.row.loginTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">正常</span>
            <span v-if="scope.row.status == '1'">异常</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" width="70" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.remove"
              size="medium"
              @click="handleDelete(scope)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageForm.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
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
      let row = scope ? scope.row : null
      this.$confirm('确定删除' + MODULE_NAME + '吗?', '删除' + MODULE_NAME, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteLogininfor(row ? row.operId : this.multipleSelection)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    resetForm(formName) {
      this.dateList = []
      this.pageForm.beginTime = ''
      this.pageForm.endTime = ''
      this.$refs[formName].resetFields()
      this.getList()
    },
    async getList() {
      this.listLoading = true
      if (this.dateList.length > 0) {
        this.pageForm.beginTime = this.$dateFormat(
          'yyyy-MM-dd',
          this.dateList[0]
        )
        this.pageForm.endTime = this.$dateFormat('yyyy-MM-dd', this.dateList[1])
      }
      const res = await getLogininforList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.operId)
        }
        this.multipleSelection = [...arr]
      }
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
