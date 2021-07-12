<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <!-- 菜单展开控制按钮 -->
    <!-- <span
      :class="{ 'is-active': isActive }"
      class="iconfont icon-liebiao-"
    ></span> -->
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>
