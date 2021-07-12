<template>
  <el-tabs class="multistage" v-model="parentActive">
    <el-tab-pane label="家长档案" name="record">
      <record></record>
    </el-tab-pane>
    <!-- <el-tab-pane label="档案统计" name="statistical">
      <statistical></statistical>
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
import record from './components/record.vue'
// import statistical from './components/statistical.vue'
export default {
  components: { record },
  data() {
    return {
      parentActive: 'record'
    }
  },
  methods: {}
}
</script>
