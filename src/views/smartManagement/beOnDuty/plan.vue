<template>
  <main-box :needFoot="false">
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      :optionObj="{ scopeArr,planTypeArr,semesterArr }"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @handleAdd="handleAdd"
      @handleEdit="handleEdit"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :operationArr="operationArr"
      :wCaozuo="300"
      v-loading="tableloading"
      rowKey="dutyplanId"
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
    <m-dialog
      :title="dialogType === 'add' ? '新增计划' : '修改计划'"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="czArr"
      v-loading="dialogloading"
      className='small'
    >
      <el-form
        :model="dutyPlansData"
        :rules="formRules"
        ref="dutyPlansData"
        label-width="120px"
      >
        <div class="semesterIdC">
          <el-form-item label="学期编号" prop="dutyplans.semesterId" v-show="false">
            <el-input v-model="dutyPlansData.dutyplans.semesterId"></el-input>
          </el-form-item>
        </div>
        <div class="semesterNameC">
          <el-form-item label="学期名称" prop="dutyplans.semesterName" v-show="false">
            <el-input v-model="dutyPlansData.dutyplans.semesterName"></el-input>
          </el-form-item>
        </div>
        <div class="titleC">
          <el-form-item label="值班计划标题" prop="dutyplans.title">
            <el-input v-model="dutyPlansData.dutyplans.title"></el-input>
          </el-form-item>
        </div>
        <div class="planTypeC">
          <el-form-item label="计划类型" prop="dutyplans.planType">
            <el-radio-group v-model="dutyPlansData.dutyplans.planType">
              <el-radio :label="'0'">长期</el-radio>
              <el-radio :label="'1'">临时</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="scopeC">
          <el-form-item label="值班范围" prop="dutyplans.scope">
            <el-radio-group v-model="dutyPlansData.dutyplans.scope">
              <el-radio :label="'0'">小学部</el-radio>
              <el-radio :label="'1'">初中部</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>


          <div class="dutyPersionelTime" v-if="dutyPlansData.dutyplans.planType=='1'">
          <el-form-item label="值班时间" prop='dutyPersionelProject'>
              <div class="startTimeC" v-for="(item, idx) in dutyPlansData.dutyPersionelProject" :key="idx">
                <div class="dutyTime">
                  <el-form-item :prop="`dutyPersionelProject.${idx}.dutyTime`"
                    :rules="formRules.dutyTime">
                    <el-date-picker
                      v-model="item.dutyTime"
                      type="date"
                      placeholder="值班时间"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                    <div class="deleteDuty">
                      <el-button 
                        icon="el-icon-delete"
                        @click="deleteDutyTime(idx)"
                        ></el-button>
                      </div>
                  </el-form-item>
                </div>
                <div class="shortUsers">
                  <el-form-item :prop="`dutyPersionelProject.${idx}.dutyPlanTimePer`">
                    <div class="userX"><div v-if="dutyPlansData.dutyPersionelProject[idx].ifdata == true && dutyPlansData.dutyPersionelProject[idx].dutyPlanTimePer.length > 0"><span class="userClassX" v-for="(user) in dutyPlansData.dutyPersionelProject[idx].dutyPlanTimePer" :key="user.userId" >{{user.userName}}<i class="iconClass el-icon-error"></i></span></div></div>
                      <a class="personlc" @click="range(idx)">人员选择</a>
                  </el-form-item>
                </div>
              </div>
              <div class="shortModel">
                <el-button 
                icon="el-icon-plus"
                @click="addDutyDate()"
                >添加日期</el-button>
              </div>
          </el-form-item>
        </div>



        <div class="checkboxC" v-if="dutyPlansData.dutyplans.planType=='0'">
          <div class="timeArrC">
            <el-form-item label="值班时间" prop="dutyplans.timeArr">
              <el-date-picker
                    v-model="dutyPlansData.dutyplans.timeArr"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="请选择开始日期"
                    end-placeholder="请选择结束日期"
                    value-format="yyyy-MM-dd"
                    @change="timeArrChange"
                  >
                  </el-date-picker>
            </el-form-item>
          </div>
          <div class="weekC">
            <el-form-item v-show="dutyPlansData.selectData" prop="dutyplans.week">
              <el-checkbox-group v-model="dutyPlansData.dutyplans.week">
                <div class="week1">
                  <el-checkbox label="1">星期一</el-checkbox>
                    <div class="userC">
                      <div v-if="dutyPlansData.dutyplansPersonnels1.length != 0">
                      <span class="userClass" v-for="(user,idx) in dutyPlansData.dutyplansPersonnels1" :key="idx" >{{user.userName}}
                        <i class="iconClass el-icon-error" @click="deleteUserP(idx,'w1')"></i>
                        </span>
                        </div>
                        </div>
                    <a class="personlc" @click="range('w1')">人员选择</a>
                </div>
                <div class="week2">
                  <el-checkbox label="2">星期二</el-checkbox>
                    <div class="userC">
                      <div v-if="dutyPlansData.dutyplansPersonnels2.length != 0">
                        <span class="userClass" v-for="(user,idx) in dutyPlansData.dutyplansPersonnels2" :key="idx" >{{user.userName}}
                          <i class="iconClass el-icon-error" @click="deleteUserP(idx,'w2')"></i>
                          </span>
                          </div>
                          </div>
                    <a class="personlc" @click="range('w2')">人员选择</a>
                </div>
                <div class="week3">
                  <el-checkbox label="3">星期三</el-checkbox>
                    <div class="userC">
                      <div v-if="dutyPlansData.dutyplansPersonnels3.length != 0">
                        <span class="userClass" v-for="(user,idx) in dutyPlansData.dutyplansPersonnels3" :key="idx" >{{user.userName}}
                          <i class="iconClass el-icon-error" @click="deleteUserP(idx,'w3')"></i>
                          </span>
                          </div>
                          </div>
                    <a class="personlc" @click="range('w3')">人员选择</a>
                </div>
                <div class="week4">
                  <el-checkbox label="4">星期四</el-checkbox>
                    <div class="userC">
                      <div v-if="dutyPlansData.dutyplansPersonnels4.length != 0">
                        <span class="userClass" v-for="(user,idx) in dutyPlansData.dutyplansPersonnels4" :key="idx" >{{user.userName}}
                          <i class="iconClass el-icon-error" @click="deleteUserP(idx,'w4')"></i>
                          </span>
                          </div>
                          </div>
                    <a class="personlc" @click="range('w4')">人员选择</a>
                </div>
                <div class="week5">
                  <el-checkbox label="5">星期五</el-checkbox>
                    <div class="userC">
                      <div v-if="dutyPlansData.dutyplansPersonnels5.length != 0">
                        <span class="userClass" v-for="(user,idx) in dutyPlansData.dutyplansPersonnels5" :key="idx" >{{user.userName}}
                          <i class="iconClass el-icon-error" @click="deleteUserP(idx,'w5')" >
                            </i>
                            </span>
                            </div>
                            </div>
                    <a class="personlc" @click="range('w5')">人员选择</a>
                </div>
                <div class="week6">
                  <el-checkbox label="6">星期六</el-checkbox>
                    <div class="userC">
                      <div v-if="dutyPlansData.dutyplansPersonnels6.length != 0">
                        <span class="userClass" v-for="(user,idx) in dutyPlansData.dutyplansPersonnels6" :key="idx" >{{user.userName}}
                          <i class="iconClass el-icon-error" @click="deleteUserP(idx,'w6')"></i>
                          </span>
                          </div>
                          </div>
                    <a class="personlc" @click="range('w6')">人员选择</a>
                </div>
                <div class="week7">
                  <el-checkbox label="7">星期日</el-checkbox>
                    <div class="userC">
                      <div v-if="dutyPlansData.dutyplansPersonnels7.length != 0">
                        <span class="userClass" v-for="(user,idx) in dutyPlansData.dutyplansPersonnels7" :key="idx" >{{user.userName}}
                          <i class="iconClass el-icon-error" @click="deleteUserP(idx,'w7')"></i>
                          </span>
                          </div>
                          </div>
                    <a class="personlc" @click="range('w7')">人员选择</a>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
        <div class="personnelQuota" v-if="dutyPlansData.dutyplans.planType=='0'">
          <el-form-item label="值班领导" prop="dutyplansPersonnelsL">
            <div class="userL">
              <div v-if="dutyPlansData.dutyplansPersonnelsL.length != 0">
                <span class="userClass" v-for="(user,idx) in dutyPlansData.dutyplansPersonnelsL" :key="idx" >{{user.userName}}
                  <i class="iconClass el-icon-error" @click="deleteUser(idx)"> 
                  </i>
                </span>
              </div>
            </div>
            <a class="personlc" @click="range('L')">人员选择</a>
          </el-form-item>
          <div class="quotaC">
            <el-form-item label="值班指标" prop="busQuotas">  
                <el-transfer
                      v-model="dutyPlansData.busQuotas"
                      :data="dutyPlansData.quotaData"
                      :props="{
                        key: 'quotaId',
                        label: 'name'
                      }"
                      :button-texts="['取消','选择']"
                    ></el-transfer>
              </el-form-item>
          </div>
        </div>
      </el-form>
    </m-dialog>
    <rangePeople
      ref="rangePeople"
      v-if="dialogVisible"
      @choiceUser="choiceUser"
      :treedata="treedata"
      :treeProps="treeProps"
    ></rangePeople>
  </main-box>
</template>
<script>
 
import { getPlans,postPlans,putPlans,getIdPlans} from '@/api/smartManagement/dutyPlans.js'
import { semesterList,currentSemester} from '@/api/basic/semester.js'
import { scopeAll} from '@/api/smartManagement/beOnDuty.js'
import rangePeople from '@/components/rangePeople' //通过部门选择人
import {
  getqueryTeacherList
} from '@/api/comment/index.js'
export default {
  components: {
    rangePeople
  },
  data() {
    var dutyTimeRule = (rule, value, callback) => {
      var num = rule.field.split('.')[1]
      var returnValue = "false";
      for(var i = 0; i <= num; i++){
        if(num > 0 && i != num && this.dutyPlansData.dutyPersionelProject[i].dutyTime === value){
          returnValue = "true"
        }
      }
      if (!value) {
        callback(new Error('请选择值班时间'))
      } else if (returnValue === "true")
       {
        callback(new Error('值班时间不能存在两个相同时间'))
      } else {
        callback()
      }
    }
    return {
       has: {
        list: 'workbench:dutyplans:list',
        query: 'workbench:dutyplans:query',
        add: 'workbench:dutyplans:add',
        edit: 'workbench:dutyplans:edit'
      },
       treeProps: {
        // 子数据
        children: 'children',
        // 唯一标识
        id: 'id',
        // 名称
        label: 'label'
      },
      // 新增表单
      formRules: {
        "dutyplans.title": [{ required: true, message: '请输入值班计划标题', trigger: 'blur' }],
        "dutyplans.scope": [{ required: true, message: '请选择值班范围', trigger: 'change' }],
        "dutyplans.planType": [{ required: true, message: '请选择值班类型', trigger: 'change' }],
        "dutyplans.week": [{ required: true, message: '请选择星期', trigger: 'blur' }],
        dutyplansPersonnelsL: [{ required: true, message: '请选择值班领导', trigger: 'blur' }],
        busQuotas: [{ required: true, message: '请选择值班指标', trigger: 'blur' }],
        "dutyplans.timeArr": [
          { required: true, message: '请选择值班时间', trigger: 'change' }
        ],
        dutyPersionelProject: [{ required: true, message: '请添加值班时间', trigger: 'blur' }],
        dutyTime: [{validator: dutyTimeRule, trigger: 'change' }]
      },
      total: 0,
      dialogloading: false,
      tableloading: false,
      czArr: [{ btnName: '保存', eventName: 'confirm' }],
      dialogType: 'add',
      dialogVisible: false,
      // 表格上方按钮
      tableBtnArr: [{ label: '新增', eventName: 'handleAdd' , has: 'workbench:dutyplans:add'}],
      scopeArr: [{ label: '全部', value: '2' },{ label: '小学部', value: '0' }, { label: '初中部', value: '1' } ],
      planTypeArr: [{ label: '全部', value: '2' },{ label: '长期', value: '0' }, { label: '临时', value: '1' } ],
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
          label: '计划类型',
          propVal: 'planType',
          type: 'select',
          optionsIdx: 'planTypeArr'
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
          label: '值班计划标题',
          propVal: 'title',
          atFilter:'title'
        },
        {
          label: '值班范围',
          propVal: 'scope',
          atFilter:'scope'
        },
        {
          label: '计划类型',
          propVal: 'planType',
          atFilter:'planType'
        },
        {
          label: '发布人',
          propVal: 'createBy',
          atFilter:'createBy'
        },
        {
          label: '发布时间',
          propVal: 'createTime',
          atFilter:'createTime'
        }
      ],
      // 操作栏按钮
      operationArr: [{ label: '修改', eventName: 'handleEdit', has: 'workbench:dutyplans:edit' }],
      //请求参数
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        planType: '',
        scope: '',
        semesterId: ''
      },

      semester:'',
      busDutyplans:{
        dutyplanId:'',
        title:'',
        planType:'',
        scope:'',
        week:[],
        semesterId:'',
        semesterName:'',
        startTime:'',
        endTime:'',
        // 有效时间数组
        timeArr: ''
      },
      dutyWeek:'',
      
      dutyPlansData:{
        dutyplans:'',
        dutyplansPersonnels:[],
        dutyplansPersonnelsL:[],
        quotas:[],
        busQuotas:[],
        //显示隐藏
        selectData:'',
        dutyplansPersonnels1:[],
        dutyplansPersonnels2:[],
        dutyplansPersonnels3:[],
        dutyplansPersonnels4:[],
        dutyplansPersonnels5:[],
        dutyplansPersonnels6:[],
        dutyplansPersonnels7:[],
        quotaData:[],
        dutyPersionelProject: [],
      },
      treedata:[],
      tableData: []
    }
  },

  async created() {
    this.getList()
    let res =await semesterList()
    this.semesterArr = res.rows
    let semesterObje = {
      semesterId:'2',
      name:'全部'
    }
    this.semesterArr.splice(0,0,semesterObje)
    this.getqueryTeacherList()
    this.initData()
  },
  methods: {
    // 部门树形
    async getqueryTeacherList() {
      
     //  教师
      let Teacher = await getqueryTeacherList()
      this.treedata = [...Teacher]
    },
    //新增初始化数据
    async initData(){
     this.semester = await currentSemester()
     this.busDutyplans.startTime = this.semester.startTime
     this.busDutyplans.endTime = this.semester.endTime
     this.busDutyplans.semesterId = this.semester.semesterId
     this.busDutyplans.semesterName = this.semester.name
     this.busDutyplans.scope = '0'
     this.busDutyplans.planType='0'
     this.busDutyplans.timeArr = [
        this.busDutyplans.startTime,
        this.busDutyplans.endTime
      ]
      this.dutyPlansData.dutyplans = this.busDutyplans
      this.dutyPlansData.dutyplansPersonnels = []

      let quotaRows = await scopeAll(this.busDutyplans.scope)
      let busQuotas = quotaRows.rows
      
      for (let i = 0; i < busQuotas.length; i++) {
          this.dutyPlansData.quotaData.push({
            quotaId: busQuotas[i].quotaId,
            name: busQuotas[i].name,
          })
        }
      this.dutyPlansData.dutyplans.week = []

      if(this.busDutyplans.timeArr.length > 0 ){
          this.dutyPlansData.selectData = true
        }else{
          this.dutyPlansData.selectData = false
        }
    },
    
    // 有效时间更变
    async timeArrChange(val) {
      if (val && val.length > 0) {
        this.busDutyplans.startTime = val[0]
        this.busDutyplans.endTime = val[1]
      }
       if(val && val.length > 0 ){
          this.dutyPlansData.selectData = true
        }else{
          this.dutyPlansData.selectData = false
        }
    },
    // 人员选择是否显示
    async range(val) {
        this.dutyWeek = val
        if(val !== "L" && val+''.indexOf('w') > 0){
          for(let v of this.dutyPlansData.dutyplans.week){
            if(v !== val.replace('w','')){
              break
            }
          }
        }
        this.$refs.rangePeople.isShow = true
    },
   
    async choiceUser(data) {
      // 选择人员数组
      console.log(data)
      let datalist = []
      for (let v of data) {
        let obj = {}
        obj.userId = v.id
        obj.userName = v.label
        datalist.push(obj)
      }
      if(this.dutyWeek === "w1"){
        this.$set(this.dutyPlansData, 'dutyplansPersonnels1', datalist)
        this.$refs.dutyPlansData.validateField('dutyplansPersonnels1')
      }else if(this.dutyWeek==="w2"){
        this.$set(this.dutyPlansData, 'dutyplansPersonnels2', datalist)
        this.$refs.dutyPlansData.validateField('dutyplansPersonnels2')
      }else if(this.dutyWeek==="w3"){
       this.$set(this.dutyPlansData, 'dutyplansPersonnels3', datalist)
        this.$refs.dutyPlansData.validateField('dutyplansPersonnels3')
      }else if(this.dutyWeek==="w4"){
        this.$set(this.dutyPlansData, 'dutyplansPersonnels4', datalist)
        this.$refs.dutyPlansData.validateField('dutyplansPersonnels4')
      }else if(this.dutyWeek==="w5"){
        this.$set(this.dutyPlansData, 'dutyplansPersonnels5', datalist)
        this.$refs.dutyPlansData.validateField('dutyplansPersonnels5')
      }else if(this.dutyWeek==="w6"){
        this.$set(this.dutyPlansData, 'dutyplansPersonnels6', datalist)
        this.$refs.dutyPlansData.validateField('dutyplansPersonnels6')
      }else if(this.dutyWeek==="w7"){
        this.$set(this.dutyPlansData, 'dutyplansPersonnels7', datalist)
        this.$refs.dutyPlansData.validateField('dutyplansPersonnels7')
      }else if(this.dutyWeek==="L"){
        this.$set(this.dutyPlansData, 'dutyplansPersonnelsL', datalist)
        this.$refs.dutyPlansData.validateField('dutyplansPersonnelsL')
      }else if(this.dutyWeek >= 0){
        this.$set(this.dutyPlansData.dutyPersionelProject[this.dutyWeek], 'dutyPlanTimePer', datalist)
        this.$refs.dutyPlansData.validateField('dutyPersionelProject')
        this.$set(this.dutyPlansData.dutyPersionelProject[this.dutyWeek], 'ifdata', true)
      }
      this.$refs.rangePeople.isShow = false
      
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
        res = await getPlans(data)
      } else {
        res = await getPlans(this.pageForm)
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
   async addDutyDate(){
     this.dutyPlansData.dutyPersionelProject.push([])
   },
   async deleteDutyTime(idx){
    this.dutyPlansData.dutyPersionelProject.splice(idx, 1)
   },
   //删除值班领导名字
   async deleteUser(val){
     this.dutyPlansData.dutyplansPersonnelsL.splice(val, 1)
   },
   //删除值班员工名字
   async deleteUserP(idx,val){
     if(val === "w1"){
      this.dutyPlansData.dutyplansPersonnels1.splice(idx, 1)
     }else if(val === "w2"){
      this.dutyPlansData.dutyplansPersonnels2.splice(idx, 1)
     }else if(val === "w3"){
      this.dutyPlansData.dutyplansPersonnels3.splice(idx, 1)
     }else if(val === "w4"){
      this.dutyPlansData.dutyplansPersonnels4.splice(idx, 1)
     }else if(val === "w5"){
      this.dutyPlansData.dutyplansPersonnels5.splice(idx, 1)
     }else if(val === "w6"){
      this.dutyPlansData.dutyplansPersonnels6.splice(idx, 1)
     }else if(val === "w7"){
      this.dutyPlansData.dutyplansPersonnels6.splice(idx, 1)
     }
   },
   
    // 新增按钮
   async handleAdd() {
      this.dialogloading = true
      this.dialogType = 'add'
      if (this.$refs['dutyPlansData']) {
        this.$refs['dutyPlansData'].resetFields()
      }
     this.dutyPlansData.dutyplansPersonnels1 = []
     this.dutyPlansData.dutyplansPersonnels2 = []
     this.dutyPlansData.dutyplansPersonnels3 = []
     this.dutyPlansData.dutyplansPersonnels4 = []
     this.dutyPlansData.dutyplansPersonnels5 = []
     this.dutyPlansData.dutyplansPersonnels6 = []
     this.dutyPlansData.dutyplansPersonnels7 = []
     this.dutyPlansData.dutyplansPersonnelsL = []

     this.dutyPlansData.dutyplans.week = []
      this.dutyPlansData.dutyPersionelProject=[]
      this.dialogVisible = true
      this.dialogloading = false
    },
    // 修改按钮
    async handleEdit(v) {
      this.dialogloading = true
      this.dialogType = 'edit'
      this.dutyPlansData.dutyplans.week = []
      let res = await getIdPlans(v.dutyplanId)
      this.dutyPlansData.dutyplans.scope = res.busDutyplans.scope
      this.dutyPlansData.dutyplans.planType = res.busDutyplans.planType
      this.dutyPlansData.dutyplans.semesterId = res.busDutyplans.semesterId
      this.dutyPlansData.dutyplans.semesterName = res.busDutyplans.semesterName
      this.dutyPlansData.dutyplans.startTime = res.busDutyplans.startTime
      this.dutyPlansData.dutyplans.endTime = res.busDutyplans.endTime
      this.dutyPlansData.dutyplans.title = res.busDutyplans.title
      this.dutyPlansData.dutyplans.dutyplanId = res.busDutyplans.dutyplanId
      this.dutyPlansData.dutyplansPersonnels = res.busDutyplansPersonnels
     
      this.busDutyplans.timeArr = [
        res.busDutyplans.startTime,
        res.busDutyplans.endTime
      ]
      console.log(res.busDutyplans.planType)
      if(res.busDutyplans.planType == '0'){
        if(res.busDutyplans.week.indexOf(',') >= 0){
          this.dutyPlansData.dutyplans.week = res.busDutyplans.week.split(',')
        }else{
          this.dutyPlansData.dutyplans.week = [res.busDutyplans.week]
        }
        let personnels1 = []
        let personnels2 = []
        let personnels3 = []
        let personnels4 = []
        let personnels5 = []
        let personnels6 = []
        let personnels7 = []
        let personnelsL = []

        for(let personel of res.busDutyplansPersonnels){
          if(personel.week === "1" && personel.personnelType === "0"){      
            personnels1.push(personel)
          }else if(personel.week === "2" && personel.personnelType === "0"){
            personnels2.push(personel)
          }else if(personel.week === "3" && personel.personnelType === "0"){
            personnels3.push(personel)
          }else if(personel.week === "4" && personel.personnelType === "0"){
            personnels4.push(personel)
          }else if(personel.week === "5" && personel.personnelType === "0"){
            personnels5.push(personel)
          }else if(personel.week === "6" && personel.personnelType === "0"){
            personnels6.push(personel)
          }else if(personel.week === "7" && personel.personnelType === "0"){
            personnels7.push(personel)
          }else if(personel.personnelType === "1"){
            personnelsL.push(personel)
          }
        }
        this.$set(this.dutyPlansData, 'dutyplansPersonnels1', personnels1)
        this.$set(this.dutyPlansData, 'dutyplansPersonnels2', personnels2)
        this.$set(this.dutyPlansData, 'dutyplansPersonnels3', personnels3)
        this.$set(this.dutyPlansData, 'dutyplansPersonnels4', personnels4)
        this.$set(this.dutyPlansData, 'dutyplansPersonnels5', personnels5)
        this.$set(this.dutyPlansData, 'dutyplansPersonnels6', personnels6)
        this.$set(this.dutyPlansData, 'dutyplansPersonnels7', personnels7)
        this.$set(this.dutyPlansData, 'dutyplansPersonnelsL', personnelsL)
      }else{
       this.dutyPlansData.dutyplans.week = []
       let itmeNew = ''
       let personelNew = []
       for(let v of res.busDutyplansPersonnels){
           let users = []
           let obj = {}
           if(itmeNew.indexOf(v.dutyTime) >= 0){
             continue
           }
          for(let i = 0;i<res.busDutyplansPersonnels.length;i++){
              let user = {}
              if(v.dutyTime == res.busDutyplansPersonnels[i].dutyTime){
                user.userId = res.busDutyplansPersonnels[i].userId
                user.userName = res.busDutyplansPersonnels[i].userName
                users.push(user)
                continue
              }
          }
          itmeNew += v.dutyTime+","
          obj.dutyTime = v.dutyTime
          obj.dutyPlanTimePer = users
          obj.ifdata = true
          personelNew.push(obj)
        }
         this.$set(this.dutyPlansData, 'dutyPersionelProject', personelNew)
      }

      for(let i = 0;i < this.dutyPlansData.quotaData.length; i++){
        for(let j = 0;j < res.busQuotas.length; j++){
          if(this.dutyPlansData.quotaData[i].quotaId === res.busQuotas[j].quotaId){
              this.dutyPlansData.busQuotas[j] = res.busQuotas[j].quotaId
          }
        }
      }
      this.dialogloading = false
      this.dialogVisible = true
    },
    // 确定按钮
    async confirm() {
      // 表单验证
      this.$refs['dutyPlansData'].validate(async (valid) => {
        if (valid) {
          // 新增
          if (this.dialogType == 'add') {
            if(this.dutyPlansData.dutyplans.planType == '0'){
                for (let v of this.dutyPlansData.dutyplansPersonnels1) {
                let plansPersionnel = {}
                plansPersionnel.userId = v.userId
                plansPersionnel.userName = v.userName
                plansPersionnel.week = "1"
                plansPersionnel.personnelType = "0"
                this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
              }
              for (let v of this.dutyPlansData.dutyplansPersonnels2) {
                let plansPersionnel = {}
                plansPersionnel.userId = v.userId
                plansPersionnel.userName = v.userName
                plansPersionnel.week = "2"
                plansPersionnel.personnelType = "0"
                this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
              }
              for (let v of this.dutyPlansData.dutyplansPersonnels3) {
                let plansPersionnel = {}
                plansPersionnel.userId = v.userId
                plansPersionnel.userName = v.userName
                plansPersionnel.week = "3"
                plansPersionnel.personnelType = "0"
                this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
              }
              for (let v of this.dutyPlansData.dutyplansPersonnels4) {
                let plansPersionnel = {}
                plansPersionnel.userId = v.userId
                plansPersionnel.userName = v.userName
                plansPersionnel.week = "4"
                plansPersionnel.personnelType = "0"
                this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
              }
              for (let v of this.dutyPlansData.dutyplansPersonnels5) {
                let plansPersionnel = {}
                plansPersionnel.userId = v.userId
                plansPersionnel.userName = v.userName
                plansPersionnel.week = "5"
                plansPersionnel.personnelType = "0"
                this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
              }
              for (let v of this.dutyPlansData.dutyplansPersonnels6) {
                let plansPersionnel = {}
                plansPersionnel.userId = v.userId
                plansPersionnel.userName = v.userName
                plansPersionnel.week = "6"
                plansPersionnel.personnelType = "0"
                this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
              }
              for (let v of this.dutyPlansData.dutyplansPersonnels7) {
                let plansPersionnel = {}
                plansPersionnel.userId = v.userId
                plansPersionnel.userName = v.userName
                plansPersionnel.week = "7"
                plansPersionnel.personnelType = "0"
                this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
              }

              for (let v of this.dutyPlansData.dutyplansPersonnelsL) {
                let plansPersionnel = {}
                plansPersionnel.userId = v.userId
                plansPersionnel.userName = v.userName
                plansPersionnel.personnelType = "1"
                this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
              }
            }else{
              for (let v of this.dutyPlansData.dutyPersionelProject) {
                  for(let d of v.dutyPlanTimePer){
                    let plansPersionnel = {}
                    plansPersionnel.userId = d.userId
                    plansPersionnel.userName = d.userName
                    plansPersionnel.dutyTime =v.dutyTime 
                    this.dutyPlansData.dutyplansPersonnels.push(plansPersionnel)
                  }
              }
            }
            for(let i = 0;i < this.dutyPlansData.quotaData.length; i++){
               for(let j = 0;j < this.dutyPlansData.busQuotas.length; j++){
                  if(this.dutyPlansData.quotaData[i].quotaId === this.dutyPlansData.busQuotas[j]){
                    let busquota = {}
                    busquota.quotaId = this.dutyPlansData.quotaData[i].quotaId
                    busquota.name = this.dutyPlansData.quotaData[i].name
                    this.dutyPlansData.quotas.push(busquota)
                  }
               }
               
            }
            let dataTable = {
               busDutyplans:{
                 semesterId: this.dutyPlansData.dutyplans.semesterId,
                 semesterName: this.dutyPlansData.dutyplans.semesterName,
                 planType: this.dutyPlansData.dutyplans.planType,
                 scope: this.dutyPlansData.dutyplans.scope,
                 week: this.dutyPlansData.dutyplans.week.join(','),
                 startTime: this.dutyPlansData.dutyplans.timeArr[0],
                 endTime: this.dutyPlansData.dutyplans.timeArr[1],
                 title: this.dutyPlansData.dutyplans.title
               },
              busDutyplansPersonnels:this.dutyPlansData.dutyplansPersonnels,
              busQuotas:this.dutyPlansData.quotas,
            }
            await postPlans(dataTable)
            
          } else {
             let persionData = []
             if(this.dutyPlansData.dutyplans.planType == '0'){
                persionData = this.dutyPlansData.dutyplansPersonnels
             }else{
              for (let v of this.dutyPlansData.dutyPersionelProject) {
                for(let d of v.dutyPlanTimePer){
                      let plansPersionnel = {}
                      plansPersionnel.userId = d.userId
                      plansPersionnel.userName = d.userName
                      plansPersionnel.dutyTime =v.dutyTime 
                      persionData.push(plansPersionnel)
                    }
                }
             }
            let dataTable = {
               busDutyplans:{
                 dutyplanId:this.dutyPlansData.dutyplans.dutyplanId,
                 semesterId: this.dutyPlansData.dutyplans.semesterId,
                 semesterName: this.dutyPlansData.dutyplans.semesterName,
                 planType: this.dutyPlansData.dutyplans.planType,
                 scope: this.dutyPlansData.dutyplans.scope,
                 week: this.dutyPlansData.dutyplans.week.join(','),
                 startTime: this.dutyPlansData.dutyplans.timeArr[0],
                 endTime: this.dutyPlansData.dutyplans.timeArr[1],
                 title: this.dutyPlansData.dutyplans.title
               },
              busDutyplansPersonnels:persionData,
              busQuotas:this.dutyPlansData.quotas,
            }
            // 修改
            await putPlans(dataTable)
          }
          this.dialogVisible = false
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.personlc{
  font-size: 14px;
  color: #175EB6;
  border-bottom: 1px solid #175EB6;
  margin-left: 10px;
}
.deleteDuty{
  display: inline-block;
}
::v-deep .deleteDuty .el-button{
  margin-left: 10px;
  font-size:16px;
  padding:0px;
  border:0px;
}
.checkboxC{
  background: #F8F8F8;
  margin-bottom:20px;
}

.timeArrC{
  padding-top:19px;
}
.userC{
  font-size: 14px;
  display: inline-block;
  border: 1px solid #DCDFE6;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  width: calc(100% - 160px);
  height:40px;
  vertical-align:top;
}
.userX{
  font-size: 14px;
  display: inline-block;
  border: 1px solid #DCDFE6;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  width: calc(100% - 160px);
  height:40px;
  vertical-align:top;
}
.userL{
  font-size: 14px;
  display: inline-block;
  border: 1px solid #DCDFE6;
  width: calc(100% - 75px);
  height:40px;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  vertical-align:top;
}
.iconClass{
  color:red;
  margin-left:5px;
}
.userClass{
  margin-left: 14px;
}
.userClassX{
  margin-left: 14px;
}
::v-deep .titleC .el-form-item{
  margin-bottom:30px;
}
::v-deep .planTypeC .el-form-item{
  margin-bottom:31px;
}
::v-deep .scopeC .el-form-item{
  margin-bottom:31px;
}
::v-deep .timeArrC .el-form-item{
  margin-bottom:10px;
}
.week1{
  margin-bottom:10px;
}
.week2{
  margin-bottom:10px;
}
.week3{
  margin-bottom:10px;
}
.week4{
  margin-bottom:10px;
}
.week5{
  margin-bottom:10px;
}
.week6{
  margin-bottom:10px;
}
.week7{
  margin-bottom:20px;
}
::v-deep .weekC .el-form-item{
  margin-bottom:20px;
}
::v-deep .personnelQuota .el-form-item{
  margin-bottom:20px;
}
::v-deep .checkboxC .el-checkbox {
  border-left: 1px solid #DCDFE6;
  
  border-top: 1px solid #DCDFE6;
  
  border-bottom: 1px solid #DCDFE6;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  padding: 0px 10px;
}

::v-deep .weekC .el-input__inner{
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

::v-deep .checkboxC .el-form-item__content{
  line-height:38px;
}
::v-deep .quotaC .el-form-item__content{
  line-height:0px;
}
::v-deep .quotaC .el-transfer-panel{
  width:34%;
}
::v-deep .quotaC .el-button--primary{
  color: #FFFFFF;
  background-color:#009B4C !important;
  border: 1px solid #009B4C !important;
}
::v-deep .quotaC .el-transfer__buttons{
  padding:0 14px;
  width:30%;
}
::v-deep .shortModel .el-button{
  outline:none !important;
  height:30px !important;
  font-size: 14px !important;
  vertical-align:middle;
  border:1px dotted;
}
::v-deep .quotaC .el-transfer-panel__header{
  display:none;
}

::v-deep .quotaC .el-button [class*=el-icon-]+span{
  margin-left:0px;
}
::v-deep .quotaC .el-button{
  vertical-align:baseline;
}

::v-deep .quotaC .el-button.el-transfer__button.is-with-texts{
   width:43%;
   height:32px !important;
 }

::v-deep .dutyTime .el-form-item{
  margin-bottom: 14px;
}
::v-deep .dutyTime .el-input{
  width:50%;
}
::v-deep .shortUsers .el-form-item{
  margin-bottom: 30px;
}
</style>
