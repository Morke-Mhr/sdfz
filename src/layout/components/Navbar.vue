<template>
  <div class="navbar">
    <div class="logoCont"><img src="/img/logo5.png" class="logo" /></div>
    <!-- <div class="companyName">{{ companyName }}</div> -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <h3 class="navbar_h3">用户中心</h3>
    <div class="right-menu">
      <!-- 工作台 -->
      <el-dropdown class="avatar-container" size="small">
        <router-link :to="path">
          <div class="right-container">
            <span class="welcome"> <i class="el-icon-menu"></i> 工作台</span>
          </div>
        </router-link>
        <el-dropdown-menu> </el-dropdown-menu>
      </el-dropdown>
      <!-- 数据看板 -->
      <el-dropdown class="avatar-container" size="small">
        <div class="right-container">
          <span class="welcome">
            <i class="el-icon-data-line"></i> 数据看板</span
          >
        </div>
        <el-dropdown-menu> </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container" trigger="click" size="small">
        <div class="right-container">
          <span class="welcome">
            <i class="el-icon-switch-button"></i> {{ welcomeText }}</span
          >
          <!-- <div class="imgCont">
            <el-avatar style="vertical-align: middle;" :src="userImge" />
          </div> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/person">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link> -->
          <!-- <el-dropdown-item @click.native="userDialog = true">
            <span class="el-icon-user" style="margin-right: 5px;" />个人设置
          </el-dropdown-item> -->
          <el-dropdown-item @click.native="fixFun">
            <span class="el-icon-key" style="margin-right: 5px;" />重置密码
          </el-dropdown-item>
          <el-dropdown-item @click.native="userSettings">
            <span class="el-icon-setting" style="margin-right: 5px;" />主题设置
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span
              class="el-icon-switch-button"
              style="margin-right: 5px;"
            />退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="navbar-nav">
      <!-- <router-link target="_blank" :to="{ path: '/integratedData' }">
        <span>
          <i class="iconfont icon-shujukanban"></i>
          <em>看板</em>
        </span>
      </router-link> -->
      <!-- <router-link to="/">
        <span>
          <i class="iconfont icon-shouye"></i>
          <em>首页</em>
        </span>
      </router-link> -->
      <span>
        <!-- <server ref="child"> </server> -->
      </span>
      <!-- <span class="iconfont icon-UI_icon_shigu">
        <i></i>
        <em>预警</em>
      </span> -->
    </div>
    <m-dialog
      title="重置密码"
      :visible.sync="fixDialog"
      @closeFun="fixDialog = false"
      @addSubmit="fixPossword"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input type="password" v-model="ruleForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="ruleForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </m-dialog>
  </div>
</template>

<script>
//用户信息
import { mapGetters } from "vuex";
import store from "@/store/index.js";
import variables from "@/styles/variables.scss";
import userImg from "../../../public/img/userImg.gif";
import request from "@/utils/request";

export default {
  data() {
    //重置密码时的表单验证
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 重置密码按钮对应数组
      czArr: [{ btnName: "确定", eventName: "addSubmit" }],
      welcomeText: store.getters.userName,
      companyName: "师大附中管理平台",
      path: "/workbench",
      //密码表单验证
      rules: {
        oldPassword: [
          { required: true, message: "请输入当前密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        checkPass: [{ validator: validatePass, trigger: "blur" }]
      },
      ruleForm: {
        oldPassword: "",
        newPassword: "",
        checkPass: ""
      },
      // 修改密码弹窗
      fixDialog: false
      // 个人设置弹窗
      // userDialog: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    userImge: function() {
      if (
        store.state.user.user.avatar == "" ||
        store.state.user.user.avatar === undefined
      ) {
        return userImg;
      } else {
        return (
          store.state.apiConfiguration.fileUrl + store.state.user.user.avatar
        );
      }
    },
    variables() {
      return variables;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    userSettings() {
      store.state.drawerShow = true;
    },
    async logout() {
      sessionStorage.removeItem("addTask");
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      location.reload(); // 为了重新实例化vue-router对象 避免bug
    },
    personInfo() {
      this.$router.push({
        path: "/person"
      });
    },
    async fixPossword() {
      request({
        url: store.state.serviceName.jurisdiction + `/user/profile/updatePwd`,
        method: "put",
        params: this.ruleForm
      });
      this.fixDialog = false;
    },
    fixFun() {
      this.ruleForm = {
        oldPassword: "",
        newPassword: "",
        checkPass: ""
      };
      this.fixDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.navbar {
  height: 60px;
  // padding: 0 30px;
  overflow: hidden;
  position: fixed;
  background-repeat: no-repeat;
  background-position: 80% center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1002;
  width: 100%;
  transition: 0.2s linear 0.2s;
  -webkit-transition: 0.2s linear 0.2s;
  .hamburger-container {
    line-height: 60px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .logoCont {
    height: 60px;
    line-height: 60px;
    // margin-right: 10px;
    float: left;
    width: 160px;
    text-align: center;
    .logo {
      vertical-align: middle;
      // height: 1rem;
      width: 90%;
    }
  }

  .companyName {
    float: left;
    color: #ffffff;
    font-size: 22px;
    font-weight: 600;
    line-height: 80px;
  }
  .navbar_h3{
  display:inline-block;
  margin: 0;
  font-size: 14px;
  line-height: 60px;
  }
  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      height: 60px;
      padding: 0 0.5rem;
      box-shadow: -1px 0px 3px 0px rgba(3, 68, 36, 0.2);
      cursor: pointer;
      .right-container {
        height: 60px;
      }
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
      .imgCont {
        float: right;
        height: 60px;
        line-height: 60px;
      }
    }
  }
}

.welcome {
  float: left;
  font-size: 14px;
  height: 60px;
  line-height: 60px;
  margin: 0 10px;
}

.navbar-nav {
  float: right;
  height: 60px;
}

.navbar-nav em {
  float: right;
  font-style: normal;
  height: 60px;
  line-height: 60px;
  color: #ffffff;
  font-size: 14px;
}

.navbar-nav span {
  line-height: 60px;
  cursor: pointer;
}
</style>
