<template>
  <el-tabs class="multistage" v-model="listenActive">
    <el-tab-pane label="听评课记录" name="record">
      <record></record>
    </el-tab-pane>
    <el-tab-pane label="评价方案" name="evaluationScheme">
      <evaluationScheme></evaluationScheme>
    </el-tab-pane>
    <el-tab-pane label="听评课类型" name="classType">
      <classType></classType>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import record from './components/record.vue'
import evaluationScheme from './components/evaluationScheme.vue'
import classType from './components/classType.vue'
export default {
  components: { record, evaluationScheme, classType },
  data() {
    return {
      listenActive: 'record'
    }
  },
  methods: {}
}
</script>

<style lang="" scoped></style>
