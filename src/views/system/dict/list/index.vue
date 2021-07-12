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
      @toOffspring="toOffspring"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @useRecord="useRecord"
      @fixRecordFun="fixRecordFun"
      @getSelectData="getSelectData"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isSelection="true"
      :operationArr="operationArr"
      :wCaozuo="280"
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
      :title="dialogType === 'edit' ? '修改字典类型信息' : '添加字典类型信息'"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="dictType"
        :rules="formRules"
        ref="operationFome"
        label-width="80px"
      >
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            v-model="dictType.dictName"
            maxlength="30"
            show-word-limit
            placeholder="字典名称"
          />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            v-model="dictType.dictType"
            maxlength="30"
            show-word-limit
            placeholder="字典类型"
          />
        </el-form-item>
        <el-form-item label="字典状态" prop="status">
          <el-radio-group v-model="dictType.status">
            <el-radio :label="'0'">正常</el-radio>
            <el-radio :label="'1'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="dictType.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="用户描述"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
    <m-dialog
      :title="recordTitle"
      :visible.sync="recordVisible"
      className="large"
      @closeFun="recordVisible = false"
    >
      <m-table
        :tableData="recordTableData"
        :tableCol="recordTableCol"
        :isCaozuo="false"
      >
      </m-table>
      <m-pagin
        :total="recordTotal"
        :pageSize="recordForm.pageSize"
        @sizeChange="recordSizeChange"
        @currentChange="recordCurrentChange"
        :currentPage.sync="recordForm.pageNum"
      ></m-pagin>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  getDictTypeList,
  addDictType,
  updateDictType,
  deleteDictType,
  getDictTypeInfo,
  dictChange,
  dictUseHist
} from '@/api/system/dictType.js'

const defaultDictType = {
  dictId: '',
  dictName: '',
  dictType: '',
  remark: '',
  status: '0'
}

const MODULE_NAME = '字典类型'

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
      // 筛选栏
      searchCol: [
        {
          label: '字典名称',
          propVal: 'dictName'
        },
        {
          label: '字典类型',
          propVal: 'dictType'
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
          label: '添加字典类型',
          eventName: 'handleAdd',
          has: 'system:dict:add'
        },
        {
          label: '删除字典类型',
          eventName: 'handleDelete',
          has: 'system:dict:remove'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '字典名称',
          propVal: 'dictName'
        },
        {
          label: '字典类型',
          propVal: 'dictType'
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
        { label: '列表', eventName: 'toOffspring', has: 'system:dict:list' },
        { label: '编辑', eventName: 'handleEdit', has: 'system:dict:edit' },
        {
          label: '使用记录',
          eventName: 'useRecord',
          has: 'system:dictUseHist:list'
        },
        {
          label: '修改记录',
          eventName: 'fixRecordFun',
          has: 'system:dictChange:list'
        },
        { label: '删除', eventName: 'handleDelete', has: 'system:dict:remove' }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        dictName: '',
        dictType: '',
        status: ''
      },
      dictType: {
        dictId: '',
        dictName: '',
        dictType: '',
        remark: '',
        status: '0'
      },
      multipleSelection: [],
      tableData: [],
      total: 100,
      listLoading: false,
      dialogVisible: false,
      recordVisible: false,
      // 使用、修改记录弹窗表格数据
      recordTableData: [],
      // 使用、修改记录弹窗表格列配置
      recordTableCol: [],
      // 使用、修改记录弹窗标题
      recordTitle: '使用记录',
      // 使用、修改记录弹窗分页请求参数
      recordForm: {
        pageNum: 1,
        pageSize: 10
      },
      // 使用、修改记录弹窗分页总页数
      recordTotal: 0,
      dialogType: 'new',
      //表单验证方法
      formRules: {
        dictName: [
          {
            required: true,
            message: '请输入字典名称',
            trigger: 'blur'
          }
        ],
        dictType: [
          {
            required: true,
            message: '请输入字典类型',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  created: function() {
    this.getList()
  },
  methods: {
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.dictId
      })
    },
    toOffspring(scope) {
      this.$router.push({ path: 'data', query: { type: scope.dictType } })
    },
    handleAdd() {
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      this.dictType.remark = ''
      this.dictType = defaultDictType
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      let dictId = scope.dictId
      this.dictType = await getDictTypeInfo(dictId)
    },
    // 使用记录
    async useRecord(scope) {
      this.recordTitle = '使用记录'
      this.recordForm.dictType = scope.dictType
      this.recordTableCol = [
        {
          label: '字典类型',
          propVal: 'dictType'
        },
        {
          label: '字典数据',
          propVal: 'dictLabels'
        },
        {
          label: ' 使用人',
          propVal: 'createBy'
        },
        {
          label: '使用时间',
          propVal: 'createTime'
        }
      ]
      let { rows, total } = await dictUseHist(this.recordForm)
      this.recordTableData = rows
      this.recordTotal = total
      this.recordVisible = true
    },
    // 操作记录数据请求及数据处理方法
    async dictChangeFun() {
      let { rows, total } = await dictChange(this.recordForm)
      this.recordTableData = rows.map((item) => {
        return {
          ...item,
          cutSourceData: item.sourceDictData
            ? `${item.sourceDictData.dictLabel}:${
                item.sourceDictData.dictValue
              }`
            : '',
          cutTargetData: item.targetDictData
            ? `${item.targetDictData.dictLabel}:${
                item.targetDictData.dictValue
              }`
            : ''
        }
      })
      this.recordTotal = total
    },
    // 操作记录
    fixRecordFun(scope) {
      this.recordTitle = '操作记录'
      this.recordForm.dictType = scope.dictType
      this.recordTableCol = [
        {
          label: '字典类型',
          propVal: 'dictType'
        },
        {
          label: '操作类型',
          propVal: 'method'
        },
        {
          label: ' 源数据',
          propVal: 'cutSourceData'
        },
        {
          label: '修改数据',
          propVal: 'cutTargetData'
        },
        {
          label: '修改人',
          propVal: 'createBy'
        },
        {
          label: ' 修改时间',
          propVal: 'createTime'
        }
      ]
      this.dictChangeFun()
      this.recordVisible = true
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
          await deleteDictType(row ? row.dictId : this.multipleSelection)
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
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await getDictTypeList(demand)
      } else {
        res = await getDictTypeList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    async confirm() {
      this.$refs.operationFome.validate(async (valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateDictType(this.dictType)
          } else {
            await addDictType(this.dictType)
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
    },
    async recordSizeChange(val) {
      this.recordForm.pageSize = val
      if (this.recordTitle == '使用记录') {
        let { rows, total } = await dictUseHist(this.recordForm)
        this.recordTableData = rows
        this.recordTotal = total
      } else {
        this.dictChangeFun()
      }
    },
    async recordCurrentChange(val) {
      this.recordForm.pageNum = val
      if (this.recordTitle == '使用记录') {
        let { rows, total } = await dictUseHist(this.recordForm)
        this.recordTableData = rows
        this.recordTotal = total
      } else {
        this.dictChangeFun()
      }
    }
  }
}
</script>
