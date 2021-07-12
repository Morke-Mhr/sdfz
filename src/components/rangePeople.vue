<template>
  <div class="sdialog">
    <el-dialog
      title="人员选择"
      :show-close="showclose"
      :close-on-click-modal="false"
      :visible.sync="isShow"
      custom-class="s_dialog"
      append-to-body
      width="45%"
    >
      <el-card class="left">
        <el-input
          prefix-icon="el-icon-search"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
        >
        </el-input>
        <el-tree
          :data="treedata"
          show-checkbox
          :node-key="treeProps.id"
          :filter-node-method="filterNode"
          :props="treeProps"
          @check="handleNodeClick"
          class="tree"
          ref="tree"
        ></el-tree>
      </el-card>
      <el-card class="right">
        <h4>已选择{{ arrdata.length }}人</h4>
        <p v-for="(v, index) of arrdata" :key="index">
          {{ v[treeProps.label] }}
        </p>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" @click="tBtnFun">确 定</el-button>
        <el-button class="fBtn" @click="fBtnFun">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  name: 'sdialog',
  props: {
    // 树形结构 根据children对应的值分级 默认'children' label为需要显示的字段 默认为'label'
    treeProps: {
      type: Object,
      default: () => {
        return {
          // 子数据
          children: 'children',
          // 唯一标识
          id: 'id',
          // 名称
          label: 'label'
        }
      }
    },
    // 树形结构的数据
    treedata: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 单选多选 true :单选
    isDx: {
      type: Boolean,
      default: true
    },
    // 是否显示弹出层关闭按钮
    showclose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      filterText: '',
      isShow: false,
      arrdata: [],
      arrid: []
    }
  },
  mounted() {},
  methods: {
    // 筛选人员
    handleNodeClick(v, state) {
      let arrdata = state.checkedNodes.filter((t) => {
        return t.dateType == '4'
      })
      // 人员有多个岗位 人员id去重
      let map = new Map()
      for (let item of arrdata) {
        if (!map.has(item.id)) {
          map.set(item.id, item)
        }
      }
      this.arrdata = [...map.values()]
    },
    // 确定按钮
    tBtnFun() {
      this.$emit('choiceUser', this.arrdata)
    },
    // 关键字过滤树形
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    fBtnFun() {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.right {
  float: right;
  width: 40%;
  overflow: auto;
  h4 {
    color: #009b4c;
    margin: 0.4rem;
  }
  p {
    margin: 0.4rem 0;
  }
}
.sdialog /deep/ {
  .el-card {
    min-height: 60vh;
    height: 100%;
  }
}

.left {
  float: left;
  width: 59%;
}

.el-transfer-panel__body,
.el-transfer-panel__list {
  height: 280px;
}
.v-modal {
  z-index: 9999999 !important;
}
.el-dialog__wrapper {
  z-index: 9999999 !important;
}
</style>
