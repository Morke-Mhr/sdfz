<template>
  <el-tabs class="multistage" v-model="stuentActive">
    <el-tab-pane label="学籍档案" name="record">
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
      stuentActive: 'record'
    }
  },
  methods: {}
}
</script>
