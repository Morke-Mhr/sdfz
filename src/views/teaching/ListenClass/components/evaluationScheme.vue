<template>
  <main-box class="evaluationScheme">
    <m-table
      slot="mbody"
      @busSchemeAdd="busSchemeAddFun"
      @editor="editorFun"
      @handleDelete="handleDelete"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isIndex="true"
      :operationArr="operationArr"
      :wCaozuo="80"
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
      class="evaluationScheme"
    >
      <el-form
        :model="schemeFome"
        ref="schemeFome"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="方案名称" prop="name">
          <el-input
            v-model="schemeFome.name"
            maxlength="40"
            show-word-limit
            placeholder="请输入方案名称"
          />
        </el-form-item>
        <el-form-item
          label="评价项目"
          prop="schemeProjectList"
          :show-message="false"
          v-for="(item, idx) in schemeFome.schemeProjectList"
          :key="idx"
        >
          <el-row>
            <el-col :span="17" style="padding-right:10px;margin-bottom:22px">
              <el-form-item
                :prop="`schemeProjectList.${idx}.project`"
                :rules="rules.project"
              >
                <el-input
                  v-model="item.project"
                  maxlength="20"
                  show-word-limit
                  placeholder="请输入评价项目，例：导（问题引导）"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                :prop="`schemeProjectList.${idx}.fraction`"
                :rules="rules.fraction"
              >
                <el-input
                  v-model="item.fraction"
                  maxlength="3"
                  show-word-limit
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请设定分值"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align:right">
              分
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              :prop="`schemeProjectList.${idx}.explainDesc`"
              :rules="rules.explainDesc"
            >
              <el-input
                v-model="item.explainDesc"
                type="textarea"
                :autosize="{ minRows: 2 }"
                maxlength="200"
                show-word-limit
                placeholder="请输入评价标准或说明"
              />
            </el-form-item>
          </el-row>
          <div class="operateBtn">
            <el-button class="addBtn" @click="addItem(idx)">
              + 添加评价方案
            </el-button>
            <el-button
              class="delBtn"
              :disabled="schemeFome.schemeProjectList.length < 2"
              @click="delItem(idx)"
            >
              - 删除评价方案</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <span class="footTxt" slot="footTxt">
        总分：<em class="red">{{ sumFraction }}</em>
        <span class="red samll">分</span>
      </span>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  listByPage,
  busSchemeAdd,
  busSchemeFix,
  bySchemeId
} from '@/api/teaching/ListenClass/evaluationScheme'

export default {
  data() {
    return {
      // 校验规则
      rules: {
        name: [
          { required: true, message: '请输入评价方案名称', trigger: 'blur' }
        ],
        schemeProjectList: [
          {
            type: 'array',
            required: true,
            trigger: 'change'
          }
        ],
        project: [
          {
            required: true,
            message: '请输入评价项目，例：导（问题引导）',
            trigger: 'blur'
          }
        ],
        fraction: [{ required: true, message: '请设定分值', trigger: 'blur' }],
        explainDesc: [
          { required: true, message: '请输入评价标准或说明', trigger: 'blur' }
        ]
      },
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'busSchemeAdd'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '学期',
          propVal: 'semsterName',
          width: '260'
        },
        {
          label: '评价方案',
          propVal: 'name'
        }
      ],
      // 操作栏按钮
      operationArr: [{ label: '修改', eventName: 'editor' }],
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 100,
      // 弹窗标题
      semesterTitle: '新增评价方案',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      schemeFome: {
        name: '',
        schemeId: '',
        schemeProjectList: [{}]
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
    busSchemeAddFun() {
      this.semesterTitle = '新增评价方案'
      this.dialogVisible = true
      this.schemeFome = {
        name: '',
        schemeId: '',
        schemeProjectList: [{}]
      }
    },
    handleDelete() {},
    async editorFun(scope) {
      this.semesterTitle = '修改评价方案'
      let res = await bySchemeId(scope.schemeId)
      this.schemeFome = {
        name: res.name,
        schemeId: res.schemeId,
        schemeProjectList: res.schemeProjectList
      }
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.schemeFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          if (this.semesterTitle == '新增评价方案') {
            await busSchemeAdd(this.schemeFome)
          } else if (this.semesterTitle == '修改评价方案') {
            await busSchemeFix(this.schemeFome)
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
    // 添加项
    addItem(idx) {
      console.log(idx)
      this.schemeFome.schemeProjectList.splice(idx + 1, 0, {})
    },
    // 减少项
    delItem(idx) {
      this.schemeFome.schemeProjectList.splice(idx, 1)
    }
  },
  created() {
    this.getList()
  },
  computed: {
    sumFraction: function() {
      let sumFraction = 0
      this.schemeFome.schemeProjectList.forEach((item) => {
        if (item.fraction && item.fraction != 0) {
          sumFraction += item.fraction * 1
        }
      })
      return sumFraction
    }
  }
}
</script>

<style lang="scss" scoped>
.evaluationScheme {
  .operateBtn {
    text-align: center;
    .addBtn,
    .delBtn {
      padding: 0;
      height: 30px;
      line-height: 30px;
      border: 1px dashed;
      padding: 0 10px;
      margin-top: 20px;
    }
    .addBtn {
      border-color: #009b4c;
      color: #009b4c;
    }
    .delBtn {
      border-color: #ff0000;
      color: #ff0000;
    }
  }
  .footTxt {
    margin-right: 30px;
    font-weight: 700;
    font-size: 14px;
    em {
      font-style: normal;
      font-size: 22px;
      height: 40px;
      line-height: 40px;
    }
    .red {
      color: #ff0000;
    }
    .samll {
      font-size: 10px;
    }
  }
}
</style>
