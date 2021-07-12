<template>
  <main-box class="workrest">
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
      @workrestAdd="workrestAdd"
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
      :title="workrestTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
    >
      <el-form
        :model="workrestFome"
        ref="workrestFome"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="作息名称" prop="name">
          <el-input
            v-model="workrestFome.name"
            maxlength="40"
            show-word-limit
            placeholder="请输入作息名称"
          />
        </el-form-item>
        <el-form-item label="范围" prop="name">
          <el-radio-group v-model="workrestFome.scope">
            <el-radio label="0">小学部</el-radio>
            <el-radio label="1">初中部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效日期" prop="timeArr">
          <el-row>
            <el-col :span="6">
              <el-select v-model="uuu" disabled placeholder="当前学期">
              </el-select>
            </el-col>
            <el-col :span="18" style="padding-left: 10px">
              <el-date-picker
                v-model="workrestFome.timeArr"
                type="daterange"
                range-separator="至"
                start-placeholder="请选择开始日期"
                end-placeholder="请选择结束日期"
                value-format="yyyy-MM-dd"
                @change="timeArrChange"
              >
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="mtitle clearfix" style="padding: 0 50px">作息管理</div>
        <div style="height:40px;margin-bottom:22px;"></div>
        <el-row
          v-for="(item, idx) in workrestFome.sysnWorkrestProject"
          :key="idx"
        >
          <el-col :span="4">
            <div class="asInput">{{ `第${idx + 1}节课` }}</div>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="上课时间"
              :prop="`sysnWorkrestProject.${idx}.startTime`"
              :rules="rules.startTime"
            >
              <el-time-picker
                v-model="item.startTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="请选择"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="下课时间"
              :prop="`sysnWorkrestProject.${idx}.endTime`"
              :rules="rules.endTime"
            >
              <el-time-picker
                v-model="item.endTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="请选择"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="padding-left:12px;">
            <el-button
              class="asButton"
              icon="el-icon-plus"
              @click="addItem(idx)"
            ></el-button>
            <el-button
              class="asButton red"
              icon="el-icon-minus"
              @click="delItem(idx)"
            ></el-button>
          </el-col>
        </el-row>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  workrestAdd,
  workrestDel,
  workrestFix,
  workrest,
  workrestList
} from '@/api/basic/workrest'

export default {
  data() {
    var time_to_sec = function(time) {
      var s = ''

      var hour = time.split(':')[0]
      var min = time.split(':')[1]

      s = Number(hour * 3600) + Number(min * 60)

      return s
    }
    var endTimeRule = (rule, value, callback) => {
      var num = rule.field.split('.')[1]
      console.log(this.workrestFome.sysnWorkrestProject[num].startTime)
      if (!value) {
        callback(new Error('请选择下课时间'))
      } else if (
        Date.parse(time_to_sec(value)) <
        Date.parse(
          time_to_sec(this.workrestFome.sysnWorkrestProject[num].startTime)
        )
      ) {
        callback(new Error('下课时间不得小于上课时间'))
      } else {
        callback()
      }
    }
    return {
      // 暂未用到
      uuu: '',
      // 校验规则
      rules: {
        name: [{ required: true, message: '请输入作息名称', trigger: 'blur' }],
        timeArr: [
          { required: true, message: '请选择有效日期', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择上课时间', trigger: 'change' }
        ],
        endTime: [{ validator: endTimeRule, trigger: 'change' }]
      },
      // 筛选栏
      searchCol: [
        {
          label: '作息名称',
          propVal: 'name'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'workrestAdd'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '作息名称',
          propVal: 'name'
        },
        {
          label: '适用范围',
          propVal: 'scope'
        },
        {
          label: '有效时间',
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
        name: ''
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 100,
      // 弹窗标题
      workrestTitle: '修改作息',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      workrestFome: {
        name: '',
        scope: '0',
        startTime: '',
        endTime: '',
        sysnWorkrestProject: [{}],
        // 有效时间数组
        timeArr: ''
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
        res = await workrestList(demand)
      } else {
        res = await workrestList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 作息新增
    workrestAdd() {
      this.workrestTitle = '新增作息'
      this.workrestFome = {
        name: '',
        scope: '0',
        startTime: '',
        endTime: '',
        sysnWorkrestProject: [{}],
        // 有效时间数组
        timeArr: ''
      }
      this.dialogVisible = true
    },
    // 修改
    async editorFun(scoped) {
      console.log(scoped)
      this.workrestTitle = '修改作息'
      this.workrestFome = await workrest(scoped.workrestId)
      if (
        this.workrestFome.sysnWorkrestProject &&
        this.workrestFome.sysnWorkrestProject.length > 0
      ) {
        this.workrestFome.sysnWorkrestProject = this.workrestFome.sysnWorkrestProject.map(
          (item) => {
            return {
              startTime: item.startTime,
              endTime: item.endTime
            }
          }
        )
      }

      this.workrestFome.timeArr = [
        this.workrestFome.startTime,
        this.workrestFome.endTime
      ]
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.workrestFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          let getData = this.workrestFome
          delete getData.timeArr
          if (this.workrestTitle == '新增作息') {
            console.log(getData)
            await workrestAdd(getData)
          } else if (this.workrestTitle == '修改作息') {
            await workrestFix(getData)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    // 删除
    handleDelete(scope) {
      let row = scope ? scope : null
      this.$confirm('该作息下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await workrestDel(row.workrestId)
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
    },
    // 有效时间更变
    timeArrChange(val) {
      if (val && val.length > 0) {
        this.workrestFome.startTime = val[0]
        this.workrestFome.endTime = val[1]
      }
    },
    // 添加项
    addItem(idx) {
      console.log(idx)
      this.workrestFome.sysnWorkrestProject.splice(idx + 1, 0, {})
    },
    // 减少项
    delItem(idx) {
      this.workrestFome.sysnWorkrestProject.splice(idx, 1)
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.asInput {
  height: 40px;
  line-height: 40px;
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  text-align: center;
  cursor: no-drop;
}
</style>
