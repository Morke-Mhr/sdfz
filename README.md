# 师大附中
```bash
# 克隆项目
git clone http://192.168.16.234:10080/yizhiwen/zdtx-sdfz.git

# 进入项目目录
cd zdtx-sdfz

# 安装依赖
npm install

# 可以切换镜像解决 npm 下载速度慢的问题 命令如下：
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```
浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix

```

## 编码规范：

- 项目内标准的eslint规范

- .vue单文件中的 style 需按如下代码配置

  ```
  <style lang="scss" scoped>
    .单页面根组件类{
      .b
    }
  </style>
  ```

- .vue根元素需要配置类名：标准为模块名-文件名（可简写，如果不需要加入单页面样式可忽略）

## src子目录结构

- **api** ：存放各种请求
  - **comment**：存放公共请求方法
  - **name**：和view的子目录名称相对应
- **assets**：存放静态文件
  - **icon**：字体图标相关文件
  - **images**：图片文件
- **components**：存放公共组件
  - **name.vue**：各组件名称
  - **index.js**：配置组件全局导入
- **directive**：存放vue指令文件
  - **jurisdiction.js**：has权限指令代码文件
- **layout**：导航栏及菜单相关dom文件
- **router**：路由相关文件
- **store**：vuex相关文件
  - **modules**：基本不用管
  - **apiConfiguration**：配置各项服务ip
  - **getters**：导入的计算属性项
  - **index**：vuex入口，配置各项服务名和需要的vuex字段
- **styles**：css、scss等样式文件存放
  - **index**：架构样式写入，非项目样式写入
  - **project**：各项目样式写入
  - **sidebar**：导航、菜单样式写入
  - **theme**：主题样式写入
  - **transition**：动画样式写入
  - **variables**：样式变量写入
- **utils**：工具类方法存放
  - **auth**：cookie相关
  - **comment**：公共方法
  - **doDownLoad**：下载相关方法
  - **filters**：过滤器相关配置
  - **request**：拦截器配置
  - **validate**：正则方法校验
- **views**：页面组件存放
  - **name**：文件名与菜单管理的目录urlurl字段相对应
    - **name.vue**：文件名与菜单管理的菜单url字段相对应
- **App.vue**：vue实例DOM
- **main.js**：入口文件，导入各项依赖文件
- **.gitignore**：配置git提交忽略文件

## 提供的可操作性组件

### m-error：错误页(errorDialog.vue)

```
this.$store.state.showError：控制错误页的显示和隐藏
this.$store.state.errorRes：储存错误页展示的内容

示例：
<m-error v-if="$store.state.showError"></m-error>
```



### main-box：单页面主容器(mainBox.vue)

#### Prop：

|   参数   |       说明       |  类型   | 默认值 |
| :------: | :--------------: | :-----: | :----: |
| needFoot | 是否需要底部插槽 | Boolean |  true  |

```
main-box组件中拥有：mheader、mbody、mfooter三个插槽
mheader：用于插入头部dom --- 筛选栏组件 （对应标签中属性slot为mheader的dom）
mbody：用于插入主体dom --- 表格组件
mfooter：用于插入底部dom --- 分页组件

用例：
<main-box>
    <filter-box slot="mheader"></filter-box>
    <m-table slot="mbody"></m-table>
    <m-pagin slot="mfooter"></m-pagin>
</main-box>
```



### filter-box：表格上方筛选栏(filterBox.vue)

#### Attribute：

|    参数    |                       说明                        | 类型 |         默认值         |
| :--------: | :-----------------------------------------------: | :--: | :--------------------: |
| searchCol  |       搜索项配置数组，详情见下方参数配置表        | [{}] |           []           |
| optionObj  |           各个级联选择器需要绑定的数据            |  {}  |           {}           |
| pageConfig | 分页字段配置,用于触发事件时，改变分页组件绑定数据 |  {}  | {pageSize: 'pageSize'} |

#### event：

| 事件名称  |            说明            |    回调参数    |
| :-------: | :------------------------: | :------------: |
| searchFun | 查询、重置按钮对应触发事件 | 查询参数对象集 |

#### 配置项searchCol参数：

|    参数     |                             说明                             |                    类型                     |     默认值     |
| :---------: | :----------------------------------------------------------: | :-----------------------------------------: | :------------: |
|    label    |                          搜索项名称                          |                     --                      |       --       |
|   propVal   | 双向绑定数据字段名 当type为datePicker且dataType的值为范围选择类型 需绑定一个数组['开始时间对应字段','结束时间对应字段'] |                   String                    |       --       |
|    type     | 表单项类型，可选值：1.input输入框；2.select下拉选择；3.datePicker日期下拉选择 |                   String                    |     input      |
| placeholder |                      表单项默认提示文本                      |                   String                    |  请输入+label  |
|  maxlength  |               最大输入长度 当type为input时生效               |               number，String                |       --       |
|  optionBd   |                    当为下拉框绑定的字段值                    | {value:绑定值字段名,label:绑定文本值字段名} | {value，label} |
| optionsIdx  |       记录级联选择器所绑定的标识符 对应optionObj中的值       |                   String                    |       --       |
|  dataType   | 时间选择类型 默认date: 对应日期选择/year： 对应年份选择/month：对应月份选择/dates：对应多个日期选择/week：对应周选择/datetime：对应日期-时间选择/datetimerange对应日期-时间范围选择/daterange：对应日期范围选择/monthrange：对应月份范围选择 |                   String                    |      date      |
|   format    |                   显示在输入框中的时间格式                   |                   String                    |       --       |
|  valFormat  |                    时间选择器绑定值的格式                    |                   String                    |       --       |

```
时间格式显示设置参考  https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi

用例：
<filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ deptTreeData, user_state, postArr, roleOptions }"
      @searchFun="getList"
      @cascaderChange="cascaderChange"
      :pageConfig="{ pageSize: pageForm.pageSize }"
>
</filter-box>

data(){
	return {
	searchCol: [
        {
          label: '用户账号',
          propVal: 'userName'
        },
        {
          label: '用户状态',
          propVal: 'status',
          type: 'select',
          optionBd: { label: 'dictLabel', value: 'dictValue' },
          optionsIdx: 'user_state'
        },
        {
          label: '日期范围',
          propVal: ['beginTime', 'endTime'],
          type: 'datePicker',
          dataType: 'daterange',
          valFormat: 'yyyy-MM-dd'
        }
      ],
	}
}
```

### m-table：表格(mTable.vue)

#### Prop：

|     参数     |                    说明                    |  类型   |       默认值        |
| :----------: | :----------------------------------------: | :-----: | :-----------------: |
| tableBtnArr  | 表格上方按钮配置数组，详情见下方参数配置表 |  [{}]   |         --          |
|   tableCol   |    表格项配置数组，详情见下方参数配置表    |  [{}]   |         --          |
| operationArr |    操作栏配置数组，详情见下方参数配置表    |  [{}]   |         --          |
|  tableData   |               表格绑定的数据               |   []    |         []          |
|    border    |              是否需要表格边框              | Boolean |        false        |
|    stripe    |                是否为斑马纹                | Boolean |        true         |
| tableHeight  |                固定表头高度                | String  | calc(100vh - 414px) |
|    rowKey    |          树形表格cell所绑定的key           | String  |         --          |
| isSelection  |             表格是否需要选择栏             | Boolean |        false        |
|   isCaozuo   |               是否需要操作栏               | Boolean |        true         |
|  tableAlign  |                文字对齐方式                | String  |         --          |
|   wCaozuo    |                 操作栏宽度                 |   --    |         120         |

#### event：

|   事件名称    |     说明      |   回调参数   |
| :-----------: | :-----------: | :----------: |
| getSelectData | table选中事件 | 选中行的数据 |

#### 按钮配置项tableBtnArr参数：

|   参数    |                          说明                           |  类型  | 默认值 |
| :-------: | :-----------------------------------------------------: | :----: | :----: |
|   label   |                        按钮名称                         | String |   --   |
| eventName | 按钮对应事件名称 **需要与父组件自定义事件名相同！！！** | String |   --   |

#### 表格配置项tableCol参数：

|   参数   |                             说明                             |  类型  | 默认值 |
| :------: | :----------------------------------------------------------: | :----: | :----: |
|  label   |                           表头名称                           | String |   --   |
| propVal  |                        双向绑定字段名                        | String |   --   |
|  fixed   |      是否固定列 可选值right，left，不固定则不配置该参数      | String |  null  |
|  width   |                       当前表格列的宽度                       |   --   |   --   |
| atFilter | 如果表格数据需要经过过滤处理测配置该项，参数值对应过滤的字段名，过滤逻辑参考utils/filters.js | String |   --   |

#### 操作栏配置项operationArr参数：

|   参数    |                          说明                           |  类型  | 默认值 |
| :-------: | :-----------------------------------------------------: | :----: | :----: |
|   label   |                      操作按钮名称                       | String |   --   |
| eventName | 按钮对应事件名称 **需要与父组件自定义事件名相同！！！** | String |   --   |
|    has    |                        权限配置                         | String |   --   |

```
用例：
<m-table
      slot="mbody"
      @handleAdd="handleAdd"
      @handlePwd="handlePwd"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @changeStatus="changeStatusFun"
      @getSelectData="getSelectData"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :isSelection="true"
      :operationArr="operationArr"
      :wCaozuo="300"
    >
</m-table>
data(){
	return {
		// 表格上方按钮
      tableBtnArr: [
        { label: '添加用户', eventName: 'handleAdd', has: 'system:user:add' },
        {
          label: '删除用户',
          eventName: 'handleDelete',
          has: 'system:user:remove'
        }
      ],
      // 表格列配置
      tableCol: [
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
        { label: '编辑', eventName: 'handleEdit', has: 'system:user:edit' },
        {
          label: '注销',
          eventName: 'changeStatus',
          opShow: 'need',
          has: 'system:user:resetPwd'
        },
        { label: '删除', eventName: 'handleDelete', has: 'system:user:remove' }
      ],
	}
}
```

### mPagination：分页(mPagination.vue)

#### Prop：

|    参数     |             说明             |  类型  |                默认值                |
| :---------: | :--------------------------: | :----: | :----------------------------------: |
|   sizeArr   |          可选条目数          |   []   |            [1, 5, 10, 20]            |
| currentPage |            当前页            | Number |                  1                   |
|  pageSize   |            条目数            | Number |                  1                   |
|    total    |           总条目数           | Number |                  0                   |
|   layout    | 组件布局，子组件名用逗号分隔 | String | 'total,prev,pager,next,sizes,jumper' |

#### event：

|   事件名称    |        说明        |        回调参数        |
| :-----------: | :----------------: | :--------------------: |
|  sizeChange   | 分页条目数改变事件 | 当前分页条目数pageSize |
| currentChange | 当前页码数改变事件 | 当前页码数currentPage  |

```
用例：
<m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
></m-pagin>

data(){
	return {
		pageForm: {
        	pageNum: 1,
        	pageSize: 10,
        	userName: '',
        	phonenumber: '',
        	status: '',
      	},
      	total: 0
	}
}
methods: {
	handleSizeChange(val) {
      	this.pageForm.pageSize = val
      	this.getList() //获取表格数据的方法
    },
    handleCurrentChange(val) {
      	this.pageForm.pageNum = val
      	this.getList()
    },
}
```

### m-dialog：弹窗(mDialog.vue)

#### Prop：

|     参数     |                     说明                      |  类型   | 默认值  |
| :----------: | :-------------------------------------------: | :-----: | :-----: |
| dialogBtnArr |        底部除关闭按钮外，按钮配置数组         |  [{}]   |   --    |
|  className   | 弹出层添加的类名（可选值small/large、自定义） | String  | 'small' |
|   visible    |           绑定控制弹出层显示的字段            | Boolean |  false  |
|    title     |                     标题                      |   --    |  详情   |
|  needFooter  |                 是否需要底部                  | Boolean |  true   |

#### event：

| 事件名称 |       说明       | 回调参数 |
| :------: | :--------------: | :------: |
| closeFun | 关闭按钮触发事件 |    --    |

#### 按钮配置项dialogBtnArr参数：

|   参数    |                          说明                           |  类型  | 默认值 |
| :-------: | :-----------------------------------------------------: | :----: | :----: |
|  btnName  |                        按钮名称                         | String |   --   |
| eventName | 按钮对应事件名称 **需要与父组件自定义事件名相同！！！** | String |   --   |

### m-tree：部门树(mTree.vue)

#### Prop：

|      参数       |           说明           |  类型   |                            默认值                            |
| :-------------: | :----------------------: | :-----: | :----------------------------------------------------------: |
|    treeProps    |          配置树          |   {}    | {label: 'label',children: 'children',disabled: 'disabled',isLeaf: true} |
|    strictly     |     父子节点是否关联     | Boolean |                             true                             |
|     nodeKey     | 树节点所绑定的唯一标识值 |   --    |                             'id'                             |
| defaultChecked  |      默认选中的节点      |   []    |                              []                              |
| defaultExpanded |      默认展开的节点      |   []    |                              []                              |
|    isDanxuan    |        是否为单选        | Boolean |                             true                             |
|    disabled     |  是否禁用(需要后端配合)  | Boolean |                            false                             |

#### event：

|  事件名称   |       说明       |               回调参数                |
| :---------: | :--------------: | :-----------------------------------: |
| getNeedData | 勾选节点触发事件 | node当前节点, checknode选中的节点集合 |

#### treeProps：

|   参数   |               说明               |  类型  |   默认值   |
| :------: | :------------------------------: | :----: | :--------: |
|  label   |       展示文字对应的字段名       | String |  'label'   |
| children |         分级对应的字段名         | String | 'children' |
| disabled |     控制是否禁用对应的字段名     | String | 'disabled' |
|  isLeaf  | 控制子节点是否懒加载对应的字段名 | String |  'isLeaf'  |

