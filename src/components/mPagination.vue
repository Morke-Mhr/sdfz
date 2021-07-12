<template>
  <div class="mPagin">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="nowPage"
      :page-sizes="sizeArr"
      :page-size="pageSize"
      background
      :layout="layout"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'm-pagin',
  props: {
    // 可选条目数
    sizeArr: {
      type: Array,
      default: () => {
        return [1, 5, 10, 20]
      }
    },
    // 当前页
    currentPage: {
      type: Number,
      default: () => {
        return 1
      }
    },
    // 页数
    pageSize: {
      default: 1
    },
    // 总条目数
    total: {
      default: 0
    },
    layout: {
      type: String,
      default: 'total,prev,pager,next,sizes,jumper'
    }
  },
  data() {
    return {}
  },
  computed: {
    nowPage: function() {
      return this.currentPage
    }
  },
  methods: {
    // 分页页数改变事件
    handleSizeChange(pageSize) {
      console.log(pageSize, 'pageSize')
      this.$emit('sizeChange', pageSize)
    },
    // 当前页改变事件
    handleCurrentChange(currentPage) {
      this.$emit('currentChange', currentPage)
    }
  }
}
</script>
