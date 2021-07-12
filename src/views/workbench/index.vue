<template>
  <div class="workbench">
    <el-container>
      <el-header class="header">
        <el-row class="row">
          <el-col :span="10" class="workbench_left">
            <img src="../../../public/img/login_4.png" alt />
            <p>智慧校园综合管理平台</p>
          </el-col>
          <el-col :span="14" class="workbench_right">
            <p>
              {{ welcomeText }}&nbsp;
              <span @click="dialogVisible = true">
                退出&nbsp;
                <i class="el-icon-switch-button"></i>
              </span>
            </p>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="main">
        <div class="workbench_body">
          <div class="workbench_body_mk">
            <p>基础模块</p>
            <div style="display:flex;flex-wrap: wrap;">
              <div
                class="workbench_body_modular"
                v-for="(v, index) of basics"
                :key="index"
              >
                <router-link :to="v.path">
                  <img
                    :src="require('../../../public/img/' + v.img + '.png')"
                    alt
                  />
                  <br />
                  <el-button>{{ v.name }}</el-button>
                </router-link>
              </div>
            </div>
            <p>扩展模块</p>
            <div style="display:flex;flex-wrap: wrap;">
              <div
                class="workbench_body_modular"
                v-for="(v, index) of outerChain"
                :key="index"
              >
                <a :href="v.src" target="_blank">
                  <img
                    :src="require('../../../public/img/' + v.img + '.png')"
                    alt
                  />
                  <br />
                  <el-button>{{ v.name }}</el-button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 退出 -->
    <m-dialog
      title="温馨提醒"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      className="small"
      @confirm="confirm"
      :dialogBtnArr="czArr"
    >
      <h3 style="text-align: center;">您是否要退出系统？</h3>
    </m-dialog>
  </div>
</template>
<script>
import store from "@/store/index.js";
export default {
  data() {
    return {
      dialogVisible: false,
      czArr: [{ btnName: "确定", eventName: "confirm" }],
      welcomeText: store.getters.userName,
      // 基础模块
      basics: [
        { img: "login_2", name: "数据可视化", path: "" },
        { img: "login_2", name: "应用数据中心", path: "" },
        { img: "login_2", name: "用户中心", path: "" },
        { img: "login_2", name: "系统设置", path: "/system/user" }
      ],
      outerChain: [
        { img: "login_2", name: "数据可视化", src: "https://www.baidu.com/" },
        { img: "login_2", name: "应用数据中心", src: "https://www.baidu.com/" },
        { img: "login_2", name: "用户中心", src: "https://www.baidu.com/" },
        { img: "login_2", name: "系统设置", src: "https://www.baidu.com/" }
      ]
    };
  },
  methods: {
    // 退出
    async confirm() {
      this.dialogVisible = false;
      sessionStorage.removeItem("addTask");
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      location.reload(); // 为了重新实例化vue-router对象 避免bug
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 10px 0px rgba(3, 68, 36, 0.09);
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
}
.row img {
  width: 30%;
}
.workbench_left {
  display: flex;
  align-items: center;
}
.workbench_left img {
  border-right: 1px solid #009b4c;
  padding-right: 1rem;
}
.workbench_left p {
  margin-left: 1rem;
  color: #009b4c;
  font-size: 1.1rem;
  font-weight: bold;
}
.workbench_right {
  text-align: right;
  font-size: 1.1rem;
}
.workbench_right span {
  cursor: pointer;
}
.main {
  height: calc(100vh - 60px);
  background: #f5fbf8;
}
.workbench_body {
  width: 70%;
  margin: auto;
  margin-top: 10rem;
}
.workbench_body_mk > p {
  color: #b4beb9;
  border-left: 3px solid #b4beb9;
  padding-left: 0.5rem;
}
.workbench_body_modular {
  /* padding: 3rem; */
  width: 21%;
  margin: 2%;
  border-radius: 8px;
  background: #ffffff;
  text-align: center;
  padding: 2rem 0;
  box-shadow: 0px 0px 20px 0px rgba(4, 91, 47, 0.2);
}
.workbench_body_modular img {
  width: 70%;
  margin-bottom: 1rem;
  border-radius: 18px;
}
.workbench_body_modular /deep/ {
  .el-button {
    width: 70%;
    border-radius: 1rem;
    border: 2px solid #b4beb9;
    color: #b4beb9;
  }
  .el-button:hover {
    background: #009b4c;
    color: #ffffff;
  }
}
.workbench_body_modular:hover {
  transform: rotate(-7deg) scale(1.1);
  cursor: pointer;
}
</style>
