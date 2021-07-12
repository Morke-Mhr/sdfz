<template>
  <div class="m-progress">
    <div class="progress"></div>
  </div>
</template>

<script>
export default {
  name: 'm-progress',
  data() {
    return {}
  },
  methods: {},
  created() {}
}
</script>

<style lang="scss" scoped>
.m-progress {
  position: fixed;
  background-color: rgba($color: #000000, $alpha: 0.5);
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  top: 0;
  .progress {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    display: inline-block;
    width: 40%;
    height: 26px;
    padding: 1px;
    border-radius: 13px;
    border: solid 1px #d2d2d2;
    background: linear-gradient(180deg, #d2d2d2, #dee1e2);
  }
  .progress:before {
    content: '';
    box-sizing: border-box;
    display: inline-block;
    height: 100%;
    width: 100%;
    border-radius: 13px;
    background: repeating-linear-gradient(
        to left,
        rgba($color: #7cfce0, $alpha: 0.8),
        rgba($color: #0384ea, $alpha: 0.8)
      ),
      repeating-linear-gradient(
        -45deg,
        #0384ea,
        #0384ea 25px,
        #7cfce0 25px,
        #7cfce0 50px
      );
    background-size: 100% 500%;
    -webkit-animation: bg-scroll 250ms infinite linear, progress 500ms linear;
    -moz-animation: bg-scroll 250ms infinite linear, progress 500ms linear;
    animation: bg-scroll 250ms infinite linear, progress 500ms linear;
  }
  .progress::after {
    content: '数据处理中。。。';
    position: absolute;
    width: 100%;
    text-align: center;
    top: 0;
    left: 50%;
    transform: translate(-50%, -120%);
  }
  @-webkit-keyframes bg-scroll {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 -72px;
    }
  }
  @-moz-keyframes bg-scroll {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 -72px;
    }
  }
  @keyframes bg-scroll {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 -72px;
    }
  }
  @-webkit-keyframes progress {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  @-moz-keyframes progress {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  @keyframes progress {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
}
</style>
