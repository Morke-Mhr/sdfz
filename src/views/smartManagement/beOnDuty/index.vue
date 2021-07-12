<template>
  <el-tabs class="multistage" v-model="listenActive">
   <el-tab-pane label="值班计划" name="plan"> 
        <plan></plan>
      </el-tab-pane>
      <el-tab-pane label="值班指标" name="target">
        <target></target>
      </el-tab-pane>
      <el-tab-pane label="值班记录" name="record"> 
        <record></record>
      </el-tab-pane>
      <el-tab-pane label="值班统计" name="statistics"> </el-tab-pane>
  </el-tabs>
</template>

<script>
import plan from './plan.vue'
import target from './target.vue'
import record from './record.vue'
export default {
  components: { plan, target, record },
  data() {
    return {
      listenActive: 'plan'
    }
  },
  methods: {}
}
</script>

<style lang="" scoped></style>
