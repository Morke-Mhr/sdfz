<template>

  <div class="page404">
    <div class="page-box">
    <img :src="fourPage"/>
    <p>抱歉，页面出错~请刷新</p>
    <div class="refresh-btn" @click="refresh">刷新</div>
    </div>
    <!-- <router-view v-if="isRouter"></router-view> -->
  </div>

</template>

<script>
import fourPage from "@/assets/404_images/4042.png";
export default {
  name: "page404",
  computed: {
    message() {
      return "The webmaster said that you can not enter this page...";
    }
  },
  data() {
    return {
      fourPage: fourPage,
      isRouter:true,
    };
  },
  methods:{
    refresh(){
      this.$router.go(-1);
    }
  },
};
</script>

<style lang="scss">
// .app-main{
//   background: #ffffff!important;
// }
.page404{
  height:100%;
  background: #ffffff;
 .page-box{
   position:absolute;
  left:0;
  right:0;
  top:50%;
  bottom:0;
  margin:auto;
  text-align: center;
  transform: translate(0, -50%);
   p{
     font-size: 18px;
     color:#333;
   }
   .refresh-btn{
     width:160px;
     height:32px;
     line-height:32px;
     border-radius:3px;
     background:#5583FE;
     color:#ffffff;
     text-align:center;
     margin: 0 auto;
     cursor: pointer;
   }
 }
}
</style>
