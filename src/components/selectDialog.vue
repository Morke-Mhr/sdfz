<template>
  <div class="sdialog">
    <el-dialog
      :show-close="showclose"
      :close-on-click-modal="false"
      :visible.sync="isShow"
      custom-class="s_dialog"
      append-to-body
      width="75%"
      center
    >
      <el-card class="left">
        <el-tree
          :data="treedata"
          :props="treeProps"
          @node-click="handleNodeClick"
          class="tree"
        ></el-tree>
      </el-card>
      <el-card class="right">
        <el-transfer
          v-model="value"
          :props="transferProps"
          :data="transferData"
          :button-texts="['选出', '选入']"
          :titles="['可选项', '已选']"
          @left-check-change="leftFun($event, isDx)"
        ></el-transfer>
      </el-card>
      <el-button type="primary" class="tBtn" @click="tBtnFun">确 定</el-button>
      <el-button class="fBtn" @click="fBtnFun">取 消</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getUserListByDeptId, getUsersByLoginuser } from '@/api/comment'
export default {
  name: 'sdialog',
  props: {
    // 树形结构 根据children对应的值分级 默认'children' label为需要显示的字段 默认为'label'
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    // 穿梭栏 key为需要绑定的索引 默认为'key' label为需要显示的字段 默认为'label'
    transferProps: {
      type: Object,
      default: () => {
        return {
          key: 'key',
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
    // 是否需要将选中的id,和文本传回父组件
    sNeed: {
      type: Boolean,
      default: false
    },
    // sNeed为true时 父组件用于接收数据的字段名
    needData: {
      type: String
    },
    dxId: {
      type: String
    },
    // 是否显示弹出层关闭按钮
    showclose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShow: false,
      // treedata: [],
      // 选中的
      value: [],
      // 穿梭栏绑定数据
      transferData: []
    }
  },
  methods: {
    async handleNodeClick(data) {
      this.transferData = await getUserListByDeptId(data.id)
      console.log(this.transferData, 123)
    },
    fBtnFun() {
      this.isShow = false
    },
    tBtnFun() {
      // 如果需要传回
      if (this.sNeed) {
        let v = []
        this.value.forEach((vitem) => {
          this.transferData.forEach((tItem) => {
            if (tItem[this.transferProps.key] == vitem) {
              v.push(tItem)
            }
          })
        })
        // v:选中人的ID和名称对象    this.value:选中人的ID数组
        this.$emit('choiceUser', this.value, v)
      }
      // 是否需要显示选中文本
      if (this.dxId) {
        this.$parent[this.dxId] = this.value[0]
      }
      this.value = []
      this.transferData.forEach((dItem) => {
        dItem.disabled = false
      })
      //  this.isShow = false
    },
    // 左侧选中事件
    leftFun(isCheck, val) {
      if (isCheck.length > 0 && val) {
        this.value = []
        this.transferData.forEach((dItem) => {
          if (dItem[this.transferProps.key] != isCheck[0]) {
            dItem.disabled = true
          }
        })
      } else if (isCheck.length <= 0 && val) {
        this.transferData.forEach((dItem) => {
          dItem.disabled = false
        })
      }
    }
  },
  computed: {},
  async created() {
    this.transferData = await getUsersByLoginuser()
    console.log(this.transferData, 'this.transferData')
  }
}
</script>

<style lang="scss" scoped>
.right {
  float: right;
  width: 65%;
}
.sdialog {
  .el-card {
    min-height: 60vh;
    height: 100%;
  }
}
.left {
  float: left;
  width: 30%;
}
.tBtn {
  position: absolute;
  bottom: 10%;
  right: 5%;
  transform: translate(-150%, -50%);
}
.fBtn {
  position: absolute;
  bottom: 10%;
  right: 3%;
  transform: translate(-50%, -50%);
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
