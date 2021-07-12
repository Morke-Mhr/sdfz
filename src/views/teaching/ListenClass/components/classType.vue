<template>
  <main-box>
    <m-table
      slot="mbody"
      @classTypeAdd="classTypeAddFun"
      @handleDelete="deleteFun"
      @editor="editorFun"
      @getList="getList"
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
      :title="classTypeTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
    >
      <el-form
        :model="classTypeFome"
        ref="classTypeFome"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input
            v-model="classTypeFome.name"
            maxlength="20"
            show-word-limit
            placeholder="请输入类型名称"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  listByPage,
  classTypeAdd,
  classTypeFix,
  busListenClassType,
  classTypeDel
} from '@/api/teaching/ListenClass/classType'

export default {
  data() {
    return {
      // 校验规则
      rules: {
        name: [
          { required: true, message: '请输入听评课类型名称', trigger: 'blur' }
        ]
      },
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'classTypeAdd'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '听评课类型',
          propVal: 'name'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '修改', eventName: 'editor' },
        { label: '删除', eventName: 'handleDelete' }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 0,
      // 弹窗标题
      classTypeTitle: '修改听评课类型',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      classTypeFome: {
        name: ''
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
        res = await listByPage(demand)
      } else {
        res = await listByPage(this.pageForm)
      }
      this.tableData = res.list
      this.total = res.total
      this.listLoading = false
    },
    classTypeAddFun() {
      this.classTypeFome = {
        name: ''
      }
      this.classTypeTitle = '新增听评课类型'
      this.dialogVisible = true
    },
    async editorFun(scope) {
      this.classTypeTitle = '修改听评课类型'
      this.classTypeFome = await busListenClassType(scope.listenClassTypeId)
      this.dialogVisible = true
    },
    deleteFun(scope) {
      this.$confirm('该听评课类型下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await classTypeDel(scope.listenClassTypeId)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async confirm() {
      this.$refs.classTypeFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          if (this.classTypeTitle == '新增听评课类型') {
            await classTypeAdd(this.classTypeFome)
          } else if (this.classTypeTitle == '修改听评课类型') {
            await classTypeFix(this.classTypeFome)
          }
          this.dialogVisible = false
          this.getList()
        }
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
