<template>
  <section class="app-main">
    <template v-if="isShow">
      <el-button
        v-if="tabsList.length > 0 && refresh"
        class="refreshBtn"
        icon="el-icon-refresh"
        @click="refreshTab"
      ></el-button>
      <el-tabs
        v-if="tabsList.length > 0 && refresh"
        v-model="$store.state.tabActive"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabsList"
          :key="item.meta.title"
          :name="item.path"
        >
          <span slot="label">{{ item.meta.title }}</span>
          <!-- <transition name="fade-transform" mode="out-in">
          <router-view :key="key" />
        </transition> -->
        </el-tab-pane>
      </el-tabs>
    </template>
    <transition v-if="refresh" name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AppMain',
  data() {
    return {
      tabsList: [],
      refresh: true,
      // 是否显示tab
      isShow: true
    }
  },
  methods: {
    // tab切换事件
    handleClick(tab) {
      console.log(tab)
      if (tab) {
        this.$store.state.tabActive = tab.paneName
        // console.log(this.$store.state.tabActive);
        this.$router.push(
          `${this.getTabHeader}/${this.$store.state.tabActive}`.replace(
            '//',
            '/'
          )
        )
      } else if (this.tabsList.length > 0) {
        this.$store.state.tabActive = this.tabsList[0].path
        this.$router.push(
          `${this.getTabHeader}/${this.$store.state.tabActive}`.replace(
            '//',
            '/'
          )
        )
      }
    },
    // 获取tab数组
    getTabList() {
      sessionStorage.setItem('pathHeader', this.getTabHeader)
      if (sessionStorage.getItem('pathHeader')) {
        this.routers_.some((item) => {
          if (
            item.path == sessionStorage.getItem('pathHeader') &&
            item.children
          ) {
            this.tabsList = item.children
            // console.log(this.tabsList, 222);
            return true
          } else {
            this.tabsList = []
            // console.log('暂无二级菜单')
          }
        })
      } else {
        this.tabsList = []
      }
    },
    // 局部刷新
    refreshTab() {
      this.refresh = false
      this.$nextTick(() => {
        // console.log(this.tabsList);
        this.refresh = true
      })
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    // 获取第二个'/'之前的path 生成需要的path头部
    getTabHeader() {
      let needPath = this.$route.path.slice(1)
      if (needPath.indexOf('/') == -1) {
        return this.$route.path
      } else {
        return this.$route.path.slice(0, needPath.indexOf('/') + 1)
      }
    },

    ...mapState(['routers_'])
  },
  created() {
    this.getTabList()
    this.handleClick()
  },
  watch: {
    '$route.path': {
      handler(now) {
        this.getTabList()
        if (now == this.getTabHeader) {
          this.handleClick()
        } else {
          if (this.$route.query && this.$route.query.tabActive) {
            this.$store.state.tabActive = this.$route.query.tabActive
          }
        }
      }
    },
    tabsList: {
      handler(n) {
        this.isShow = !n.some((item) => {
          return (
            // item.name == 'leader' ||
            // item.name == 'miduser' ||
            // item.name == 'basicuser'||
            item.hidden == true
          )
        })
      }
    }
  }
}
</script>
