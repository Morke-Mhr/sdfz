<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        /> -->
        <sidebar-item
          v-for="(route, index) in routes"
          :key="index + route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'userRoles']),
    routes() {
      /*
      1.因为是动态添加的路由，所以页面刷新时动态添加的路由是会被清空的，最好将动态路由进行本地储存。

      2.虽然是动态路由，但是无论何时以何种方式访问Router的路由，比如你想看看添加完动态路由后的所有路由，其实返回的始终是Router的初始路由，原因是Router的路由并不是响应式的，所以只能读取到初始路由。

      3.要想获得动态路由，建议使用vuex进行管理。

      4.关于添加的规则，会根据路径查找并进行合并。
      */

      //获取到动态路由
      // let routers_dynamic = this.$store.state.permission.addRouters

      let routers_dynamic = this.$store.state.user.userRoles

      //获取到静态路由
      let routers_static = this.$router.options.routes
      let routers_ = []
      if (routers_dynamic != null) {
        //合并路由
        routers_ = [...routers_static, ...routers_dynamic]
      }

      return routers_
    },

    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    // 将路由保存至vuex
    this.$store.state.routers_ = this.routes
  }
}
</script>
