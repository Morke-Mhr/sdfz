<template>
  <el-dialog
    class="errorDialog"
    custom-class="small"
    :visible="$store.state.showError"
    title="温馨提示"
    :append-to-body="true"
    @close="closeFun"
  >
    <div class="errorCont">
      <img :src="errorImg" />
      <div class="describe">
        <p class="errorTxt">错误码：{{ errorData.code }}</p>
        <p class="desTxt">错误描述：{{ errorData.message }}</p>
        <ul>
          可能原因：
          <template v-if="errorData.body">
            <li v-for="(item, idx) in errorData.body" :key="idx">
              {{ idx + 1 + '.' + item }}
            </li>
          </template>
        </ul>
      </div>
    </div>
    <span slot="footer">
      <el-button class="fBtn" @click="closeFun">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import errorImg from '@/assets/404_images/chucuo.png'
export default {
  name: 'm-error',
  data() {
    return {
      errorImg: errorImg,
      errorData: null
    }
  },
  methods: {
    closeFun() {
      this.$store.state.showError = false
    }
  },
  created() {
    this.errorData = this.$store.state.errorRes
    console.log(this.errorData, 'errorRes')
  }
}
</script>
<style lang="scss" scoped>
.errorDialog {
  .errorCont {
    text-align: center;
    img {
      width: 50%;
      max-height: 100% !important;
      margin: 30px 0;
    }
    .describe {
      padding: 20px;
      text-align: left;
      border: 1px solid #e9e9e9;
      border-radius: 4px;
      font-size: 16px;
      color: #333;
      .errorTxt {
        color: #f80808;
      }
      .desTxt {
        color: #999999;
      }
      p {
        margin-bottom: 10px;
      }
      ul {
        li {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
