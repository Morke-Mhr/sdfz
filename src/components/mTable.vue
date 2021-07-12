<template>
  <div class="mTable">
    <div class="tableBtn">
      <template v-for="(tItem, tIdx) in tableBtnArr">
        <el-button
          v-if="tItem.has"
          @click="tableBtnFun(tItem.eventName)"
          :key="tIdx"
          v-has="tItem.has"
          >{{ tItem.label }}</el-button
        >
        <el-button v-else @click="tableBtnFun(tItem.eventName)" :key="tIdx">{{
          tItem.label
        }}</el-button>
      </template>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="light"
      style="width: 100%"
      :border="border"
      @selection-change="handleSelectionChange"
      :height="tableHeight"
      :stripe="stripe"
      :row-key="rowKey"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        v-if="isSelection"
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column
        v-else-if="isIndex"
        type="index"
        width="55"
        align="center"
        label="序号"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in tableCol"
        :key="index"
        :label="item.label"
        :fixed="item.fixed"
        :width="item.width"
        show-overflow-tooltip
        :align="tableAlign"
      >
        <template slot-scope="scope">
          <i
            slot="prefix"
            :class="[
              item.propVal == 'menuName' ? 'el-icon-' + scope.row.icon : ''
            ]"
          ></i>
          {{
            scope.row[item.propVal]
              | mtableFilfer(item.propVal, item.atFilter, item.attribute)
          }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="isCaozuo"
        label="操作"
        :width="wCaozuo"
        fixed="right"
      >
        <template slot-scope="scope">
          <template v-for="(opItem, opIdx) in operationArr">
            <!-- 需要配置权限的按钮 -->
            <el-button
              v-if="opItem.has && operationShow(scope.row, opItem)"
              type="text"
              v-has="opItem.has"
              @click="operationFun(scope.row, opItem.eventName, opItem.label)"
              :key="opIdx"
              >{{ opItem.label }}</el-button
            >
            <!-- 不需要配置权限的按钮 -->
            <el-button
              v-else-if="operationShow(scope.row, opItem)"
              type="text"
              @click="operationFun(scope.row, opItem.eventName, opItem.label)"
              :key="opIdx"
              >{{ opItem.label }}</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'm-table',
  props: {
    /**
     * @param tableBtnArr 按钮配置数组 数据类型[{}]
     * 数组对象属性对应值
     * @label  -->表格项名称
     * @eventName  -->对应事件名称 需要与父组件自定义事件名相同！！！
     */
    tableBtnArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    border: {
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    // 固定表头高度
    tableHeight: {
      default: `calc(100vh - 384px)`
    },
    // 树形表格cell所绑定的key
    rowKey: {
      type: String,
      default: ''
    },
    // 表格是否需要选择栏
    isSelection: {
      type: Boolean,
      default: false
    },
    isIndex: {
      type: Boolean,
      default: false
    },
    /**
     * @param tableCol 表格项数组 数据类型[{}]
     * 数组对象属性对应值
     * @label  -->表格项名称
     * @propVal  -->双向绑定字段名
     * @fixed  -->是否固定列  可选值right left
     * @width  -->列宽
     * @atFilter -->如果过滤所用的字段名与绑定的字段名不同 则需要配置该参数
     */
    tableCol: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 文字对齐方式
    tableAlign: {
      default: ''
    },
    // 是否需要操作栏 默认为需要
    isCaozuo: {
      type: Boolean,
      default: true
    },
    /**
     * @param operationArr 操作栏绑定的操作项 数据类型[{}]
     * 数组对象属性对应值
     * label  -->操作名称
     * eventName  -->对应绑定的事件名称  需要与父组件自定义事件名相同！！！
     * has -->权限配置
     */
    operationArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作栏宽度
    wCaozuo: {
      default: 120
    }
  },
  data() {
    return {}
  },
  methods: {
    // table选中事件
    handleSelectionChange(data) {
      this.$emit('getSelectData', data)
      console.log(data)
    },
    // 表格上方按钮事件
    tableBtnFun(eventName) {
      this.$emit(eventName)
    },
    // 操作栏事件  返回当前行数据 操作名称
    operationFun(rowData, eventName, opLabel) {
      this.$emit(eventName, rowData, opLabel)
    }
  },
  created() {},
  computed: {
    operationShow() {
      return function(rows, opBtn) {
        if (!opBtn.opShow) {
          return true
        } else if (rows.classStatus == 1 && opBtn.label == '升级') {
          return false
        } else if (rows.status == 0 && opBtn.label == '解冻') {
          return false
        } else if (rows.status == 1 && opBtn.label == '冻结') {
          return false
        } else if (
          rows.status == 2 &&
          (opBtn.label == '注销' ||
            opBtn.label == '解冻' ||
            opBtn.label == '冻结')
        ) {
          return false
        } else if (rows.status == 0 && opBtn.label == '启用') {
          return false
        } else if (rows.status == 1 && opBtn.label == '停用') {
          return false
        } else if (
          !rows.fileUrl &&
          (opBtn.label == '查看详情' || opBtn.label == '下载')
        ) {
          return false
        } else if (rows.fileUrl && opBtn.label == '删除') {
          return false
        } else {
          return true
        }
      }
    }
  }
}
</script>
