<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      @searchFun="getRoles"
      :optionObj="{ statusArr }"
      :pageConfig="{ pageSize: formInline.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @handleAddRole="handleAddRole"
      @handleDelete="handleDelete"
      @getSelectData="getSelectData"
      @handleEdit="handleEdit"
      @dataAccess="dataAccess"
      :tableBtnArr="tableBtnArr"
      :tableData="rolesList"
      :tableCol="tableCol"
      :isSelection="true"
      :operationArr="operationArr"
      :wCaozuo="210"
    ></m-table>
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="formInline.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="formInline.pageNum"
    ></m-pagin>
    <!-- 添加、编辑弹窗 -->
    <m-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改角色信息' : '添加角色信息'"
      @closeFun="dialogVisible = false"
      @confirm="confirmRole"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="role"
        :rules="loginRules"
        ref="roleFome"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="role.roleName"
            maxlength="30"
            show-word-limit
            placeholder="角色名称"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="roleSort">
          <el-input
            v-model="role.roleSort"
            maxlength="3"
            show-word-limit
            placeholder="请输入显示顺序"
          />
        </el-form-item>
        <el-form-item label="父角色">
          <el-select
            v-model="role.parentRole"
            multiple
            placeholder="请选择父角色"
          >
            <el-option
              v-for="item in parentRoleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="role.status">
            <el-radio :label="'0'">正常</el-radio>
            <el-radio :label="'1'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="菜单选择" prop="menuIds">
          <el-tree
            ref="menuTree"
            :default-expanded-keys="defaultMenutree"
            :default-checked-keys="defaultMenutree"
            :data="menutreeSelectData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
    <!-- 数据权限弹窗 -->
    <m-dialog
      :visible.sync="dataAccessVisible"
      title="分配数据权限"
      @closeFun="dataAccessVisible = false"
      @dataAccessConfirm="dataAccessConfirm"
      :dialogBtnArr="dataAccessArr"
    >
      <el-form
        :model="dataAccessForm"
        ref="dataAccessForm"
        label-width="80px"
      >
        <el-form-item label="角色名称">
          <el-input
            v-model="dataAccessForm.roleName"
            placeholder="请输入角色名称"
            disabled
          />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select
            v-model="dataAccessForm.dataScope"
            placeholder="请选择权限范围"
          >
            <el-option
              v-for="item in dataScopeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="dataAccessForm.dataScope == 2">
          <el-form-item label="数据权限">
            <m-tree
              :defaultChecked="dataAccessForm.deptIds"
              :defaultExpanded="dataAccessForm.deptIds"
            ></m-tree>
          </el-form-item>
        </template>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getRoleInfo,
  dataScope
} from '@/api/system/role'

import {
  getMenutreeSelect,
  getRoleMenuTreeSelect,
  getRolesOptionselect
} from '@/api/comment'

export default {
  data() {
    return {
      has: {
        remove: 'system:role:remove',
        query: 'system:role:query',
        add: 'system:role:add',
        edit: 'system:role:edit'
      },
      searchCol: [
        { label: '角色名称', propVal: 'roleName' },
        {
          label: '角色状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusArr'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '添加角色',
          eventName: 'handleAddRole',
          has: 'system:role:add'
        },
        {
          label: '删除角色',
          eventName: 'handleDelete',
          has: 'system:role:remove'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '角色名称',
          propVal: 'roleName'
        },
        {
          label: '角色状态',
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
        { label: '编辑', eventName: 'handleEdit', has: 'system:role:edit' },
        {
          label: '数据权限',
          eventName: 'dataAccess',
          has: 'system:role:dataScope'
        },
        { label: '删除', eventName: 'handleDelete', has: 'system:role:remove' }
      ],
      // 父角色列表
      parentRoleOptions: [],
      statusArr: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
      role: {
        roleSort: '',
        menuIds: '',
        remark: '',
        roleName: '',
        roleKey: '',
        status: '0',
        parentRole: []
      },
      formInline: {
        pageNum: 1,
        pageSize: 10,
        roleName: '',
        roleKey: '',
        status: ''
      },
      loading: false,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      menutreeSelect: [],
      rolesList: [],
      defaultMenutree: [],
      multipleSelection: [],
      dialogVisible: false,
      // 添加编辑弹窗按钮配置
      czArr: [{ btnName: '提交', eventName: 'confirm' }],
      // 数据权限弹窗按钮配置
      dataAccessArr: [{ btnName: '确定', eventName: 'dataAccessConfirm' }],
      // 控制数据权限弹窗的显示
      dataAccessVisible: false,
      // 数据权限绑定表单数据
      dataAccessForm: {},
      dataScopeArr: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //表单验证方法
      loginRules: {
        roleSort: [
          {
            required: true,
            message: '请输入正确的显示顺序',
            trigger: 'blur'
          }
        ],
        roleName: [
          {
            required: true,
            message: '请输入正确的角色名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    depttreeSelectData() {
      return this.depttreeSelect
    },
    menutreeSelectData() {
      return this.menutreeSelect
    }
  },
  created() {
    this.getRoles()
    this.getMenutreeSelectData()
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getRoles()
    },
    // 获取表格组件返回过来的选中数据
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.roleId
      })
    },
    // 数据权限
    async dataAccess(scope) {
      this.dataAccessForm = await getRoleInfo(scope.roleId)
      this.dataAccessVisible = true
    },
    // 数据权限提交事件
    async dataAccessConfirm() {
      await dataScope(this.dataAccessForm)
      this.dataAccessVisible = false
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.getRoles()
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val
      this.getRoles()
    },
    async getMenutreeSelectData() {
      const res = await getMenutreeSelect()
      this.menutreeSelect = res
    },
    async getRoles(demand) {
      this.loading = true
      let res = []
      if (demand) {
        this.formInline = demand
        this.formInline.pageNum = 1
        res = await getRoles(demand)
      } else {
        res = await getRoles(this.formInline)
      }
      this.rolesList = res.rows
      this.total = res.total
      this.loading = false
    },
    async handleAddRole() {
      if (this.$refs.menuTree) {
        this.getMenutreeSelectData()
        this.defaultMenutree = []
        this.$refs.menuTree.setCheckedKeys([])
      }
      this.role = {
        roleSort: '',
        menuIds: '',
        remark: '',
        roleName: '',
        roleKey: '',
        status: '0'
      }
      this.parentRoleOptions = await getRolesOptionselect()
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['roleFome']) {
        this.$refs['roleFome'].resetFields()
      }
    },
    async handleEdit(scope) {
      if (this.$refs.menuTree) {
        this.getMenutreeSelectData()
        this.defaultMenutree = []
        this.$refs.menuTree.setCheckedKeys([])
      }
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      if (this.$refs['roleFome']) {
        this.$refs['roleFome'].resetFields()
      }
      let roleId = scope.roleId
      this.parentRoleOptions = await getRolesOptionselect({ roleId })
      this.role = await getRoleInfo(roleId)
      this.role.parentRole = this.role.parentRoleList.map((pItem) => {
        return pItem.roleId
      })
      delete this.role.parentRoleList
      let treeSelect = await getRoleMenuTreeSelect(roleId)
      this.defaultMenutree = treeSelect.checkedKeys
    },
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的角色!'
        })
        return
      }
      this.$confirm('确定删除角色吗?', '删除角色', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(scope ? scope.roleId : this.multipleSelection)
          this.getRoles()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async confirmRole() {
      //取得选中菜单id集合
      if (this.$refs.menuTree) {
        const menuTreeKeys = new Set([
          ...this.$refs.menuTree.getHalfCheckedKeys(),
          ...this.$refs.menuTree.getCheckedKeys()
        ])

        this.role.menuIds = [...menuTreeKeys]
      }
      this.$refs.roleFome.validate(async (valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateRole(this.role)
          } else {
            await addRole(this.role)
          }
          this.dialogVisible = false
          this.getRoles()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 15px;
  }

  .permission-tree {
    margin-bottom: 15px;
  }
}
</style>
