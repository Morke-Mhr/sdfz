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
      @changeStatus="changeStatusFun"
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
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改岗位信息' : '添加岗位信息'"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="post"
        :rules="formRules"
        ref="operationFome"
        label-width="80px"
      >
        <el-form-item label="岗位名称" prop="postName">
          <el-input
            v-model="post.postName"
            maxlength="30"
            show-word-limit
            placeholder="岗位名称"
          />
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input
            v-model="post.postCode"
            maxlength="30"
            show-word-limit
            placeholder="岗位编码"
          />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="post.status">
            <el-radio :disabled="dialogType === 'edit'" :label="'0'"
              >正常</el-radio
            >
            <el-radio :disabled="dialogType === 'edit'" :label="'1'"
              >停用</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="post.remark"
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
  addPost,
  updatePost,
  getPostList,
  deletePost,
  getPostInfo,
  changeStatus
} from '@/api/system/post'

const MODULE_NAME = '岗位'

export default {
  name: 'index',
  data() {
    return {
      has: {
        remove: 'system:post:remove',
        query: 'system:post:query',
        add: 'system:post:add',
        edit: 'system:post:edit'
      },
      // 重置密码按钮对应数组
      czArr: [{ btnName: '提交', eventName: 'confirm' }],
      statusArr: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
      searchCol: [
        {
          label: '岗位名称',
          propVal: 'postName'
        },
        {
          label: '岗位编码',
          propVal: 'postCode'
        },
        {
          label: '岗位状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusArr'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        { label: '添加岗位', eventName: 'handleAdd', has: 'system:post:add' },
        {
          label: '删除岗位',
          eventName: 'handleDelete',
          has: 'system:post:remove'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '岗位名称',
          propVal: 'postName'
        },
        {
          label: '岗位编码',
          propVal: 'postCode'
        },
        {
          label: '状态',
          propVal: 'status',
          atFilter: 'roleStatus'
        },
        {
          label: '描述',
          propVal: 'remark'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '编辑', eventName: 'handleEdit', has: 'system:post:edit' },
        {
          label: '启用',
          eventName: 'changeStatus',
          opShow: 'need',
          has: 'system:post:changeStatus'
        },
        {
          label: '停用',
          eventName: 'changeStatus',
          opShow: 'need',
          has: 'system:post:changeStatus'
        },
        { label: '删除', eventName: 'handleDelete', has: 'system:post:remove' }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        postName: '',
        postCode: '',
        status: ''
      },
      post: {
        postId: '',
        postCode: '',
        postName: '',
        status: '0',
        remark: ''
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
        postCode: [
          {
            required: true,
            message: '请输入岗位编码',
            trigger: 'blur'
          }
        ],
        postName: [
          {
            required: true,
            message: '请输入岗位名称',
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
    handleAdd() {
      this.post = {
        postId: '',
        postCode: '',
        postName: '',
        status: '0',
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
      let postId = scope.postId
      this.post = await getPostInfo(postId)
    },
    // 启用、禁用方法
    async changeStatusFun(scope, opLabel) {
      let status
      if (opLabel == '启用') {
        status = 0
      } else if (opLabel == '停用') {
        status = 1
      }
      await changeStatus({
        postId: scope.postId,
        status
      })
      this.getList()
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
          await deletePost(row ? row.postId : this.multipleSelection)
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
        res = await getPostList(demand)
      } else {
        res = await getPostList(this.pageForm)
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
            await updatePost(this.post)
          } else {
            await addPost(this.post)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.postId
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
