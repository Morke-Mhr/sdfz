<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ classOption, user_state }"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @editor="editorFun"
      @gradeAdd="gradeAdd"
      @handleDelete="handleDelete"
      @classUpfun="classUpfun"
      @onekeyUpgradeFun="onekeyUpgradeFun"
      @getSelectData="getSelectData"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isSelection="true"
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
      :title="gradeTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
    >
      <el-form
        :model="gradeFome"
        ref="gradeFome"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="年级名称" prop="grade">
          <el-select
            v-model="gradeFome.grade"
            placeholder="请选择"
            @change="classChange"
          >
            <el-option
              v-for="item in classOption"
              :key="item.keyID"
              :label="item.keyValue"
              :value="item.keyID"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开班年份" prop="openYear">
          <el-date-picker
            v-model="gradeFome.openYear"
            type="year"
            value-format="yyyy"
            placeholder="请选择开班年份"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班号" prop="classNo">
          <el-input
            v-model="gradeFome.classNo"
            maxlength="10"
            show-word-limit
            placeholder="请输入班号"
            @input="classNoChange"
          />
        </el-form-item>
        <el-form-item label="班级名称：">
          {{ gradeFome.className }}
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  gradeAdd,
  gradeDel,
  gradeFix,
  grade,
  gradeList,
  classOptionselect,
  classUpgrade,
  onekeyUpgrade
} from '@/api/basic/classSetting'

export default {
  data() {
    var openYearRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择开班年份'))
      } else if (Date.parse(new Date()) < Date.parse(new Date(value))) {
        callback(new Error('选择的开班年份不得大于当前年份'))
      } else {
        callback()
      }
    }
    return {
      // 校验规则
      rules: {
        grade: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
        openYear: [{ validator: openYearRule, trigger: 'change' }],
        classNo: [{ required: true, message: '请输入班号', trigger: 'blur' }]
      },
      // 用户状态
      user_state: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '已毕业',
          value: '1'
        },
        {
          label: '正常',
          value: '2'
        }
      ],
      // 筛选栏
      searchCol: [
        {
          label: '年级',
          propVal: 'grade',
          type: 'select',
          optionsIdx: 'classOption',
          optionBd: { label: 'keyValue', value: 'keyID' }
        },
        {
          label: '开班年份',
          propVal: 'open_year',
          type: 'datePicker',
          dataType: 'year',
          valFormat: 'yyyy'
        },
        {
          label: '状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'user_state'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'gradeAdd'
        },
        // {
        //   label: '批量导入',
        //   eventName: ''
        // },
        {
          label: '一键升级',
          eventName: 'onekeyUpgradeFun'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '年级名称',
          propVal: 'grade'
        },
        {
          label: '班级名称',
          propVal: 'className'
        },
        {
          label: '开班年份',
          propVal: 'openYear'
        },
        {
          label: '状态',
          propVal: 'classStatus'
        },
        {
          label: '最后更新时间',
          propVal: 'updateTime'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '升级', eventName: 'classUpfun', opShow: 'need' },
        { label: '修改', eventName: 'editor' },
        {
          label: '删除',
          eventName: 'handleDelete'
        }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 100,
      // 弹窗标题
      gradeTitle: '修改班级',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      gradeFome: {
        name: '',
        startTime: '',
        endTime: ''
      },
      // 选中的数据
      multipleSelection: [],
      // 年级选择数据
      classOption: [],
      // 年级名称
      gradeLable: ''
    }
  },
  methods: {
    // 表格数据批量操作
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.classId
      })
    },
    // 升级
    async classUpfun(scope) {
      await classUpgrade(scope.classId)
      this.getList()
    },
    // 一键升级
    async onekeyUpgradeFun() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        await onekeyUpgrade(this.multipleSelection)
        this.getList()
      }
    },
    // 获取表格数据
    async getList(demand) {
      this.listLoading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await gradeList(demand)
      } else {
        res = await gradeList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 班级新增
    gradeAdd() {
      this.gradeTitle = '新增班级'
      this.gradeFome = {}
      this.dialogVisible = true
    },
    // 修改
    async editorFun(scoped) {
      this.gradeTitle = '修改班级'
      this.gradeFome = await grade(scoped.classId)
      this.gradeFome.openYear += ''
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.gradeFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          if (this.gradeTitle == '新增班级') {
            await gradeAdd(this.gradeFome)
          } else if (this.gradeTitle == '修改班级') {
            await gradeFix(this.gradeFome)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    // 班号改变
    classNoChange() {
      let gradeLable = this.gradeLable ? this.gradeLable : ''
      this.gradeFome.className = gradeLable + this.gradeFome.classNo
    },
    // 年级改变
    classChange(val) {
      let needObj = this.classOption.find(function(item) {
        return item.keyID === val
      })
      this.gradeLable = needObj.keyValue
      let classNo = this.gradeFome.classNo ? this.gradeFome.classNo : ''
      this.gradeFome.className = this.gradeLable + classNo
    },
    // 删除
    handleDelete(scope) {
      let row = scope ? scope : null
      this.$confirm('该班级下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await gradeDel(row.classId)
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
  async created() {
    this.getList()
    this.classOption = await classOptionselect()
  }
}
</script>

<style lang="" scoped></style>
