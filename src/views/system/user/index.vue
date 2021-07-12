<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      @searchFun="getList"
      :optionObj="{ user_state, sys_user_type, sys_user_identity }"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @editorFun="editorFun"
      @handleDelete="handleDelete"
      @fixPwd="fixPwd"
      @addUser="addUser"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isIndex="true"
      :operationArr="operationArr"
      :wCaozuo="180"
      v-loading="tableloading"
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
      class="userIndex"
    >
      <el-form
        :model="semesterFome"
        ref="semesterFome"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="登录账号" prop="userName">
          <el-input
            v-model="semesterFome.userName"
            maxlength="20"
            show-word-limit
            placeholder="请输入登录账号"
          />
        </el-form-item>

        <el-form-item label="账号类型" prop="userTypeName">
          {{
            semesterFome.userTypeName ? semesterFome.userTypeName : '临时账号'
          }}
        </el-form-item>

        <el-form-item label="账号身份" prop="userIdentityIds">
          <el-select
            v-model="semesterFome.userIdentityIds"
            disabled
            placeholder="无"
          >
            <el-option
              v-for="(item, idx) in sys_user_identity"
              :key="idx"
              :label="item.dictLabel"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户姓名" prop="realName">
          <el-input
            v-model="semesterFome.realName"
            maxlength="20"
            show-word-limit
            placeholder="请输入用户姓名"
          />
        </el-form-item>
        <el-form-item
          v-if="semesterFome.userIdentityIds == '1372091890070141'"
          label="联系方式"
          prop="phonenumber"
        >
          <el-input
            v-model.number="semesterFome.phonenumber"
            maxlength="11"
            oninput="value=value.replace(/[^\d]/g,'')"
            show-word-limit
            placeholder="请输入联系方式"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="cardId">
          <el-input
            v-model="semesterFome.cardId"
            maxlength="18"
            show-word-limit
            placeholder="请输入身份证号"
          />
        </el-form-item>
        <template v-if="semesterFome.userIdentityIds == '1372091890070141'">
          <el-form-item
            label="选择部门/岗位"
            prop="deptIds"
            v-for="(item, idx) in semesterFome.schemeProjectList"
            :key="idx"
          >
            <el-row>
              <el-col :span="12" style="padding-right:8px">
                <el-form-item
                  :prop="`schemeProjectList.${idx}.deptId`"
                  :rules="rules.deptId"
                >
                  <el-cascader
                    v-model="item.deptId"
                    :options="deptTree"
                    :props="{
                      checkStrictly: true,
                      value: 'id',
                      label: 'label'
                    }"
                    clearable
                    :show-all-levels="false"
                    placeholder="请选择部门"
                    @change="deptChange(item.deptId, idx)"
                  ></el-cascader>
                </el-form-item>
              </el-col>

              <el-col :span="12" style="padding-left:8px">
                <el-form-item
                  :prop="`schemeProjectList.${idx}.postId`"
                  :rules="rules.postId"
                >
                  <el-select
                    v-model="item.postId"
                    placeholder="请选择岗位"
                    @change="postIdChange($event, idx)"
                  >
                    <el-option
                      v-for="citem in item.postIdArr"
                      :key="citem.postId"
                      :label="citem.postName"
                      :value="citem.postId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="operateBtn">
              <el-button class="addBtn" @click="addItem(idx)">
                + 添加部门
              </el-button>
              <el-button
                class="delBtn"
                :disabled="semesterFome.schemeProjectList.length < 2"
                @click="delItem(idx)"
              >
                - 删除部门</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="角色" prop="roleIds">
            <el-select
              v-model="semesterFome.roleIds"
              multiple
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in rolesOptiont"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="账号状态" prop="status">
          <el-radio-group v-model="semesterFome.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  addUser,
  deleteUser,
  updateUse,
  getUserInfo,
  getUserList,
  UserPwd
} from '@/api/system/user'
import { isID, isPhone } from '@/utils/validate.js'
import {
  getSelectTechItem,
  getDeptTreeselect,
  getPostOptionselect,
  getRolesOptionselect
} from '@/api/comment/index'

export default {
  data() {
    return {
      // 校验规则
      rules: {
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        phonenumber: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!isPhone(value)) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }
          }
        ],
        cardId: [
          {
            required: true,
            trigger: 'blur',
            // message: '请输入正确的身份证号码',
            validator: (rule, value, callback) => {
              if (value && !isID(value)) {
                callback(new Error('身份证号码格式不正确'))
              } else {
                callback()
              }
            }
          }
        ],
        status: [
          { required: true, message: '请选择账号状态', trigger: 'change' }
        ],
        schemeProjectList: [
          {
            type: 'array',
            required: true,
            trigger: 'change'
          }
        ]
      },
      // 用户状态
      user_state: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '冻结',
          value: '1'
        }
      ],
      // 账号类型
      sys_user_type: [],
      // 账号身份
      sys_user_identity: [],
      // 部门选择
      deptTree: [],
      // 角色选择
      rolesOptiont: [],
      // 加载状态
      tableloading: false,
      // 筛选栏
      searchCol: [
        {
          label: '登录账号',
          propVal: 'userName'
        },
        {
          label: '用户姓名',
          propVal: 'realName'
        },
        {
          label: '账号类型',
          propVal: 'userType',
          type: 'select',
          optionBd: { label: 'dictLabel', value: 'dictCode' },
          optionsIdx: 'sys_user_type'
        },
        {
          label: '账号身份',
          propVal: 'userIdentity',
          type: 'select',
          optionBd: { label: 'dictLabel', value: 'dictCode' },
          optionsIdx: 'sys_user_identity'
        },
        {
          label: '账号状态',
          propVal: 'status',
          type: 'select',
          optionBd: { label: 'label', value: 'value' },
          optionsIdx: 'user_state'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'addUser'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '登录账号',
          propVal: 'userName',
          width: '240'
        },
        {
          label: '用户姓名',
          propVal: 'realName',
          width: '120'
        },
        {
          label: '联系方式',
          propVal: 'phonenumber',
          width: '240'
        },
        {
          label: '身份证号',
          propVal: 'cardId',
          width: '240'
        },
        {
          label: '账号类型',
          propVal: 'userTypeName'
        },
        {
          label: '账号身份',
          propVal: 'userIdentityNames',
          width: '120'
        },
        {
          label: '账号状态',
          propVal: 'status'
        },
        {
          label: '创建时间',
          propVal: 'createTime',
          width: '160'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '修改', eventName: 'editorFun' },
        {
          label: '删除',
          eventName: 'handleDelete'
        },
        {
          label: '重置密码',
          eventName: 'fixPwd'
        }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 0,
      // 弹窗标题
      semesterTitle: '修改账号',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      semesterFome: {
        userName: '',
        userIdentityIds: '1372091890070141',
        realName: '',
        phonenumber: '',
        cardId: '',
        schemeProjectList: [{}],
        roleIds: '',
        status: '0'
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
        res = await getUserList(demand)
      } else {
        res = await getUserList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 账号新增
    addUser() {
      this.semesterTitle = '新增账号'
      this.semesterFome = {
        userName: '',
        userIdentityIds: '1372091890070141',
        realName: '',
        phonenumber: '',
        cardId: '',
        schemeProjectList: [{}],
        roleIds: '',
        status: '0'
      }
      this.dialogVisible = true
    },
    // 修改
    async editorFun(scoped) {
      this.semesterTitle = '修改账号'
      let res = await getUserInfo(scoped.userId)
      res.user.roleIds = res.user.roles.map((item) => {
        return item.roleId
      })
      res.user.schemeProjectList = res.user.sysUserDeptPosts
      if (
        Array.isArray(res.user.sysUserDeptPosts) &&
        res.user.sysUserDeptPosts.length > 0
      ) {
        res.user.sysUserDeptPosts.forEach((item, idx) => {
          this.deptChange(item.deptId, idx, 'fix')
        })
      } else {
        res.user.schemeProjectList = [{}]
      }
      this.semesterFome = res.user
      if (res.user.userIdentityIds && res.user.userIdentityIds.length > 0) {
        this.semesterFome.userIdentityIds = res.user.userIdentityIds[0]
      }
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.semesterFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          let sysDeptPosts = []
          // console.log(this.semesterFome, 111)
          this.semesterFome.schemeProjectList.forEach((item) => {
            // console.log(item, 222)
            sysDeptPosts.push({
              deptId: Array.isArray(item.deptId)
                ? item.deptId[item.deptId.length - 1]
                : item.deptId,
              postId: item.postId
            })
          })
          let needData = {
            userName: this.semesterFome.userName,
            realName: this.semesterFome.realName,
            roleIds: this.semesterFome.roleIds,
            sysDeptPosts,
            phonenumber: this.semesterFome.phonenumber,
            cardId: this.semesterFome.cardId,
            status: this.semesterFome.status
          }
          if (this.semesterTitle == '新增账号') {
            await addUser(needData)
          } else if (this.semesterTitle == '修改账号') {
            needData.userId = this.semesterFome.userId
            await updateUse(needData)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    // 删除
    handleDelete(scope) {
      this.$confirm('该账号下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteUser(scope.userId)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async fixPwd(scope) {
      this.$confirm('正在执行重置密码操作，确认继续？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await UserPwd({ userId: scope.userId })
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
    // 添加项
    addItem(idx) {
      this.semesterFome.schemeProjectList.splice(idx + 1, 0, {})
    },
    // 减少项
    delItem(idx) {
      this.semesterFome.schemeProjectList.splice(idx, 1)
    },
    // 部门更变
    async deptChange(deptIds, idx, fix) {
      if (!fix) {
        this.semesterFome.schemeProjectList[idx].postId = ''
      }
      this.semesterFome.schemeProjectList[
        idx
      ].postIdArr = await getPostOptionselect(deptIds[deptIds.length - 1])
      this.$forceUpdate()
    },
    postIdChange(postId, idx) {
      console.log(postId)
      this.semesterFome.schemeProjectList[idx].postId = postId
      this.$forceUpdate()
    }
  },
  async created() {
    this.getList()
    this.sys_user_type = await getSelectTechItem('sys_user_type')
    this.sys_user_identity = await getSelectTechItem('sys_user_identity')
    this.deptTree = await getDeptTreeselect()
    this.rolesOptiont = await getRolesOptionselect()
    console.log(this.deptTree)
  }
}
</script>

<style lang="scss" scoped>
.userIndex {
  .operateBtn {
    text-align: right;
    .addBtn,
    .delBtn {
      padding: 0;
      height: 30px;
      line-height: 30px;
      border: 1px dashed;
      padding: 0 25px;
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
