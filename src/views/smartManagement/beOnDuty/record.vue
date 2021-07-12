<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ scopeArr,currentStatusArr,semesterArr }"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @handleBatchUpload="handleBatchUpload"
      @handleView="handleView"
      @handleUpload="handleUpload"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :operationArr="operationArr"
      :wCaozuo="300"
      v-loading="tableloading"
      rowKey="dutyplanRecordId"
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
    <!-- 修改弹窗-->
    <m-dialog
      :title="busDutyRecordTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="czArr"
    >
      <el-form
        :model="busRecordReport"
        :rules="formRules"
        ref="operationFome"
        label-width="120px"
      >
      <div class="dutyRecordC">
        <el-form-item label="值班记录标题" prop="busDutyplansRecord.title">
          <el-input disabled v-model="busRecordReport.busDutyplansRecord.title"></el-input>
        </el-form-item>
        <el-form-item label="值班范围" prop="scopeName">
          <el-input disabled v-model="busRecordReport.scopeName"></el-input>
        </el-form-item>
        <el-form-item label="值班老师" prop="busDutyplansRecord.dutyPersonnel">
          <el-input disabled v-model="busRecordReport.busDutyplansRecord.dutyPersonnel"></el-input>
        </el-form-item>
      </div>
        <div class="reportC">
          <el-form-item label="值班内容">
            <div class="recordReports" v-for="(item, idx) in busRecordReport.busRecordReports" :key="idx">
              <el-form-item
              :prop="`busRecordReports.${idx}.content`"
              :rules="formRules.content"
              >
              <div class="quotaC">
                <div class="quotaNameC">{{item.quotaName}}</div>
                <div class="spanClass" @click="saveReport(item.recordReportId)" v-show="busRecordReport.isShowData[idx] === 'true'">保存</div>
                <div class="saveSClass" v-show="busRecordReport.isShowDataS[idx] === 'true'">保存成功
                  <i class="saveClass el-icon-success"></i>
                </div>
              </div>
              <div class="editorC">
              <quill-editor 
                ref="myTextEditor" 
                v-model="item.content" 
                :options="editorOption"
                @focus="onEditorFocus(item.recordReportId)"
              >
              </quill-editor>
              </div>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <span class="footTxt" slot="footTxt">
        <span class="red">*填写完所有值班内容指标后，才可生成报告</span>
      </span>
    </m-dialog>


    <!-- 查看详情弹窗-->
    <m-dialog
      :title="busDutyRecordViewTitle"
      :visible.sync="dialogVisibleView"
      @closeFun="dialogVisibleView = false"
      @confirmView="confirmView"
      :dialogBtnArr="czArrView"
    >
      <el-form
        :model="busRecordReport"
        :rules="formRules"
        ref="operationFome"
        label-width="120px"
      >
      <div class="dutyRecordC">
        <el-form-item label="值班记录标题" prop="busDutyplansRecord.title">
          <el-input disabled v-model="busRecordReport.busDutyplansRecord.title"></el-input>
        </el-form-item>
        <el-form-item label="值班范围" prop="scopeName">
          <el-input disabled v-model="busRecordReport.scopeName"></el-input>
        </el-form-item>
        <el-form-item label="值班老师" prop="busDutyplansRecord.dutyPersonnel">
          <el-input disabled v-model="busRecordReport.busDutyplansRecord.dutyPersonnel"></el-input>
        </el-form-item>
      </div>
        <div class="reportC">
          <el-form-item label="值班内容">
            <div class="recordReports" v-for="(item, idx) in busRecordReport.busRecordReports" :key="idx">
              <el-form-item
              :prop="`busRecordReports.${idx}.content`"
              :rules="formRules.content"
              >
              <div class="quotaC">
                <div class="quotaNameC">{{item.quotaName}}</div>
                <div class="spanClass" @click="saveReport(item.recordReportId)" v-show="false">保存</div>
                <div class="saveSClass" v-show="false">保存成功
                  <i class="saveClass el-icon-success"></i>
                </div>
              </div>
              <div class="editorView">
                <quill-editor 
                  ref="viewTextEditor" 
                  :options="editorOptionView"
                  v-model="item.content" 
                  @focus="focus($event)"
                >
                </quill-editor>
              </div>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </m-dialog>
  </main-box>
</template>
<script>
import { getRecord,exportRecord,removeRecord,getIdRecord,exportBatchRecord,editRecord,editReport } from '@/api/smartManagement/dutyPlansRecord.js'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  data() {
    var contentRule = (rule, value, callback) => {
      var num = rule.field.split('.')[1]
      for(var i = 0; i <= num; i++){
        if(num > 0 && this.busRecordReport.isShowDataS[i] == 'false'){
            callback(new Error('有值班指标的内容未完成'))
        }
      }
      if (!value) {
        callback(new Error('请输入值班指标的内容'))
      } else {
        callback()
      }
    }
    return {
      editorOption: {
        modules:{
           toolbar:[
             ['bold', 'italic', 'underline'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['image'],
            ['clean']
           ]
          },
          placeholder: '编辑文本内容'
        },
      editorOptionView: {
        modules:{
           toolbar:[]
          },
          placeholder: '编辑文本内容'
        },
      // 新增表单
      formRules: {
        content: [{validator: contentRule, trigger: 'blur' }],
      },
      total: 0,
      dialogloading: false,
      tableloading: false,
      czArr: [{ btnName: '生成报告', eventName: 'confirm' }],
      czArrView: [{ btnName: '下载报告', eventName: 'confirmView' }],
      dialogType: 'add',
      //修改窗口是否显示
      dialogVisible: false,

      //查看详情窗口是否显示
      dialogVisibleView: false,

      // 弹窗标题
      busDutyRecordTitle: '修改值班记录',
      busDutyRecordViewTitle: '查看值班记录',
      quotaId:"",
      // 表格上方按钮
      tableBtnArr: [{ label: '批量下载', eventName: 'handleBatchUpload' }],
      scopeArr: [{ label: '全部', value: '2' },{ label: '小学部', value: '0' }, { label: '初中部', value: '1' } ],
      currentStatusArr: [{ label: '全部', value: '2' },{ label: '正常', value: '0' }, { label: '逾期', value: '1' } ],
      // 请求的学期数据
      semesterArr:[],
      //查询栏
      searchCol: [
        {
          label: '学期',
          propVal: 'semesterName',
          type: 'select',
          optionBd: { label: 'name', value: 'semesterId' },
          optionsIdx: 'semesterArr'
        },
        {
          label: '值班计划标题',
          propVal: 'title'
        },
        {
          label: '值班范围',
          propVal: 'scope',
          type: 'select',
          optionsIdx: 'scopeArr'
        },
        {
          label: '当前状态',
          propVal: 'currentStatus',
          type: 'select',
          optionsIdx: 'currentStatusArr'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '学期',
          propVal: 'semesterName',
          atFilter:'semesterId'
        },
        {
          label: '值班记录标题',
          propVal: 'title',
          atFilter:'title'
        },
        {
          label: '值班范围',
          propVal: 'scope',
          atFilter:'scope'
        },
        {
          label: '值班老师',
          propVal: 'dutyPersonnel',
          atFilter:'dutyPersonnel'
        },
        {
          label: '当前状态',
          propVal: 'currentStatus',
          atFilter:'currentStatus'
        },
        {
          label: '最后一次修改时间',
          propVal: 'lastUpdateTime',
          atFilter:'lastUpdateTime'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '查看详情', eventName: 'handleView' , opShow: 'need' },
        { label: '下载', eventName: 'handleUpload' , opShow: 'need' },
        { label: '修改', eventName: 'handleEdit'},
        { label: '删除', eventName: 'handleDelete' , opShow: 'need'}
        ],
        //请求参数
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        currentStatus: '',
        scope: '',
        semesterId: ''
      },
      busRecordReport:{
          busDutyplansRecord:'',
          busRecordReports:[],
          scopeName:'',
          isShowData:[],
          isShowDataS:[],
          filePath:''
      },
      tableData: []
    }
  },

 async created() {
    this.getList()
  },
  components: {
      quillEditor
  },
  methods: {
    async onEditorFocus(val) {
      for(let i = 0;i<this.busRecordReport.busRecordReports.length;i++){
        if(this.busRecordReport.busRecordReports[i].recordReportId === val){
            this.busRecordReport.isShowData.splice(i,1,"true")
            this.busRecordReport.isShowDataS.splice(i,1,"false")
        }
      }
    },
    async focus(event) {
      event.enable(false)
    },
    // 列表查询
    async getList(demand) {
      this.listLoading = true
      let res = []
      if (demand) {
        let data = {}
        for (const key in demand) {
          data[key] = demand[key]
        }
        this.pageForm.pageNum = 1
        this.pageForm.pageSize = data.pageSize
       
        this.pageForm = data
        res = await getRecord(data)
      } else {
        res = await getRecord(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 分页
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    },
     
    //批量下载
    async handleBatchUpload(){
       this.tableloading = true
      let recordId = []
      for(let record of this.tableData){
          recordId.push(record.dutyplanRecordId)
      }
      let busDutyplansRecord = {
        ids:recordId
      }
      await exportBatchRecord(busDutyplansRecord)
      this.tableloading = false
    },
   
    //查看详情
    async handleView(v){
      let res = await getIdRecord(v.dutyplanRecordId)    
      
      this.busRecordReport.busDutyplansRecord = res.busDutyplansRecord
      for(let scope of this.scopeArr){
        if(this.busRecordReport.busDutyplansRecord.scope === scope.value){
          this.busRecordReport.scopeName = scope.label
        }
      }
      this.busRecordReport.busRecordReports = res.busRecordReports
      this.dialogVisibleView = true
    },
    //下载
    async handleUpload(v){
       this.tableloading = true
       await exportRecord(v)
      this.tableloading = false
    },
    //删除
    async handleDelete(v){
      await removeRecord(v.dutyplanRecordId)
      this.getList()
    },
    // 修改
    async handleEdit(v) {
      let res = await getIdRecord(v.dutyplanRecordId)

      this.busRecordReport.busDutyplansRecord = res.busDutyplansRecord
      for(let scope of this.scopeArr){
        if(this.busRecordReport.busDutyplansRecord.scope === scope.value){
          this.busRecordReport.scopeName = scope.label
        }
      }
      this.busRecordReport.busRecordReports = res.busRecordReports
      let showList = []
      let showListS = []
      for(var i = 0;i<this.busRecordReport.busRecordReports.length;i++){
        if(this.busRecordReport.isShowData.length < 0){
          showList.push("true")
        }else{
          showList.push("false")
        }
        if(this.busRecordReport.isShowDataS.length < 0){
          showListS.push("false")
        }else{
          showListS.push("true")
        }
      }
      this.busRecordReport.isShowData = showList
      this.busRecordReport.isShowDataS = showListS

      this.dialogVisible = true
    },

    async saveReport(val){
      for(let i = 0;i<this.busRecordReport.busRecordReports.length;i++){
        if(this.busRecordReport.busRecordReports[i].recordReportId === val){
          let value = await editReport(this.busRecordReport.busRecordReports[i])
          if(value){
              this.busRecordReport.isShowData.splice(i,1,"false")
              this.busRecordReport.isShowDataS.splice(i,1,"true")
          }
        }
      }
    },
    // 确定按钮
    async confirm() {
      // 表单验证
      this.$refs['operationFome'].validate(async (valid) => {
        if (valid) {
          // 生成报告
          console.log(this.dialogType)
          if (this.dialogType == 'add') {
            console.log(this.busRecordReport.busRecordReports)
            let reportData = {
              busRecordReports:this.busRecordReport.busRecordReports
            }
            
            await editRecord(reportData)
          }else{
            let dutyplansRecord = this.busRecordReport.busDutyplansRecord
            console.log(dutyplansRecord)
            await exportRecord(dutyplansRecord)
          }
          this.dialogVisible = false
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
     // 确定按钮
    async confirmView() {
      let dutyplansRecord = this.busRecordReport.busDutyplansRecord
      console.log(dutyplansRecord)
      await exportRecord(dutyplansRecord)
      this.dialogVisibleView = false
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .recordReports{
  margin-bottom: 20px;
}
::v-deep .recordReports .el-textarea .el-textarea__inner{
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0;
}
::v-deep .recordReports .quotaC{
  width:100%;
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: #F0F0F0;
}
.spanClass{
  font-size: 14px;
  color: #009B4C;
  margin-right:9px;
  width:79px;
  display: inline-block;
  text-align: right;
}
.saveClass{
  color:#989898;
  margin-right:5px;
  display: inline-block;
}
.saveSClass{
  font-size: 14px;
  color: #989898;
  margin-right:16px;
  width:79px;
  display: inline-block;
}
.quotaNameC{
  display: inline-block;
  width:calc(100% - 113px);
  font-size: 14px;
  margin-left: 14px;
}

::v-deep  .reportC .recordReports .editorC .quill-editor .ql-toolbar{
  padding:0;
}

::v-deep .reportC .recordReports .editorView .quill-editor .ql-toolbar{
   height:0;
   padding:0;
}

::v-deep .ql-editor{
  font-size:14px;
}

::v-deep .dutyRecordC .el-form-item{
  margin-bottom:20px;
}
.footTxt {
    margin-right: 30px;
    font-weight: 700;
    font-size: 14px;
    em {
      font-style: normal;
      font-size: 22px;
      height: 40px;
      line-height: 40px;
    }
    .red {
      color: #ff0000;
    }
    .samll {
      font-size: 10px;
    }
  }
</style>
