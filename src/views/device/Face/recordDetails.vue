<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @getSelectData="getSelectData"
      @handmauruEdit="handmauruEdit"
      :tableData="tableData"
      :tableCol="tableCol"
      :isSelection="true"
      :operationArr="operationArr"
      :wCaozuo="300"
    >
    </m-table>
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
    ></m-pagin>
    <!-- 查看入场照片弹窗开始 -->
    <m-dialog
      title="查看入场照片"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
    >
      <img :src="imgurl" class="imgurls" />
    </m-dialog>
    <!-- 查看入场照片弹窗结束 -->
  </main-box>
</template>

<script>
import {
  getfaceDaoerHistoryList
} from '@/api/equipment/index.js'
import store from '@/store/index.js'

export default {
  name: 'recordDetails',
  props: {
    deviceSn: {
      type: String,
      default () {
        return  
      }
    }
  },
  data() {
    return {
      has: {
        query: 'device:faceDaoerHistory:list',
        add: 'device:face:openDoor',
        edit: 'device:face:rebootDevice'
      },
      // 筛选栏
      searchCol: [
        {
          label: '搜索关键词',
          propVal: 'keyword'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '入场人姓名',
          propVal: 'name'
        },
        {
          label: '识别时间',
          propVal: 'createTime'
        },
        {
          label: '设备编号',
          propVal: 'deviceId'
        }
      ],
      // 操作栏按钮
      operationArr: [
        {
          label: '查看入场照片',
          eventName: 'handmauruEdit'
        }
      ],
      // 进场记录查询
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        deviceSn: '',//this.deviceSn
        keyword: ''
      },
      total: 100,
      listLoading: false,
      tableData: [],
      dialogVisible: false,
      multipleSelection: [],
      // 图片
      imgurl: '',
    }
  },
  async created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    async getList(demand) {
      this.listLoading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await getfaceDaoerHistoryList(demand)
      } else {
        res = await getfaceDaoerHistoryList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 获取列表id
    getSelectData(multipleSelection) {
      this.multipleSelection = multipleSelection.map((item) => {
        return item.id
      })
    },
    // 查看入场照片
    handmauruEdit(scope) {
      this.dialogVisible = true
      this.imgurl =
        store.state.apiConfiguration.url +
        store.state.serviceName.jurisdiction +
        scope.avatar
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    }
  }
}
</script>
<style scoped>
.imgurls {
  margin-left: 40%;
}
</style>
