<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ configTypeArr }"
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
      :title="dialogType === 'edit' ? '修改参数信息' : '添加参数信息'"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="config"
        :rules="formRules"
        ref="operationFome"
        label-width="80px"
      >
        <el-form-item label="参数名称" prop="configName">
          <el-input
            v-model="config.configName"
            maxlength="30"
            show-word-limit
            placeholder="参数名称"
          />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input
            v-model="config.configKey"
            maxlength="30"
            show-word-limit
            placeholder="参数键名"
          />
        </el-form-item>

        <el-form-item label="参数键值" prop="configValue">
          <el-input
            v-model="config.configValue"
            maxlength="30"
            show-word-limit
            placeholder="参数键值"
          />
        </el-form-item>

        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="config.configType">
            <el-radio :label="'Y'">是</el-radio>
            <el-radio :label="'N'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="config.remark"
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
  getConfigList,
  addConfig,
  updateConfig,
  deleteConfig,
  getConfigInfo
} from '@/api/system/config.js'

const MODULE_NAME = '参数'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:config:remove',
        query: 'system:config:query',
        add: 'system:config:add',
        edit: 'system:config:edit'
      },
      // 重置密码按钮对应数组
      czArr: [{ btnName: '提交', eventName: 'confirm' }],
      configTypeArr: [{ label: '是', value: 'Y' }, { label: '否', value: 'N' }],
      // 筛选栏
      searchCol: [
        {
          label: '参数名称',
          propVal: 'configName'
        },
        {
          label: '参数键名',
          propVal: 'configKey'
        },
        {
          label: '系统内置',
          propVal: 'configType',
          type: 'select',
          optionsIdx: 'configTypeArr'
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
        { label: '添加参数', eventName: 'handleAdd', has: 'system:config:add' },
        {
          label: '删除参数',
          eventName: 'handleDelete',
          has: 'system:config:remove'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '参数名称',
          propVal: 'configName'
        },
        {
          label: '参数键名',
          propVal: 'configKey'
        },
        {
          label: '参数键值',
          propVal: 'configValue'
        },
        {
          label: '系统内置',
          propVal: 'configType'
        },
        {
          label: '描述',
          propVal: 'remark'
        },
        {
          label: '创建时间',
          propVal: 'createTime'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '编辑', eventName: 'handleEdit', has: 'system:config:edit' },
        {
          label: '删除',
          eventName: 'handleDelete',
          has: 'system:config:remove'
        }
      ],
      dateList: [],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        configName: '',
        configKey: '',
        configType: '',
        beginTime: '',
        endTime: ''
      },
      config: {
        configId: '',
        configKey: '',
        configName: '',
        configValue: '',
        configType: 'Y',
        remark: ''
      },
      multipleSelection: [],
      tableData: [],
      tableKey: 0,
      total: 100,
      listLoading: false,
      dialogVisible: false,
      dialogType: 'new',
      //表单验证方法
      formRules: {
        configName: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ],
        configKey: [
          {
            required: true,
            message: '请输入参数键名',
            trigger: 'blur'
          }
        ],
        configValue: [
          {
            required: true,
            message: '请输入参数键值',
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
        return item.configId
      })
    },
    handleAdd() {
      this.config = {
        configId: '',
        configKey: '',
        configName: '',
        configValue: '',
        configType: 'Y',
        remark: ''
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
      let configId = scope.configId
      this.config = await getConfigInfo(configId)
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
          await deleteConfig(row ? row.configId : this.multipleSelection)
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
        res = await getConfigList(demand)
      } else {
        res = await getConfigList(this.pageForm)
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
            await updateConfig(this.config)
          } else {
            await addConfig(this.config)
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
