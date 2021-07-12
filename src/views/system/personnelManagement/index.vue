<template>
  <div class="personnelBody">
    <div class="personnelBox">
      <div class="personnelBoxLt">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="教师" name="teacher">
            <el-tree
              :data="dataT"
              ref="tree"
              @node-click="orgCheckChangeT"
              :check-strictly="true"
              node-key="id"
              :expand-on-click-node="false"
            >
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="学生" name="student">
            <el-tree
              :data="dataS"
              node-key="value"
              :props="defaultPropsS"
              ref="tree"
              @node-click="orgCheckChangeS"
              :check-strictly="true"
              :expand-on-click-node="false"
            >
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="家长" name="patriarch">
            <el-tree
              :data="dataP"
              node-key="value"
              :props="defaultPropsP"
              ref="tree"
              @node-click="orgCheckChangeP"
              :check-strictly="true"
              :expand-on-click-node="false"
            >
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="personnelBoxRt">
        <!-- 教师开始 -->
        <div v-if="activeName == 'teacher'">
          <filter-box
            :searchCol="searchColT"
            @searchFun="getListT"
            :optionObj="{}"
            :pageConfig="{ pageSize: pageFormT.pageSize }"
            slot="mheader"
            class="searchForm"
          ></filter-box>
          <m-table
            slot="mbody"
            @details="detailsFunT"
            :tableData="tableDataT"
            :tableCol="tableColT"
            :operationArr="operationArrT"
            tableHeight="calc(100vh - 437px)"
            v-loading="tableloadingT"
          ></m-table>
          <m-pagin
            slot="mfooter"
            :total="totalT"
            :pageSize="pageFormT.pageSize"
            @sizeChange="handleSizeChangeT"
            @currentChange="handleCurrentChangeT"
            :currentPage.sync="pageFormT.pageNum"
          ></m-pagin>
          <!-- 修改弹窗开始 -->
          <m-dialog
            title="修改"
            :visible.sync="detailVisibleT"
            @closeFun="detailVisibleT = false"
            :dialogBtnArr="dialogBtn"
            @confirm="confirm"
          >
            <el-form :model="teacherFome" label-width="100px" ref="teacherFome">
              <el-form-item label="教师姓名" prop="name">
                <el-input v-model="teacherFome.name" readonly />
              </el-form-item>
              <el-form-item label="性别" prop="sexLabel">
                <el-radio-group v-model="teacherFome.sexLabel">
                  <el-radio v-model="teacherFome.sexLabel" label="男" disabled
                    >男</el-radio
                  >
                  <el-radio v-model="teacherFome.sexLabel" label="女" disabled
                    >女</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="联系方式" prop="contactInfo">
                <el-input v-model="teacherFome.contactInfo" readonly />
              </el-form-item>
              <div class="sectorJob">
                <el-form-item
                  label="选择部门/岗位"
                  prop="deptIds"
                  v-for="(item, idx) in teacherFome.deptPostList"
                  :key="idx"
                >
                  <el-row>
                    <el-col :span="12" style="padding-right:8px">
                      <el-form-item :prop="`deptPostList.${idx}.deptId`">
                        <el-cascader
                          v-model="item.deptId"
                          :options="deptTree"
                          :props="{
                            checkStrictly: true,
                            value: 'id',
                            label: 'label'
                          }"
                          clearable
                          :show-all-levels="false"
                          placeholder="请选择部门"
                          @change="deptChange(item.deptId, idx)"
                        ></el-cascader>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12" style="padding-left:8px">
                      <el-form-item :prop="`deptPostList.${idx}.postName`">
                        <el-select
                          v-model="item.postName"
                          placeholder="请选择岗位"
                          @change="postIdChange($event, idx)"
                        >
                          <el-option
                            v-for="citem in item.postIdArr"
                            :key="citem.postId"
                            :label="citem.postName"
                            :value="citem.postId"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="operateBtn">
                    <el-button class="addBtn" @click="tBtnFun(idx)">
                      + 添加部门
                    </el-button>
                    <el-button
                      class="delBtn"
                      :disabled="teacherFome.deptPostList.length < 2"
                      @click="sBtnFun(idx)"
                    >
                      - 删除部门</el-button
                    >
                  </div>
                </el-form-item>
              </div>
              <el-form-item label="角色" prop="roleIds">
                <el-select
                  v-model="teacherFome.roleIds"
                  multiple
                  placeholder="请选择角色"
                >
                  <el-option
                    v-for="item in rolesOptiont"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </m-dialog>
          <!-- 修改弹窗结束 -->
        </div>
        <!-- 教师结束 -->
        <!-- 学生开始 -->
        <div v-else-if="activeName == 'student'">
          <filter-box
            :searchCol="searchColS"
            @searchFun="getListS"
            :optionObj="{ classStudentList, statusGradeData }"
            :pageConfig="{ pageSize: pageFormS.pageSize }"
            slot="mheader"
            class="searchForm"
          ></filter-box>
          <m-table
            slot="mbody"
            @details="detailsFunS"
            :tableData="tableDataS"
            :tableCol="tableColS"
            :operationArr="operationArrS"
            tableHeight="calc(100vh - 437px)"
            v-loading="tableloadingS"
          ></m-table>
          <m-pagin
            slot="mfooter"
            :total="totalS"
            :pageSize="pageFormS.pageSize"
            @sizeChange="handleSizeChangeS"
            @currentChange="handleCurrentChangeS"
            :currentPage.sync="pageFormS.pageNum"
          ></m-pagin>
          <!-- 查看详情弹窗开始 -->
          <m-dialog
            title="家长查看"
            :visible.sync="detailVisibleS"
            @closeFun="detailVisibleS = false"
          >
            <el-form
              label-width="100px"
              v-for="(items, index) in studentFome"
              :key="index"
            >
              <el-form-item label="家长姓名">
                <el-input v-model="items.name" readonly />
              </el-form-item>
              <el-form-item label="家长关系">
                <el-input v-model="items.relationshipLabel" readonly />
              </el-form-item>
              <el-form-item label="家长联系方式">
                <el-input v-model="items.contactInfo" readonly />
              </el-form-item>
            </el-form>
          </m-dialog>
          <!-- 查看详情弹窗结束 -->
        </div>
        <!-- 学生结束 -->
        <!-- 家长开始 -->
        <div v-else-if="activeName == 'patriarch'">
          <filter-box
            :searchCol="searchColP"
            @searchFun="getListP"
            :optionObj="{}"
            :pageConfig="{ pageSize: pageFormP.pageSize }"
            slot="mheader"
            class="searchForm"
          ></filter-box>
          <m-table
            slot="mbody"
            @details="detailsFunP"
            :tableData="tableDataP"
            :tableCol="tableColP"
            :operationArr="operationArrP"
            tableHeight="calc(100vh - 437px)"
            v-loading="tableloadingP"
          ></m-table>
          <m-pagin
            slot="mfooter"
            :total="totalP"
            :pageSize="pageFormP.pageSize"
            @sizeChange="handleSizeChangeP"
            @currentChange="handleCurrentChangeP"
            :currentPage.sync="pageFormP.pageNum"
          ></m-pagin>
          <!-- 查看详情弹窗开始 -->
          <m-dialog
            title="学生查看"
            :visible.sync="detailVisibleP"
            @closeFun="detailVisibleP = false"
          >
            <el-form
              label-width="100px"
              v-for="(item, key) in patriarchFome"
              :key="key"
            >
              <el-form-item label="学生姓名">
                <el-input v-model="item.name" readonly />
              </el-form-item>
              <el-form-item label="学生关系">
                <el-input v-model="item.relationshipLabel" readonly />
              </el-form-item>
              <el-form-item label="学生身份证号">
                <el-input v-model="item.idCardNo" readonly />
              </el-form-item>
              <el-form-item label="学生所在年级">
                <el-input v-model="item.gradeName" readonly />
              </el-form-item>
              <el-form-item label="学生所在班级">
                <el-input v-model="item.className" readonly />
              </el-form-item>
            </el-form>
          </m-dialog>
          <!-- 查看详情弹窗结束 -->
        </div>
        <!-- 家长结束 -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTreeSelect,
  getPersonList,
  getTreeClass,
  getStudentList,
  getParentList,
  getStudentParentList,
  getStudentListByParentId,
  getqueryAll,
  getTeacher,
  getUser
} from '@/api/system/personnelManagement'
import {
  getDeptTreeselect,
  getRolesOptionselect,
  getPostOptionselect
} from '@/api/comment/index'

export default {
  name: 'record',
  data() {
    return {
      // tabs显示
      activeName: 'teacher',
      // 部门选择
      deptTree: [],
      // 角色选择
      rolesOptiont: [],
      // 树 老师/学生/家长
      dataT: [],
      dataS: [],
      dataP: [],
      defaultPropsT: null,
      defaultPropsS: {
        children: 'children',
        label: 'name'
      },
      defaultPropsP: {
        children: 'children',
        label: 'name'
      },
      // 筛选框数据
      statusGradeData: [
        {
          label: '一年级',
          value: '1'
        },
        {
          label: '二年级',
          value: '2'
        },
        {
          label: '三年级',
          value: '3'
        },
        {
          label: '四年级',
          value: '4'
        },
        {
          label: '五年级',
          value: '5'
        },
        {
          label: '六年级',
          value: '6'
        },
        {
          label: '初一',
          value: '7'
        },
        {
          label: '初二',
          value: '8'
        },
        {
          label: '初三',
          value: '9'
        }
      ],
      // 加载状态 老师/学生/家长
      tableloadingT: false,
      tableloadingS: false,
      tableloadingP: false,
      // 筛选栏 老师/学生/家长
      searchColT: [
        {
          label: '教师姓名',
          propVal: 'realName'
        },
        {
          label: '教师手机号',
          propVal: 'phonenumber'
        }
      ],
      searchColS: [
        {
          label: '年级',
          propVal: 'grade',
          type: 'select',
          optionsIdx: 'statusGradeData'
        },
        {
          label: '班级',
          propVal: 'classId',
          type: 'select',
          optionBd: { label: 'className', value: 'classId' },
          optionsIdx: 'classStudentList'
        },
        {
          label: '身份证号',
          propVal: 'idCardNo'
        },
        {
          label: '学生姓名',
          propVal: 'name'
        }
      ],
      searchColP: [
        {
          label: '家长姓名',
          propVal: 'name'
        },
        {
          label: '联系方式',
          propVal: 'contactInfo'
        }
      ],
      // 表格列配置 老师/学生/家长
      tableColT: [
        {
          label: '教师姓名',
          propVal: 'realName'
        },
        {
          label: '性别',
          propVal: 'sexLabel'
        },
        {
          label: '联系方式',
          propVal: 'phonenumber'
        },
        {
          label: '部门',
          propVal: 'deptName'
        },
        {
          label: '岗位',
          propVal: 'postName'
        },
        {
          label: '角色',
          propVal: 'roleName'
        }
        // {
        //   label: '带班设置',
        //   propVal: 'mergeTime'
        // }
      ],
      tableColS: [
        {
          label: '学生姓名',
          propVal: 'name'
        },
        {
          label: '性别',
          propVal: 'sexLable'
        },
        {
          label: '身份证号',
          propVal: 'idCardNo'
        },
        {
          label: '年级名称',
          propVal: 'gradeName'
        },
        {
          label: '班级名称',
          propVal: 'className'
        }
      ],
      tableColP: [
        {
          label: '家长姓名',
          propVal: 'name'
        },
        {
          label: '联系方式',
          propVal: 'contactInfo'
        }
      ],
      // 操作栏按钮 老师/学生/家长
      operationArrT: [{ label: '修改', eventName: 'details' }],
      operationArrS: [{ label: '家长查看', eventName: 'details' }],
      operationArrP: [{ label: '学生查看', eventName: 'details' }],
      pageFormT: {
        pageNum: 1,
        pageSize: 10,
        postId: '',
        deptId: '',
        realName: '',
        phonenumber: '',
        deptFlag: ''
      },
      pageFormS: {
        pageNum: 1,
        pageSize: 10,
        grade: '',
        classId: '',
        idCardNo: '',
        name: '',
        educationalId: ''
      },
      pageFormP: {
        pageNum: 1,
        pageSize: 10,
        grade: '',
        classId: '',
        name: '',
        contactInfo: '',
        educationalId: ''
      },
      // 表格数据 老师/学生/家长
      tableDataT: [],
      tableDataS: [],
      tableDataP: [],
      // 总页数 老师/学生/家长
      totalT: 100,
      totalS: 100,
      totalP: 100,
      // 查看详情弹窗显示控制 老师/学生/家长
      detailVisibleT: false,
      detailVisibleS: false,
      detailVisibleP: false,
      // 修改数据 老师
      teacherFome: {
        name: '',
        userId: '',
        contactInfo: '',
        deptPostList: [{}],
        depts: [],
        posts: [],
        roleIds: [],
        sexLabel: '',
        roleList: []
      },
      // 查看详情数据 学生/家长
      studentFome: [],
      patriarchFome: [],
      // 班级下拉数据
      classStudentList: [],
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      deptIds: []
    }
  },
  methods: {
    // tabs切换
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 添加部门按钮
    tBtnFun(idx) {
      console.log(idx + 1, '*****33')
      this.teacherFome.deptPostList.splice(idx + 1, 0, {})
    },
    // 删除部门按钮
    sBtnFun(idx) {
      this.teacherFome.deptPostList.splice(idx, 1)
    },
    // 获取老师树数据
    async treeT() {
      this.dataT = await getTreeSelect()
      this.dataT.push({
        deptFlag: '0',
        label: '未分组'
      })
    },
    orgCheckChangeT(checked) {
      this.pageFormT.deptId = ''
      this.pageFormT.postId = ''
      this.pageFormT.deptFlag = ''
      console.log(checked, '获取老师树数据')
      // dateType  0：部门；1：岗位
      if (checked.dateType == '0') {
        this.pageFormT.deptId = checked.id
      } else if (checked.dateType == '1') {
        this.pageFormT.postId = checked.id
      }
      if (checked.deptFlag != '' && checked.deptFlag) {
        this.pageFormT.deptFlag = '0'
      } else {
        this.pageFormT.deptFlag = ''
      }
      this.getListT()
    },
    async getListT(demand) {
      this.listLoadingT = true
      let res = []
      if (demand) {
        this.pageFormT = demand
        this.pageFormT.pageNum = 1
        res = await getPersonList(demand)
      } else {
        res = await getPersonList(this.pageFormT)
      }
      this.tableDataT = res.rows
      this.totalT = res.total
      this.listLoadingT = false
    },
    // 获取学生树数据
    async treeS() {
      this.dataS = await getTreeClass()
    },
    orgCheckChangeS(checked) {
      this.pageFormS.educationalId = ''
      this.pageFormS.grade = ''
      this.pageFormS.classId = ''
      console.log(checked, 'checked///////')
      // type  类型：0：学制；1：年纪；2：班级
      if (checked.type == '0') {
        this.pageFormS.educationalId = checked.value
      } else if (checked.type == '1') {
        this.pageFormS.grade = checked.value
      } else if (checked.type == '2') {
        this.pageFormS.classId = checked.value
      }
      this.getListS()
    },
    async getListS(demand) {
      this.listLoadingS = true
      let res = []
      if (demand) {
        this.pageFormS = demand
        this.pageFormS.pageNum = 1
        res = await getStudentList(demand)
      } else {
        res = await getStudentList(this.pageFormS)
      }
      this.tableDataS = res.list
      this.totalS = res.total
      this.listLoadingS = false
    },
    // 获取家长树数据
    async treeP() {
      this.dataP = await getTreeClass()
    },
    orgCheckChangeP(checked) {
      this.pageFormP.educationalId = ''
      this.pageFormP.grade = ''
      this.pageFormP.classId = ''
      // type  类型：0：学制；1：年纪；2：班级
      if (checked.type == '0') {
        this.pageFormP.educationalId = checked.value
      } else if (checked.type == '1') {
        this.pageFormP.grade = checked.value
      } else if (checked.type == '2') {
        this.pageFormP.classId = checked.value
      }
      this.getListP()
    },
    async getListP(demand) {
      this.listLoadingP = true
      let res = []
      if (demand) {
        this.pageFormP = demand
        this.pageFormP.pageNum = 1
        res = await getParentList(demand)
      } else {
        res = await getParentList(this.pageFormP)
      }
      this.tableDataP = res.rows
      this.totalP = res.total
      this.listLoadingP = false
    },
    // 修改详情 老师
    async detailsFunT(scoped) {
      let rows = await getUser(scoped.userId)
      // let deptIds = []
      // else {
      //   rows.deptPostList.forEach((item) => {
      //     deptIds.push(item.deptId)
      //   })
      // }
      // this.deptIds = deptIds
      let roIds = []
      if (rows.roleList.length > 0) {
        let roleList = JSON.parse(JSON.stringify(rows.roleList))
        roleList.forEach((it) => {
          roIds.push(it.roleId)
        })
        console.log(roIds, 'roIds***********')
      }
      if (rows.deptPostList.length == 0) {
        let deptPostLists = [
          {
            deptId: '',
            deptName: '',
            postId: '',
            postName: '',
            userId: ''
          }
        ]
        this.teacherFome = {
          name: rows.name,
          userId: rows.userId,
          contactInfo: rows.contactInfo,
          deptPostList: deptPostLists,
          roleIds: roIds,
          sexLabel: rows.sexLabel,
          roleList: rows.roleList
        }
      } else {
        this.teacherFome = {
          name: rows.name,
          userId: rows.userId,
          contactInfo: rows.contactInfo,
          deptPostList: rows.deptPostList,
          roleIds: roIds,
          sexLabel: rows.sexLabel,
          roleList: rows.roleList
        }
      }
      this.detailVisibleT = true
    },

    // 部门更变
    async deptChange(deptIds, idx) {
      this.teacherFome.deptPostList[idx].postId = ''
      this.teacherFome.deptPostList[idx].postIdArr = await getPostOptionselect(
        deptIds[deptIds.length - 1]
      )
      this.$forceUpdate()
    },
    postIdChange(postId, idx) {
      console.log(postId)
      this.teacherFome.deptPostList[idx].postId = postId
      this.$forceUpdate()
    },
    async confirm() {
      this.$refs.teacherFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          let sysDeptPosts = {}
          let sysDeptPostsData = []
          this.teacherFome.deptPostList.forEach((item) => {
            if (item.deptId.length > 0) {
              sysDeptPosts = {
                deptId: item.deptId[item.deptId.length - 1],
                postId: item.postId
              }
            } else {
              sysDeptPosts = {
                deptId: item.deptId,
                postId: item.postId
              }
            }
            sysDeptPostsData.push(sysDeptPosts)
          })
          let getData = {
            userId: this.teacherFome.userId,
            roleIds: this.teacherFome.roleIds,
            sysDeptPosts: sysDeptPostsData
          }
          await getTeacher(getData)
          this.detailVisibleT = false
          this.getListT()
        }
      })
    },
    // 查看详情 学生/家长
    async detailsFunS(scoped) {
      let rows = await getStudentParentList(scoped.id)
      this.studentFome = JSON.parse(JSON.stringify(rows))
      this.detailVisibleS = true
    },
    async detailsFunP(scoped) {
      let rows = await getStudentListByParentId(scoped.id)
      this.patriarchFome = JSON.parse(JSON.stringify(rows))
      this.detailVisibleP = true
    },
    handleSizeChangeT(val) {
      this.pageFormT.pageSize = val
      this.getListT()
    },
    handleSizeChangeS(val) {
      this.pageFormS.pageSize = val
      this.getListS()
    },
    handleSizeChangeP(val) {
      this.pageFormP.pageSize = val
      this.getListP()
    },
    handleCurrentChangeT(val) {
      this.pageFormT.pageNum = val
      this.getListT()
    },
    handleCurrentChangeS(val) {
      this.pageFormS.pageNum = val
      this.getListS()
    },
    handleCurrentChangeP(val) {
      this.pageFormP.pageNum = val
      this.getListP()
    }
  },
  async created() {
    this.getListT()
    this.treeT()
    this.getListS()
    this.treeS()
    this.getListP()
    this.treeP()
    this.classStudentList = await getqueryAll()
    this.deptTree = await getDeptTreeselect()
    this.rolesOptiont = await getRolesOptionselect()
  }
}
</script>

<style lang="scss" scoped>
.personnelBody {
  position: relative;
}
.personnelBody .personnelBox {
  height: calc(100vh - 250px);
  padding: 0 20px;
  margin: 0 20px;
  background-color: #fff;
}
.personnelBox .personnelBoxLt,
.personnelBox .personnelBoxRt {
  margin: 20px 0;
  float: left;
  overflow: hidden;
}
.personnelBox .personnelBoxLt {
  width: 287px;
  height: calc(100vh - 290px);
  -webkit-box-shadow: 0px 0px 5px 0px #e9e9e9;
  box-shadow: 0px 0px 5px 0px #e9e9e9;
  margin-right: 20px;
}
.personnelBox .personnelBoxRt {
  padding: 0 20px;
  width: calc(100% - 307px);
  -webkit-box-shadow: 0px 0px 5px 0px #e9e9e9;
  box-shadow: 0px 0px 5px 0px #e9e9e9;
}
.personnelBoxRt .filterBox {
  margin: 0;
  box-shadow: none;
  -webkit-box-shadow: none;
  padding-left: 0;
}
.personnelBoxLt /deep/ .el-tabs__nav {
  width: 100%;
  font-size: 16px;
  background: #ebf7f1;
  border-radius: 4px 4px 0px 0px;
  overflow: hidden;
}
.personnelBoxLt /deep/ .el-tabs__header {
  margin-bottom: 20px;
}
.personnelBoxLt /deep/ .el-tabs__item {
  color: #009b4c;
}
.personnelBoxLt /deep/ .el-tabs__item:hover {
  color: #009b4c;
}
.personnelBoxLt /deep/ .el-tabs__item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 16px;
  width: 1px;
  height: 18px;
  background: #d7e8e0;
  z-index: 1;
}
.personnelBoxLt /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.personnelBoxLt /deep/ .el-tabs__item {
  padding: 0 32px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}
.personnelBoxLt /deep/ .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
.personnelBoxLt /deep/ .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
.personnelBoxLt /deep/ .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
.personnelBoxLt /deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 32px;
}
.personnelBoxLt
  /deep/
  .el-tabs--bottom
  .el-tabs__item.is-bottom:nth-child(2)::after,
.personnelBoxLt
  /deep/
  .el-tabs--bottom
  .el-tabs__item.is-top:nth-child(2)::after,
.personnelBoxLt
  /deep/
  .el-tabs--top
  .el-tabs__item.is-bottom:nth-child(2)::after,
.personnelBoxLt /deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2)::after {
  width: 0;
  height: 0;
}
.personnelBoxLt /deep/ .el-tabs--bottom .el-tabs__item.is-bottom:last-child,
.personnelBoxLt /deep/ .el-tabs--bottom .el-tabs__item.is-top:last-child,
.personnelBoxLt /deep/ .el-tabs--top .el-tabs__item.is-bottom:last-child,
.personnelBoxLt /deep/ .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 32px;
}
.personnelBoxLt /deep/ .el-tabs__active-bar {
  height: 0;
}
.personnelBoxLt /deep/ .el-tabs__item.is-active {
  background-color: #009b4c;
  color: #ffffff !important;
}
.personnelBoxLt /deep/ .el-tabs__item.is-active::after {
  width: 0;
  height: 0;
}
.operateBtn {
  text-align: right;
  margin-top: 20px;
}
body .el-button.el-button--default.delBtn {
  border-color: #ff0000;
  color: #ff0000;
}
/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: #f5f7fa !important;
}
/deep/ .is-current {
  background-color: #f5f7fa !important;
}
/deep/ .el-dialog__body {
  padding: 20px 0;
}
/deep/ .el-form {
  padding: 0 50px !important;
  border-bottom: 6px solid #f0f0f0;
  margin-bottom: 20px;
}
/deep/ .el-form:last-child {
  border-bottom: none;
}
.sectorJob {
  background: #f8f8f8;
  padding: 20px 50px 0.5px;
  margin: 0 -50px 20px;
}
.searchForm /deep/ .el-form {
  padding: 0 !important;
}
</style>
