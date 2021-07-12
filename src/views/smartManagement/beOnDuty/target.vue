<template>
  <main-box :needFoot="false">
    <m-table
      slot="mbody"
      @handleAdd="handleAdd"
      @handleEdit="handleEdit"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :operationArr="operationArr"
      :wCaozuo="300"
      v-loading="tableloading"
    >
    </m-table>
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
    ></m-pagin>
    <m-dialog
      :title="dialogType === 'add' ? '新增指标' : '修改指标'"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="czArr"
      v-loading="dialogloading"
    >
      <el-form
        :model="ruleForm"
        :rules="formRules"
        ref="operationFome"
        label-width="120px"
      >
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="使用范围" prop="scope">
          <el-checkbox-group v-model="ruleForm.scope">
            <el-checkbox label="0">小学部</el-checkbox>
            <el-checkbox label="1">初中部</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>
<script>
import { getquota,postquota,putquota,getIdquota } from '@/api/smartManagement/beOnDuty.js'
export default {
  data() {
    return {
      has: {
        list: 'workbench:quota:list',
        query: 'workbench:quota:query',
        add: 'workbench:quota:add',
        edit: 'workbench:quota:edit'
      },
      // 请求参数
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      // 新增表单
      ruleForm: {scope:[]},
      formRules: {
        name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
        scope:[{ type: 'array', required: true, message: '请选择使用范围', trigger: 'change' }],
      },
      total: 0,
      dialogloading: false,
      tableloading: false,
      czArr: [{ btnName: '保存', eventName: 'confirm' }],
      dialogType: 'add',
      dialogVisible: false,
      quotaId:"",
      // 表格上方按钮
      tableBtnArr: [{ label: '新增', eventName: 'handleAdd', has: 'workbench:quota:add' }],
      // 表格列配置
      tableCol: [
        {
          label: '指标名称',
          propVal: 'name'
        },
        {
          label: '使用范围',
          propVal: 'scope',
          atFilter:'scope'
        }
      ],
      // 操作栏按钮
      operationArr: [{ label: '修改', eventName: 'handleEdit', has: 'workbench:quota:edit' }],
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 列表查询
    async getList(demand) {
      console.log(demand)
      this.tableloading = true
      let res = []
      res = await getquota(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      this.tableloading = false
    },
    // 分页
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    },
    // 新增按钮
    handleAdd() {
      this.dialogloading = true
      this.dialogType = 'add'
      this.ruleForm = {
        scope: []
      }
      this.dialogVisible = true
      this.dialogloading = false
    },
    // 修改
    async handleEdit(v) {
      this.dialogloading = true
      this.dialogType = 'edit'
      let res = await getIdquota(v.quotaId)
      if(res.scope==2){
        res.scope=["0","1"]
      }else{
        res.scope=[res.scope]
      }
      this.ruleForm = res
      console.log(res)
      this.quotaId = v.quotaId
      this.dialogloading = false
      this.dialogVisible = true
    },
    // 确定按钮
    confirm() {
      // 表单验证
      this.$refs['operationFome'].validate(async (valid) => {
        if (valid) {
          // 新增
          console.log(this.ruleForm)
          // 指标范围（0：小学部；1：初中部；2：全部） =_= 
          let ruleForm=JSON.parse(JSON.stringify(this.ruleForm))
          if(ruleForm.scope.length > 1){
            ruleForm.scope = 2
          }else{
            ruleForm.scope =  ruleForm.scope[0]
          }
          if (this.dialogType == 'add') {
            await postquota(ruleForm)
          } else {
            // 修改
            ruleForm.quotaId = this.quotaId
            await putquota(ruleForm)
          }
          this.dialogVisible = false
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
