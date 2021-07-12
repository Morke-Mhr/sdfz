<template>
  <div class="mainBox">
    <slot name="mheader"></slot>
    <div class="mbody" :style="needFoot ? '' : footCss">
      <div class="mbodyCont">
        <slot name="mbody"></slot>
      </div>
    </div>
    <div v-if="needFoot" class="mfooter">
      <slot name="mfooter"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'main-box',
  props: {
    needFoot: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      footCss: {
        height: 'calc(100vh - 270px)'
      }
    }
  },
  methods: {}
}
</script>
