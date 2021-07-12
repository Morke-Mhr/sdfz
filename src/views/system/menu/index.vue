<template>
  <main-box :needFoot="false">
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ statusArr, visibleArr }"
      @searchFun="getMenuList"
      :pageConfig="{ pageSize: formInline.pageSize }"
    >
    </filter-box>
    <m-table
      slot="mbody"
      @handleAddMenu="handleAddMenu"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      :tableBtnArr="tableBtnArr"
      :tableData="menuList"
      :tableCol="tableCol"
      :operationArr="operationArr"
      :stripe="false"
      :tableHeight="'calc(100vh - 364px)'"
      :wCaozuo="150"
      rowKey="menuId"
    ></m-table>
    <m-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改菜单信息' : '添加菜单信息'"
      @closeFun="dialogVisible = false"
      @confirmmenu="confirmmenu"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="menu"
        :rules="loginRules"
        ref="menuForm"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio v-model="menu.menuType" :label="'M'">目录</el-radio>
          <el-radio v-model="menu.menuType" :label="'C'">菜单</el-radio>
          <el-radio v-model="menu.menuType" :label="'F'">按钮</el-radio>
        </el-form-item>

        <el-form-item label="菜单图标" prop="icon">
          <el-button
            type="primary"
            class="p15"
            icon="el-icon-search"
            @click="innerVisible2 = true"
            >点击选择图标</el-button
          >
          <span v-if="menu.icon != null && menu.icon != ''">
            <i
              slot="suffix"
              class="el-input__icon"
              :class="[
                menu.icon != '' ? 'el-icon-' + menu.icon : 'el-icon-date'
              ]"
            ></i>
            {{ menu.icon }}
          </span>
        </el-form-item>
        <el-form-item label="上级菜单标识" prop="parentId">
          <el-button
            type="primary"
            icon="el-icon-search"
            class="p15"
            :disabled="menu.menuType == 'M'"
            @click="innerVisible = true"
            >点击选择菜单</el-button
          >
          <el-input
            placeholder="请选择菜单"
            :disabled="true"
            v-model="menu.parentId"
            @click="innerVisible = true"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menu.menuName"
            maxlength="30"
            show-word-limit
            placeholder="菜单名称"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input
            v-model="menu.orderNum"
            maxlength="3"
            show-word-limit
            placeholder="请输入显示顺序"
          />
        </el-form-item>
        <el-form-item label="菜单范围" prop="menuArea">
          <el-select
            v-model="menu.menuArea"
            placeholder="请选择菜单范围"
            @change="peojectTypeFunc"
          >
            <el-option
              v-for="item in itemRes"
              :value="item.dictValue"
              :key="item.dictLabel"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="组件路径" prop="component">
          <el-input
            v-model="menu.component"
            :disabled="menu.menuType == 'M' || menu.menuType == 'F'"
            maxlength="100"
            show-word-limit
            placeholder="组件路径"
          />
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input
            v-model="menu.path"
            maxlength="100"
            show-word-limit
            placeholder="路由地址"
          />
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input
            v-model="menu.perms"
            maxlength="100"
            :disabled="menu.menuType == 'M'"
            show-word-limit
            placeholder="权限标识"
          />
        </el-form-item>

        <el-form-item label="重定向" prop="redirect">
          <el-input
            v-model="menu.redirect"
            maxlength="100"
            show-word-limit
            placeholder="重定向"
          />
        </el-form-item>

        <el-form-item label="菜单状态" prop="status">
          <el-radio v-model="menu.status" :label="'0'">正常</el-radio>
          <el-radio v-model="menu.status" :label="'1'">停用</el-radio>
        </el-form-item>

        <el-form-item label="显示状态" prop="visible">
          <el-radio v-model="menu.visible" :label="'0'">显示</el-radio>
          <el-radio v-model="menu.visible" :label="'1'">隐藏</el-radio>
        </el-form-item>

        <el-form-item label="是否外链" prop="isFrame">
          <el-radio v-model="menu.isFrame" :label="1">否</el-radio>
          <el-radio v-model="menu.isFrame" :label="0">是</el-radio>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="menu.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="菜单备注"
          />
        </el-form-item>
      </el-form>
    </m-dialog>
    <!-- 选择图标 -->
    <m-dialog
      title="请选择图标"
      :visible.sync="innerVisible2"
      @closeFun="innerVisible2 = false"
    >
      <div class="icons-container">
        <div class="grid">
          <div
            v-for="(item, index) of elementIcons"
            :key="index"
            @click="choiceIcon(item)"
          >
            <div class="icon-item">
              <i :class="'el-icon-' + item" />
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </m-dialog>
    <!-- 选择节点 -->
    <m-dialog
      title="请选择节点"
      :visible.sync="innerVisible"
      @closeFun="innerVisible = false"
    >
      <el-tree
        ref="menuTree"
        @node-click="checkChange"
        :check-strictly="checkStrictly"
        :data="menutreeSelectData"
        :props="defaultProps"
        :show-checkbox="false"
        node-key="id"
        class="permission-tree"
      />
    </m-dialog>
  </main-box>
</template>

<script>
import {
  getMenuList,
  addMenu,
  updateMenu,
  deleteMenu,
  getMenuInfo,
  getSelectmenuItem
} from '@/api/system/menu'
import { getMenutreeSelect } from '@/api/comment'
import elementIcons from '@/views/system/menu/element-icons.js'

export default {
  data() {
    return {
      has: {
        remove: 'system:menu:remove',
        query: 'system:menu:query',
        add: 'system:menu:add',
        edit: 'system:menu:edit'
      },
      czArr: [{ btnName: '提交', eventName: 'confirmmenu' }],
      statusArr: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
      visibleArr: [
        { label: '显示', value: '0' },
        { label: '隐藏', value: '1' }
      ],
      searchCol: [
        {
          label: '菜单名称',
          propVal: 'menuName'
        },
        {
          label: '显示状态',
          propVal: 'visible',
          type: 'select',
          optionsIdx: 'visibleArr'
        },
        {
          label: '菜单状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'statusArr'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        { label: '新增', eventName: 'handleAddMenu', has: 'system:menu:add' }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '菜单名称',
          propVal: 'menuName'
        },
        {
          label: '显示顺序',
          propVal: 'orderNum'
        },
        {
          label: '显示状态',
          propVal: 'visible'
        },
        {
          label: '菜单状态',
          propVal: 'status',
          atFilter: 'roleStatus'
        },
        {
          label: '菜单类型',
          propVal: 'menuType'
        },
        {
          label: '权限标识',
          propVal: 'perms'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '添加', eventName: 'handleAddMenu', has: 'system:menu:add' },
        { label: '编辑', eventName: 'handleEdit', has: 'system:menu:edit' },
        { label: '删除', eventName: 'handleDelete', has: 'system:menu:remove' }
      ],
      elementIcons,
      itmeLabel: '',
      menu: {
        component: '',
        icon: '',
        isFrame: 1,
        menuId: '',
        menuName: '',
        menuType: 'M',
        orderNum: '',
        params: {},
        parentId: '0',
        path: '',
        perms: '',
        remark: '',
        status: '0',
        url: '',
        visible: '0',
        noticeTypeId: '',
        redirect: '',
        menuArea: '',
        menuAreaId: 0
      },
      formInline: {
        menuName: '',
        visible: '',
        status: '',
        menuArea: ''
      },
      loading: false,
      menutreeSelectData: [],
      menuList: [],
      itemRes: [],
      defaultMenutree: [],
      multipleSelection: [],
      dialogVisible: false,
      innerVisible: false,
      innerVisible2: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //表单验证方法
      loginRules: {
        orderNum: [
          {
            required: true,
            message: '请输入正确的显示顺序',
            trigger: 'blur'
          }
        ],
        menuName: [
          {
            required: true,
            message: '请输入正确的菜单名称',
            trigger: 'blur'
          }
        ],
        parentId: [
          {
            required: true,
            message: '请选择一个上级菜单',
            trigger: 'click',
            validator: (rule, value, callback) => {
              if (this.menu.menuType == 'M') {
                callback()
              } else {
                if (value == null || value == undefined || value == '') {
                  callback(new Error('请选择一个上级菜单'))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        menuArea: [
          {
            required: true,
            message: '请选择菜单',
            trigger: 'click'
          }
        ],
        path: [
          {
            required: true,
            message: '请输入正确的路由地址',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    'menu.menuType': function(newQuestion, oldQuestion) {
      if (
        oldQuestion == 'M' &&
        newQuestion != 'M' &&
        this.menu.parentId == '0'
      ) {
        this.menu.parentId = ''
      }
      if (oldQuestion != 'M' && newQuestion == 'M') {
        if (this.menu.parentId == '') {
          this.menu.parentId = '0'
        }
      }
    }
  },
  computed: {
    getMenuId(menuId) {
      return menuId.toString()
    }
  },
  created() {
    this.getMenuList()
    this.getItemmenu()
  },
  methods: {
    checkChange(itmeForData) {
      this.menu.parentId = itmeForData.id
      this.itmeLabel = itmeForData.label
      this.innerVisible = false
    },
    async getItemmenu() {
      let dictName = 'sys_menu_type'
      this.itemRes = await getSelectmenuItem(dictName)
    },
    peojectTypeFunc(val) {
      console.log(val)
      let resultArr = this.itemRes.filter((item) => {
        return item.dictValue === val
      })

      console.log(resultArr[0].dictCode)
      this.menu.menuAreaId = resultArr[0].dictCode
      this.menu.menuArea = resultArr[0].dictValue
    },
    choiceIcon(itme) {
      this.menu.icon = itme
      this.innerVisible2 = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getMenuList()
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.menuId)
        }
        this.multipleSelection = [...arr]
      }
    },
    async getMenuList(demand) {
      this.loading = true
      let res = []
      if (demand) {
        res = await getMenuList(demand)
      } else {
        res = await getMenuList(this.formInline)
      }
      this.menuList = res
      // this.total = res.total
      this.loading = false
    },
    async getMenutreeSelect() {
      let data = await getMenutreeSelect()
      this.menutreeSelectData = data
    },
    handleAddMenu(scope) {
      this.menu = {
        component: '',
        icon: '',
        isFrame: 1,
        menuId: '',
        menuName: '',
        menuType: 'M',
        orderNum: '',
        params: {},
        parentId: '0',
        path: '',
        perms: '',
        remark: '',
        status: '0',
        url: '',
        visible: '0',
        redirect: ''
      }
      this.itmeLabel = ''
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['menuForm']) {
        this.$refs['menuForm'].resetFields()
      }
      this.getMenutreeSelect()
      if (scope) {
        let menuId = scope.menuId
        this.menu.parentId = menuId
      }
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      if (this.$refs['menuForm']) {
        this.$refs['menuForm'].resetFields()
      }
      let menuId = scope.menuId
      this.getMenutreeSelect()
      this.menu = await getMenuInfo(menuId)
    },
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的菜单!'
        })
        return
      }
      let row = scope ? scope : null
      this.$confirm('确定删除菜单吗?', '删除菜单', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteMenu(row ? row.menuId : this.multipleSelection)
          this.getMenuList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    confirmmenu() {
      //校验表单
      this.$refs.menuForm.validate(async (valid) => {
        if (valid) {
          //判断状态
          const isEdit = this.dialogType === 'edit'
          //取得选中菜单id集合

          if (isEdit) {
            await updateMenu(this.menu)
          } else {
            await addMenu(this.menu)
          }
          this.dialogVisible = false
          this.getMenuList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .menus-table {
    margin-top: 15px;
  }

  .permission-tree {
    margin-bottom: 15px;
  }
}

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  background: #00bcd4;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 10px;
    height: 65px;
    text-align: center;
    width: 80px;
    float: left;
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
