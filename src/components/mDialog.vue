<template>
  <el-dialog
    :custom-class="className"
    :visible="dialogVisible"
    :title="title"
    :append-to-body="true"
    @close="closeFun"
  >
    <slot></slot>
    <span v-if="needFooter" slot="footer">
      <slot name="footTxt"></slot>
      <el-button class="fBtn" @click="closeFun">取 消</el-button>
      <el-button
        class="tBtn"
        v-for="(item, idx) in dialogBtnArr"
        :key="idx"
        :disabled="isClick"
        @click="operation(item.eventName)"
        >{{ item.btnName }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
/**
 * @closeFun 执行父组件自定义事件closeFun绑定的方法
 */
export default {
  name: 'm-dialog',
  props: {
    // 弹出层添加的类名
    className: {
      type: String,
      default: 'small'
    },
    // 绑定控制弹出层显示的字段
    visible: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      default: '详情'
    },
    // 是否需要底部
    needFooter: {
      type: Boolean,
      default: true
    },
    /**
     * 底部除关闭事件外 绑定的按钮数组
     * @dialogBtnArr 数据类型为[{}]
     * 对象中的参数
     * @btnName 按钮名称
     * @eventName 事件名称 与父组件中自定义事件的名称相对应
     */
    dialogBtnArr: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isClick: false
    }
  },
  computed: {
    dialogVisible: function() {
      return this.visible
    }
  },
  methods: {
    closeFun() {
      this.$emit('closeFun')
    },
    operation(eventName) {
      if (!this.isClick) {
        this.isClick = true
        setTimeout(() => {
          this.isClick = false
        }, 750)
        this.$emit(eventName)
      }
    }
  },
  created() {}
}
</script>
