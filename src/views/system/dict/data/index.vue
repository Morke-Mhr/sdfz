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
      @handleAdd="handleAdd"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
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
      :title="dialogType === 'edit' ? '修改字典数据信息' : '添加字典数据信息'"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="dictData"
        :rules="formRules"
        ref="operationFome"
        label-width="80px"
      >
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input
            v-model="dictData.dictLabel"
            maxlength="30"
            show-word-limit
            placeholder="字典标签"
          />
        </el-form-item>

        <el-form-item label="字典键值" prop="dictValue">
          <el-input
            v-model="dictData.dictValue"
            maxlength="100"
            show-word-limit
            placeholder="字典键值"
          />
        </el-form-item>

        <el-form-item label="字典排序" prop="roleSort">
          <el-input
            v-model="dictData.dictSort"
            type="number"
            min="0"
            max="9999"
            maxlength="9999"
            placeholder="字典排序"
          />
        </el-form-item>

        <el-form-item label="样式属性" prop="cssClass">
          <el-input
            v-model="dictData.cssClass"
            maxlength="30"
            show-word-limit
            placeholder="样式属性"
          />
        </el-form-item>
        <el-form-item label="回显样式" prop="listClass">
          <el-input
            v-model="dictData.listClass"
            maxlength="30"
            show-word-limit
            placeholder="回显样式"
          />
        </el-form-item>

        <el-form-item label="是否默认" prop="isDefault">
          <el-radio-group v-model="dictData.isDefault">
            <el-radio :label="'Y'">是</el-radio>
            <el-radio :label="'N'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字典状态" prop="status">
          <el-radio-group v-model="dictData.status">
            <el-radio :label="'0'">正常</el-radio>
            <el-radio :label="'1'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="dictData.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="用户描述"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  getDictDataList,
  addDictData,
  updateDictData,
  deleteDictData,
  getDictDataInfo
} from '@/api/system/dictData.js'

const MODULE_NAME = '字典数据'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:dict:remove',
        query: 'system:dict:query',
        add: 'system:dict:add',
        edit: 'system:dict:edit'
      },
      // 重置密码按钮对应数组
      czArr: [{ btnName: '提交', eventName: 'confirm' }],
      statusArr: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
      searchCol: [
        {
          label: '字典标签',
          propVal: 'dictLabel'
        },
        {
          label: '字典状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusArr'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '添加字典数据',
          eventName: 'handleAdd',
          has: 'system:dict:add'
        },
        {
          label: '删除字典数据',
          eventName: 'handleDelete',
          has: 'system:dict:remove'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '字典标签',
          propVal: 'dictLabel'
        },
        {
          label: '字典类型',
          propVal: 'dictType'
        },
        {
          label: '字典键值',
          propVal: 'dictValue'
        },
        {
          label: '字典排序',
          propVal: 'dictSort'
        },
        {
          label: '样式属性',
          propVal: 'cssClass'
        },
        {
          label: '回显样式',
          propVal: 'listClass'
        },
        {
          label: '是否默认',
          propVal: 'isDefault'
        },
        {
          label: '字典状态',
          propVal: 'status'
        },
        {
          label: '描述',
          propVal: 'remark'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '编辑', eventName: 'handleEdit', has: 'system:dict:edit' },
        { label: '删除', eventName: 'handleDelete', has: 'system:dict:remove' }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        dictLabel: '',
        dictType: '',
        status: ''
      },
      dictData: {
        dictCode: '',
        cssClass: '',
        dictLabel: '',
        dictSort: '',
        dictValue: '',
        isDefault: 'Y',
        listClass: '',
        remark: '',
        status: '0'
      },
      multipleSelection: [],
      tableData: [],
      tableKey: 0,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      listLoading: false,
      dialogVisible: false,
      dialogType: 'new',
      //表单验证方法
      formRules: {
        dictLabel: [
          {
            required: true,
            message: '请输入字典标签 ',
            trigger: 'blur'
          }
        ],
        dictSort: [
          {
            required: true,
            message: '请输入字典排序',
            trigger: 'blur'
          }
        ],
        dictValue: [
          {
            required: true,
            message: '请输入字典键值',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  created: function() {
    this.dictData.dictType = this.$route.query.type
    this.pageForm.dictType = this.$route.query.type
    console.log(this.pageForm.dictType)
    this.getList()
  },
  methods: {
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.dictCode
      })
    },
    handleAdd() {
      this.dictData = {
        dictCode: '',
        cssClass: '',
        dictLabel: '',
        dictSort: '',
        dictValue: '',
        isDefault: 'Y',
        listClass: '',
        remark: '',
        status: '0'
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      let dictCode = scope.dictCode
      this.dictData = await getDictDataInfo(dictCode)
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
          await deleteDictData(row ? row.dictCode : this.multipleSelection)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getList()
    },
    async getList(demand) {
      this.listLoading = true
      let res = []
      if (demand) {
        demand.dictType = this.pageForm.dictType
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await getDictDataList(demand)
      } else {
        res = await getDictDataList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    async confirm() {
      this.$refs.operationFome.validate(async (valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          this.dictData.dictType = this.pageForm.dictType
          if (isEdit) {
            await updateDictData(this.dictData)
          } else {
            await addDictData(this.dictData)
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
  }
}
</script>

<style lang="scss" scoped></style>
