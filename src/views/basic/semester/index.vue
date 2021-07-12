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
      @editor="editorFun"
      @handleDelete="handleDelete"
      @semesterAdd="semesterAdd"
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
      :title="semesterTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
    >
      <el-form
        :model="semesterFome"
        ref="semesterFome"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="学期名称" prop="name">
          <el-input
            v-model="semesterFome.name"
            maxlength="40"
            show-word-limit
            placeholder="请输入学期名称"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="semesterFome.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间"
          >
          </el-date-picker
        ></el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="semesterFome.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
          >
          </el-date-picker
        ></el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  semesterAdd,
  semesterDel,
  semesterFix,
  semester,
  semesterList
} from '@/api/basic/semester'

export default {
  data() {
    var endTimeRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择结束时间'))
      } else if (
        Date.parse(new Date(this.semesterFome.endTime)) <
        Date.parse(new Date(this.semesterFome.startTime))
      ) {
        callback(new Error('选择的时间不得小于开始时间'))
      } else {
        callback()
      }
    }
    return {
      // 校验规则
      rules: {
        name: [{ required: true, message: '请输入学期名称', trigger: 'blur' }],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [{ validator: endTimeRule, trigger: 'change' }]
      },
      // 筛选栏
      searchCol: [
        {
          label: '学期',
          propVal: 'semesterName'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'semesterAdd'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '学期名称',
          propVal: 'name'
        },
        {
          label: '起止时间',
          propVal: 'fromToDateTime'
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
        semesterName: ''
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 100,
      // 弹窗标题
      semesterTitle: '修改学期',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      semesterFome: {
        name: '',
        startTime: '',
        endTime: ''
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
        res = await semesterList(demand)
      } else {
        res = await semesterList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 学期新增
    semesterAdd() {
      this.semesterTitle = '新增学期'
      this.semesterFome = {}
      this.dialogVisible = true
    },
    // 修改
    async editorFun(scoped) {
      console.log(scoped)
      this.semesterTitle = '修改学期'
      this.semesterFome = await semester(scoped.semesterId)
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.semesterFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          if (this.semesterTitle == '新增学期') {
            await semesterAdd(this.semesterFome)
          } else if (this.semesterTitle == '修改学期') {
            await semesterFix(this.semesterFome)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    // 删除
    handleDelete(scope) {
      let row = scope ? scope : null
      this.$confirm('该学期下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await semesterDel(row.semesterId)
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
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="" scoped></style>
