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
      @curriculumAdd="curriculumAdd"
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
      :title="curriculumTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
    >
      <el-form
        :model="curriculumFome"
        ref="curriculumFome"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="学科名称" prop="subjectId">
          <el-select
            v-model="curriculumFome.subjectId"
            placeholder="请选择学科名称"
            @change="curriculumChange"
          >
            <el-option
              v-for="item in curriculumOption"
              :key="item.keyID"
              :label="item.keyValue"
              :value="item.keyID"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input
            v-model="curriculumFome.name"
            maxlength="20"
            show-word-limit
            placeholder="请输入课程名称"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  curriculumAdd,
  curriculumDel,
  curriculumFix,
  curriculum,
  curriculumList,
  curriculumSelect
} from '@/api/basic/courseSet'

export default {
  data() {
    return {
      // 校验规则
      rules: {
        subjectId: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入学科名称', trigger: 'blur' }]
      },
      // 筛选栏
      searchCol: [
        {
          label: '课程',
          propVal: 'name'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'curriculumAdd'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '学科名称',
          propVal: 'subjectName'
        },
        {
          label: '课程名称',
          propVal: 'name'
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
      curriculumTitle: '修改学科',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      curriculumFome: {
        name: '',
        subjectId: ''
      },
      // 学科下拉数据
      curriculumOption: [],
      // 所选学科名称
      curriculumLable: ''
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
        res = await curriculumList(demand)
      } else {
        res = await curriculumList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 学科新增
    curriculumAdd() {
      this.curriculumTitle = '新增学科'
      this.curriculumFome = {}
      this.dialogVisible = true
    },
    // 修改
    async editorFun(scoped) {
      console.log(scoped)
      this.curriculumTitle = '修改学科'
      this.curriculumFome = await curriculum(scoped.curriculumId)
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.curriculumFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          if (this.curriculumTitle == '新增学科') {
            await curriculumAdd(this.curriculumFome)
          } else if (this.curriculumTitle == '修改学科') {
            await curriculumFix(this.curriculumFome)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    // 删除
    handleDelete(scope) {
      let row = scope ? scope : null
      this.$confirm('该课程下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await curriculumDel(row.curriculumId)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    curriculumChange(val) {
      let needObj = this.curriculumOption.find(function(item) {
        return item.keyID === val
      })
      this.curriculumLable = needObj.keyValue
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
  async created() {
    this.getList()
    this.curriculumOption = await curriculumSelect()
  }
}
</script>

<style lang="" scoped></style>
