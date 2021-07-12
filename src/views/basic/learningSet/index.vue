<template>
  <!-- 学制 -->
  <div class="app-container">
    <div class="learningSet_top">
      <p>学制选择:</p>
      <div class="learningSet_body">
        <div
          v-for="(v, index) of list"
          :key="index"
          @click="chcke(v.educationalId)"
          :class="{ isckce: selects.indexOf(v.educationalId) != -1 }"
        >
          {{ v.educationalId | educational }}
          <i
            class="el-icon-check"
            v-show="selects.indexOf(v.educationalId) != -1"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { geteducational, puteducational } from '@/api/basic/learningSet.js'
export default {
  data() {
    return {
      list: [],
      selects: [],
      isDX: false, //是否多选
      // 部门树形
      treedata: []
    }
  },
  created() {
    this.geteducational()
  },
  methods: {
    //   请求列表
    async geteducational() {
      let res = await geteducational()
      this.selects = []
      for (let v of res.rows) {
        if (v.name == 0) {
          this.selects.push(v.educationalId)
        }
      }
      this.list = res.rows
    },
    // 修改
    async chcke(v) {
      let data = {
        educationalId: v,
        name: this.selects.indexOf(v) == -1 ? '0' : '1'
      }
      await puteducational(data)

      if (this.selects.indexOf(v) == -1) {
        this.selects.push(v)
      } else {
        this.selects.splice(this.selects.indexOf(v), 1)
      }
      this.geteducational()
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  margin: 0px 20px;
  background-color: #fff;
  height: calc(100vh - 185px);
}
.learningSet_top {
  width: 75%;
  margin: auto;
  padding-top: calc(50vh - 210px);
}
.learningSet_top > p {
  height: 24px;
  color: #333333;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  margin-bottom: 50px;
}
.learningSet_body {
  display: flex;
}
.learningSet_body > div {
  flex: 1;
  padding: 25px 0;
  line-height: 1;
  margin-right: 30px;
  text-align: center;
  box-shadow: 0px 0px 20px 0px rgba(4, 91, 47, 0.2);
  cursor: pointer;
  border-radius: 4px;
}
.isckce {
  background: #009b4c;
  color: #ffffff;
}
</style>
