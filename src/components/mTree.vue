<template>
  <el-tree
    class="m-tree"
    ref="tree"
    :data="treedata"
    :props="treeProps"
    show-checkbox
    :check-strictly="strictly"
    :node-key="nodeKey"
    :default-checked-keys="defaultChecked"
    :default-expanded-keys="defaultExpanded"
    :current-node-key="currentKey"
    @check="checkFun"
    @check-change="checkChange"
  >
  </el-tree>
</template>

<script>
import { getDeptTreeselect } from '@/api/comment'
export default {
  name: 'm-tree',
  props: {
    // 父子节点是否关联
    strictly: {
      type: Boolean,
      default: true
    },
    /**
     * 配置树
     * @treeProps 接收一个对象
     * @label 展示文字对应的字段名
     * @children 分级对应的字段名
     * @disabled 控制是否禁用对应的字段名
     * @isLeaf 控制子节点是否懒加载对应的字段名
     */
    treeProps: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          children: 'children',
          disabled: 'disabled',
          isLeaf: 'isLeaf'
        }
      }
    },
    // 树节点所绑定的唯一标识值  默认绑定为数据对象的 id字段
    nodeKey: {
      default: 'id'
    },
    /**
     * @defaultChecked 默认选中的节点 接收一个数组
     */
    defaultChecked: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * @defaultExpanded 默认展开的节点 接受一个数组
     */
    defaultExpanded: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * @isDanxuan 是否为单选 默认false为多选
     */
    isDanxuan: {
      type: Boolean,
      default: false
    },
    /**
     * @disabled 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treedata: [],
      // 当前选中的节点
      currentKey: '',
      // 记录选中的节点
      selectOrg: []
    }
  },
  methods: {
    /*
      勾选事件
      第一个参数为当前选中的节点
      第二个为树目前的选中状态对象 包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
    */
    checkFun(node, checknode) {
      // console.log(node, checknode, '多选')
      this.$emit('getNeedData', node, checknode)
    },
    /*
      勾选节点改变时触发事件
      共三个参数，依次为：
      传递给 data 属性的数组中该节点所对应的对象
      节点本身是否被选中
      节点的子树中是否有被选中的节点
    */
    checkChange(node, isChecked, hasChildrenChecked) {
      console.log(node, isChecked, hasChildrenChecked)
      if (this.isDanxuan) {
        const indexs = this.selectOrg.indexOf(node.id)
        if (indexs < 0 && this.selectOrg.length === 1 && isChecked) {
          this.$refs.tree.setCheckedNodes([node])
          this.selectOrg = []
          this.selectOrg.push(node.id)
        } else if (this.selectOrg.length === 0 && isChecked) {
          this.selectOrg = []
          this.selectOrg.push(node.id)
        } else if (indexs >= 0 && this.selectOrg.length === 1 && !isChecked) {
          this.selectOrg = []
        }
      }
    }
    /*
      节点点击事件
      共三个参数，依次为：
      传递给 data 属性的数组中该节点所对应的对象
      节点对应的 Node
      节点组件本身
    */
    // nodeClick(node) {
    //   if (this.isDanxuan) {
    //     this.$emit('getNeedData', node)
    //   }
    // }
  },
  async created() {
    this.treedata = await getDeptTreeselect({ disabled: this.disabled })
    if (this.defaultChecked.length > 0) {
      this.$refs.tree.setCheckedKeys(this.defaultChecked, true)
      this.selectOrg = this.defaultChecked
    }
    console.log(this.treedata)
  },
  watch: {
    defaultChecked: {
      handler(n) {
        this.defaultChecked = n
        if (n.length > 0) {
          this.selectOrg = n
        }
      }
    }
  }
}
</script>
