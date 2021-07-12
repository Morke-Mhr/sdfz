<template>
  <div id="app" v-cloak>
    <router-view />
    <m-progress v-if="$store.state.showProgress"></m-progress>
    <m-error v-if="$store.state.showError"></m-error>
    <m-theme></m-theme>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
