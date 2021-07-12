<template>
  <el-drawer
    :visible.sync="$store.state.drawerShow"
    :direction="direction"
    :with-header="false"
    custom-class="mtheme"
  >
    <h3>主题设置</h3>
    <el-collapse v-model="collapseNames" accordion>
      <el-collapse-item title="界面皮肤" name="theme">
        <div class="theme-select">
          <ul>
            <li
              v-for="item in themeList"
              :key="item.name"
              :class="{ actived: item.name === theme, hidden: item.hidden }"
              @click="changeTheme(item.name, item.hidden || false)"
            >
              <img :src="item.src" />
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-drawer>
</template>

<script>
const theme = [
  { name: 'blackgold', label: '黑金' },
  { name: 'purple', label: '紫色' },
  { name: 'cyan', label: '青色' },
  { name: 'green', label: '绿色' },
  { name: 'orange', label: '橘红' },
  { name: 'soot', label: '默认' }
]
const themeList = theme.map((item) => {
  const { name } = item
  item.src = require(`@/assets/images/theme-img/${name}.png`)
  return item
})
import { mapGetters } from 'vuex'
import { updateTheme } from '@/api/comment'
export default {
  name: 'm-theme',
  data() {
    return {
      themeList,
      // 抽屉打开方向
      direction: 'rtl',
      collapseNames: 'theme'
    }
  },
  computed: {
    ...mapGetters(['theme', 'userInfo'])
  },
  methods: {
    async changeTheme(theme, hidden) {
      if (hidden) return

      const body = document.body
      // const styleName = theme + '-theme-style'
      // if (!document.querySelector('#' + styleName)) {
      //   const head = document.getElementsByTagName('HEAD').item(0)
      //   const style = document.createElement('style')
      //   style.type = 'text/css'
      //   style.id = styleName
      //   head.appendChild(style)
      //   console.log(document.getElementsByTagName('HEAD'), theme, style, 444)
      //   // require(`@/assets/theme/${theme}-theme/index.css`)
      // }
      body.className = theme
      let res = await updateTheme({ theme })
      // console.log(body, theme + '-theme', res)
      console.log(res.message)
      // this.$toast.success('切换主题成功')
      // console.log(this.userInfo.id, 'this.userInfo.id')
    }
  }
}
</script>

<style lang="scss" scoped>
.mtheme {
  .theme-select {
    height: calc(100vh - 140px);
    overflow-y: auto;
    padding-top: 5px;
    ul,
    li {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
    li {
      width: 110px;
      height: 110px;
      text-align: center;
      margin-bottom: 10px;
      &.hidden {
        img {
          filter: grayscale(100%);
          filter: gray;
          cursor: default;
        }
      }
      &.actived {
        img {
          padding: 1px;
        }
      }
      img {
        width: 110px;
        height: 80px;
        cursor: pointer;
        border-radius: 3px;
      }
      span {
        font-size: 14px;
        color: #555;
      }
    }
  }
}
</style>
