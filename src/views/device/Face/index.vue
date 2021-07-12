<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ faceState, shenbenquyu }"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @getSelectData="getSelectData"
      @handlekEdit="handlekEdit"
      @handlegEdit="handlegEdit"
      @handlerecord="handlerecord"
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
    <!-- 进场记录弹窗开始 -->
    <m-dialog
      title="进场记录"
      :visible.sync="detailVisible"
      @closeFun="detailVisible = false"
      className="large"
    >
      <recordDetails :deviceSn="deviceSn"></recordDetails>
    </m-dialog>
    <!-- 进场记录弹窗结束 -->
  </main-box>
</template>

<script>
import {
  getdeviceRegionselect,
  getfaceQueryList,
  getopenDoorList,
  getrebootDeviceList
} from '@/api/equipment/index.js'
import recordDetails from './recordDetails.vue'

export default {
  name: 'index',
  components: { recordDetails },
  data() {
    return {
      has: {
        query: 'device:faceDaoerHistory:list',
        add: 'device:face:openDoor',
        edit: 'device:face:rebootDevice'
      },
      // 筛选栏数据
      faceState: [{ label: '离线', value: '0' }, { label: '在线', value: '1' }],
      shenbenquyu: [],
      // 筛选栏
      searchCol: [
        {
          label: '标签名',
          propVal: 'deviceLabelName'
        },
        {
          label: '设备状态',
          propVal: 'status',
          type: 'select',
          optionsIdx: 'faceState'
        },
        {
          label: '设备区域',
          propVal: 'deviceRegionId',
          type: 'select',
          optionBd: { label: 'regionName', value: 'id' },
          optionsIdx: 'shenbenquyu'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '设备编号',
          propVal: 'deviceCode'
        },
        {
          label: '设备类型',
          propVal: 'deviceTypeName'
        },
        {
          label: '标签',
          propVal: 'deviceLabelName'
        },
        {
          label: '设备位置',
          propVal: 'deviceRegionName'
        },
        {
          label: '位置详情',
          propVal: 'locationDetail'
        },
        {
          label: '设备状态',
          propVal: 'status2',
          atFilter: 'facestate'
        },
        {
          label: '设备IP',
          propVal: 'deviceIp'
        }
      ],
      // 操作栏按钮
      operationArr: [
        {
          label: '开门',
          eventName: 'handlekEdit',
          has: 'device:face:openDoor'
        },
        {
          label: '重启',
          eventName: 'handlegEdit',
          has: 'device:face:rebootDevice'
        },
        {
          label: '进场记录',
          eventName: 'handlerecord',
          has: 'device:faceDaoerHistory:list'
        }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        deviceLabelId: '',
        //设备编号
        deviceLabelName: '',
        //设备类型ID
        deviceTypeId: '',
        //是否离线
        status: '',
        status2: '',
        //设备区域ID
        deviceRegionId: '',
        cascaderValue: [],
        options: []
      },
      total: 100,
      listLoading: false,
      tableData: [],
      detailVisible: false,
      multipleSelection: [],
      // 当前所选详情数据
      deviceSn: ''
    }
  },
  computed: {},
  async created() {
    this.getList()
    this.shenbenquyu = await getdeviceRegionselect()
  },
  methods: {
    // 获取表格数据
    async getList(demand) {
      this.listLoading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await getfaceQueryList(demand)
      } else {
        res = await getfaceQueryList(this.pageForm)
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
    async handlerecord(scope) {
      console.log(scope, '////')
      this.detailVisible = true
      this.deviceSn = scope.deviceSn
      this.listLoading = false
    },
    // 开门
    async handlekEdit(scope) {
      let idRow = scope.id + ''
      const res = await getopenDoorList(idRow)
      console.log(res)
      if (res.code == 200) {
        this.$message({
          type: 'warning',
          message: '开门成功'
        })
      }
    },
    // 重启
    async handlegEdit(scope) {
      let idRow = scope.id + ''
      const res = await getrebootDeviceList(idRow)
      if (res.code == 200) {
        this.$message({
          type: 'warning',
          message: '重启成功'
        })
      }
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
