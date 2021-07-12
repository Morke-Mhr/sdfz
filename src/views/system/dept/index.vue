<template>
  <main-box :needFoot="false">
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
      :stripe="false"
      :tableHeight="'calc(100vh - 364px)'"
      :wCaozuo="150"
      rowKey="deptId"
    ></m-table>
    <m-dialog
      :title="dialogType === 'edit' ? '修改部门信息' : '添加部门信息'"
      :visible.sync="dialogVisible"
      @closeFun="closeFun"
      @confirm="confirm"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="dept"
        :rules="formRules"
        ref="operationFome"
        label-width="80px"
      >
        <el-form-item label="父级部门">
          <m-tree
            v-if="dialogVisible"
            :defaultChecked="defaultMenutree"
            :defaultExpanded="defaultMenutree"
            :isDanxuan="true"
            @getNeedData="getNeedData"
            :disabled="treeDisabled"
          ></m-tree>
        </el-form-item>

        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="dept.deptName"
            maxlength="30"
            show-word-limit
            placeholder="请输入部门名称"
          />
        </el-form-item>

        <el-form-item label="负责人" prop="leaderUserId">
          <el-select v-model="dept.leaderUserId" placeholder="请选择负责人">
            <el-option
              v-for="item in user_leader"
              :key="item.userId"
              :label="item.realName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="显示顺序" prop="orderNum">
          <el-input
            v-model.number="dept.orderNum"
            maxlength="3"
            show-word-limit
            placeholder="请输入显示顺序"
          />
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="dept.status">
            <el-radio :label="'0'">正常</el-radio>
            <el-radio :label="'1'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门岗位" prop="postIds">
          <el-select
            v-model="dept.postIds"
            multiple
            placeholder="选择要关联的岗位"
            @change="postChange"
          >
            <el-option
              v-for="item in postList"
              :key="item.postId"
              :label="item.postName"
              :value="item.postId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位排序">
          <el-table
            :data="postTable"
            tooltip-effect="light"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="postName"
              label="岗位名称"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column label="岗位顺序">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.sort"
                  maxlength="3"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  placeholder="请输入显示顺序"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  getDeptList,
  addDept,
  updateDept,
  deleteDept,
  getDeptInfo,
  optionSelect
} from '@/api/system/dept'
import { getPostOptionselect } from '@/api/comment'

const defaultDept = {
  deptId: '',
  deptName: '',
  leaderUserId: '',
  orderNum: '',
  parentId: '',
  status: '0'
}

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:dept:remove',
        query: 'system:dept:query',
        add: 'system:dept:add',
        edit: 'system:dept:edit'
      },
      // 树禁用
      treeDisabled: false,
      // 负责人
      user_leader: [],
      // 重置密码按钮对应数组
      czArr: [{ btnName: '提交', eventName: 'confirm' }],
      statusArr: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
      // 筛选栏
      searchCol: [
        {
          label: '部门名称',
          propVal: 'deptName'
        },
        {
          label: '部门状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusArr'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        { label: '添加部门', eventName: 'handleAdd', has: 'system:dept:add' },
        {
          label: '删除部门',
          eventName: 'handleDelete',
          has: 'system:dept:remove'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '部门名称',
          propVal: 'deptName'
        },
        {
          label: '负责人',
          propVal: 'leader'
        },
        {
          label: '状态',
          propVal: 'status'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '添加', eventName: 'handleAdd', has: 'system:dept:add' },
        { label: '编辑', eventName: 'handleEdit', has: 'system:dept:edit' },
        { label: '删除', eventName: 'handleDelete', has: 'system:dept:remove' }
      ],
      pageForm: {
        deptName: '',
        status: ''
      },
      dept: {
        deptId: '',
        deptName: '',
        leaderUserId: '',
        orderNum: '',
        parentId: '',
        status: '0'
      },
      // 岗位列表
      postList: [],
      postTable: [],
      deptbumenId: '',
      defaultMenutree: [],
      multipleSelection: [],
      tableData: [],
      tableKey: 0,
      listLoading: false,
      dialogVisible: false,
      dialogType: 'new',
      deptOptions: [],
      currentChecke: '',
      //表单验证方法
      formRules: {
        deptIds: [
          {
            required: true,
            message: '请输选择部门',
            trigger: 'blur'
          }
        ],

        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }
        ],
        deptLevel: [
          {
            required: true,
            message: '请选择部门等级',
            trigger: 'blur'
          }
        ],
        orderNum: [
          {
            required: true,
            message: '请输入显示顺序',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                value == null ||
                value == undefined ||
                value == '' ||
                value < 0
              ) {
                callback(new Error('请输入正确的显示顺序'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {},
  async created() {
    this.getList()
    // 获取岗位数据
    this.postList = await getPostOptionselect()
    this.user_leader = await optionSelect()
    console.log(this.user_leader, 'user_leader')
  },
  methods: {
    postChange(postId) {
      this.postTable = []
      postId.forEach((pItem) => {
        this.postList.forEach((dItem) => {
          if (pItem == dItem.postId) {
            this.postTable.push({
              postId: dItem.postId,
              postName: dItem.postName
            })
          }
        })
      })
      console.log(this.postTable, 'postTable')
    },
    async getNeedData(node, checknode) {
      console.log(node, checknode, 'node, checknode')
      this.dept.parentId = checknode.checkedKeys
    },
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.deptId
      })
    },
    closeFun() {
      this.dept.deptId = ''
      this.dialogVisible = false
    },
    async handleAdd(scope, addClose) {
      this.dialogType = 'new'
      this.treeDisabled = false
      this.defaultMenutree = []
      console.log(this.$refs['operationFome'], 'this.$refs')
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
        this.dept.deptId = ''
      }
      this.postTable = []
      this.dept = defaultDept
      if (addClose == 'addClose') {
        this.dept.deptId = ''
      } else if (scope) {
        this.treeDisabled = true
        let deptId = scope.deptId
        this.defaultMenutree = [deptId]
        this.dept.parentId = deptId
      }
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.treeDisabled = false
      this.postTable = []
      let deptId = scope.deptId
      this.dept = await getDeptInfo(deptId)
      this.deptbumenId = deptId
      this.dept.parentId = this.defaultMenutree = [this.dept.parentId]
      if (
        this.dept.posts &&
        Array.isArray(this.dept.posts) &&
        this.dept.posts.length > 0
      ) {
        this.dept.postIds = this.dept.posts.map((item) => {
          return item.postId
        })
        this.postTable = this.dept.posts.map((item) => {
          return {
            postId: item.postId,
            postName: item.postName,
            sort: item.postSort
          }
        })
      }
      this.dialogVisible = true
    },
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的部门!'
        })
        return
      }
      let row = scope ? scope : null
      this.$confirm('确定删除部门吗?', '删除部门', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteDept(row ? row.deptId : this.multipleSelection)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async confirm() {
      if (this.deptbumenId != '') {
        this.dept.deptId = this.deptbumenId
      }
      this.$refs.operationFome.validate(async (valid) => {
        if (!valid) {
          return
        }
        const isEdit = this.dialogType === 'edit'
        let reqData = this.dept
        if (Array.isArray(reqData.postIds)) {
          reqData.deptPostParams = reqData.postIds.map((item, idx) => {
            return {
              postId: item,
              sort: this.postTable[idx].sort
            }
          })
        } else {
          reqData.postIds = []
        }
        if (Array.isArray(reqData.parentId)) {
          reqData.parentId = reqData.parentId[0]
        }
        delete reqData.postIds
        console.log(reqData, 'reqData')
        if (isEdit) {
          await updateDept(reqData)
        } else {
          await addDept(reqData)
        }
        this.dialogVisible = false
        this.getList()
      })
    },
    async getList(demand) {
      this.listLoading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await getDeptList(demand)
      } else {
        res = await getDeptList(this.pageForm)
      }
      this.tableData = res
      this.listLoading = false
    }
  }
}
</script>
