<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      @searchFun="getList"
      :optionObj="{ classOptionselect, classSelect, student_status }"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <m-table
      slot="mbody"
      @editor="editorFun"
      @handleDelete="handleDelete"
      @sRecordAdd="sRecordAdd"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :operationArr="operationArr"
      :wCaozuo="120"
      tableHeight="calc(100vh - 452px)"
      v-loading="tableloading"
    ></m-table>
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
    ></m-pagin>

    <m-dialog
      :title="sRecordTitle"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      :dialogBtnArr="dialogBtn"
      class="hasCollapse"
    >
      <el-form
        :model="sRecordFome"
        ref="sRecordFome"
        label-width="120px"
        :rules="rules"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="1">
            <el-form-item label="学籍号/学号" prop="num">
              <el-input
                v-model.number="sRecordFome.num"
                maxlength="20"
                show-word-limit
                placeholder="请输入学籍号/学号"
                oninput="value=value.replace(/[^\d]/g,'')"
              />
            </el-form-item>
            <el-form-item label="学生姓名" prop="name">
              <el-input
                v-model="sRecordFome.name"
                maxlength="20"
                show-word-limit
                placeholder="请输入学生姓名"
              />
            </el-form-item>
            <el-form-item label="曾用名" prop="oldName">
              <el-input
                v-model="sRecordFome.oldName"
                maxlength="20"
                show-word-limit
                placeholder="请输入曾用名"
              />
            </el-form-item>
            <el-form-item label="所在年级" prop="grade">
              <el-select
                v-model="sRecordFome.grade"
                placeholder="请选择所在年级"
              >
                <el-option
                  v-for="item in classOptionselect"
                  :key="item.keyID"
                  :label="item.keyValue"
                  :value="item.keyID"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在班级" prop="classId">
              <el-select
                v-model="sRecordFome.classId"
                placeholder="请选择所在班级"
              >
                <el-option
                  v-for="item in classSelect"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别" prop="sexValue">
              <el-radio-group v-model="sRecordFome.sexValue">
                <el-radio
                  v-for="item in sys_user_sex"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  >{{ item.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCardNo">
              <el-input
                v-model="sRecordFome.idCardNo"
                maxlength="18"
                show-word-limit
                placeholder="请输入身份证号"
              />
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="sRecordFome.birthday"
                type="date"
                placeholder="请选择出生日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="国籍/地区" prop="nationality">
              <el-select
                v-model="sRecordFome.nationality"
                placeholder="请选择国籍/地区"
              >
                <el-option
                  v-for="item in nationalityList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="港澳台侨外" prop="overseas">
              <el-radio-group v-model="sRecordFome.overseas">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-select v-model="sRecordFome.nation" placeholder="请选择民族">
                <el-option
                  v-for="item in nationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="籍贯" prop="nativeplace">
              <el-input
                v-model="sRecordFome.nativeplace"
                maxlength="20"
                show-word-limit
                placeholder="请输入籍贯"
              />
            </el-form-item>
            <el-form-item label="入学年月" prop="enrollment">
              <el-date-picker
                v-model="sRecordFome.enrollment"
                type="month"
                placeholder="请选择入学年月"
                value-format="yyyy-MM"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="户口性质" prop="residenceValue">
              <el-select
                v-model="sRecordFome.residenceValue"
                placeholder="请选择户口性质"
              >
                <el-option
                  v-for="item in registered_residence"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="就读方式" prop="studyMethodValue">
              <el-select
                v-model="sRecordFome.studyMethodValue"
                placeholder="请选择就读方式"
              >
                <el-option
                  v-for="item in attend_school_type"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入学方式" prop="entranceValue">
              <el-select
                v-model="sRecordFome.entranceValue"
                placeholder="请选择入学方式"
              >
                <el-option
                  v-for="item in entrance_school_type"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="现住址" prop="address">
              <el-input
                v-model="sRecordFome.address"
                type="textarea"
                :autosize="{ minRows: 2 }"
                maxlength="50"
                show-word-limit
                placeholder="请输入家庭住址"
              />
            </el-form-item>
            <el-form-item label="学籍状态" prop="statusValue">
              <el-select
                v-model="sRecordFome.statusValue"
                placeholder="请选择学籍状态"
              >
                <el-option
                  v-for="item in student_status"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学籍异动" prop="changes">
              <el-input
                v-model="sRecordFome.changes"
                type="textarea"
                :autosize="{ minRows: 2 }"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="人脸录入" prop="file" class="renlian">
              <el-upload
                :class="
                  sRecordFome.file
                    ? 'avatar-uploader hasImage'
                    : 'avatar-uploader'
                "
                style="float:left"
                :action="upload.url"
                :headers="upload.headers"
                :show-file-list="false"
                accept=".jpg, .jpeg, .png, .gif, .bmp"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload"
              >
                <img
                  style="float:left"
                  v-if="sRecordFome.file"
                  :src="sRecordFome.file | showImg"
                  class="avatar"
                />
                <!-- <template v-else> -->
                <div class="uploadIcon">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <span class="el-upload__text">上传照片</span>
                </div>
                <!-- </template> -->
              </el-upload>
              <div class="uploadTxt">
                <p>
                  1.本人清晰、免冠、正面彩色头像，要求面部五官无遮挡，人头部约占照片高度的三分之二
                </p>
                <p>2. 照片背景颜色尽量单一，底色为白色、蓝色、红色均可</p>
                <p>3. 照片光线均匀，面部无明显逆光</p>
                <p>4. 照片文件大小要求：小于300KB</p>
                <p>5.照片像素要求：480*720以上</p>
                <p>
                  规范说明:
                  <el-button type="text"
                    >点击下载人脸照片上传规范说明</el-button
                  >
                </p>
              </div>
            </el-form-item>
          </el-collapse-item>

          <!-- 家长信息 -->
          <el-collapse-item title="家长信息" name="2">
            <el-form-item label="家长1姓名" prop="studentParents[0].name">
              <el-input
                v-model="sRecordFome.studentParents[0].name"
                placeholder="请输入姓名"
              />
            </el-form-item>
            <el-form-item
              label="家长1关系"
              prop="studentParents[0].relationshipValue"
            >
              <el-select
                v-model="sRecordFome.studentParents[0].relationshipValue"
                placeholder="请选择关系"
              >
                <el-option
                  v-for="item in parent_relation"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="家长1联系方式"
              prop="studentParents[0].contactInfo"
            >
              <el-input
                v-model.number="sRecordFome.studentParents[0].contactInfo"
                maxlength="11"
                oninput="value=value.replace(/[^\d]/g,'')"
                show-word-limit
                placeholder="请输入联系方式"
              />
            </el-form-item>
            <el-form-item label="家长1现住址" prop="studentParents[0].address">
              <el-input
                v-model="sRecordFome.studentParents[0].address"
                placeholder="请输入家庭住址"
              />
            </el-form-item>
            <el-form-item
              label="家长1学历"
              prop="studentParents[0].educationValue"
            >
              <el-select
                v-model="sRecordFome.studentParents[0].educationValue"
                placeholder="请选择学历"
              >
                <el-option
                  v-for="item in user_education"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="家长1职业"
              prop="studentParents[0].occupationValue"
            >
              <el-select
                v-model="sRecordFome.studentParents[0].occupationValue"
                placeholder="请选择职业"
              >
                <el-option
                  v-for="item in user_occupation"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 家长2 -->
            <el-form-item label="家长2姓名" prop="studentParents[1].name">
              <el-input
                v-model="sRecordFome.studentParents[1].name"
                placeholder="请输入姓名"
              />
            </el-form-item>
            <el-form-item
              label="家长2关系"
              prop="studentParents[1].relationshipValue"
            >
              <el-select
                v-model="sRecordFome.studentParents[1].relationshipValue"
                placeholder="请选择关系"
              >
                <el-option
                  v-for="item in parent_relation"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="家长2联系方式"
              prop="studentParents[1].contactInfo"
            >
              <el-input
                v-model.number="sRecordFome.studentParents[1].contactInfo"
                maxlength="11"
                oninput="value=value.replace(/[^\d]/g,'')"
                show-word-limit
                placeholder="请输入联系方式"
              />
            </el-form-item>
            <el-form-item label="家长2现住址" prop="studentParents[1].address">
              <el-input
                v-model="sRecordFome.studentParents[1].address"
                placeholder="请输入家庭住址"
              />
            </el-form-item>
            <el-form-item
              label="家长2学历"
              prop="studentParents[1].educationValue"
            >
              <el-select
                v-model="sRecordFome.studentParents[1].educationValue"
                placeholder="请选择学历"
              >
                <el-option
                  v-for="item in user_education"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="家长2职业"
              prop="studentParents[1].occupationValue"
            >
              <el-select
                v-model="sRecordFome.studentParents[1].occupationValue"
                placeholder="请选择职业"
              >
                <el-option
                  v-for="item in user_occupation"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="拓展信息" name="3">
            <el-form-item label="独生子女" prop="extOnlyChild">
              <el-select
                v-model="sRecordFome.extOnlyChild"
                placeholder="是否为独生子女？"
              >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="受过学前教育" prop="extEducation">
              <el-select
                v-model="sRecordFome.extEducation"
                placeholder="是否受过学前教育？"
              >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="留守儿童" prop="extBehindChildren">
              <el-select
                v-model="sRecordFome.extBehindChildren"
                placeholder="是否为留守儿童？"
              >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="随迁子女" prop="extMigrantWorkers">
              <el-select
                v-model="sRecordFome.extMigrantWorkers"
                placeholder="是否进城务工人员的随迁子女？"
              >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="孤儿" prop="extOrphan">
              <el-select
                v-model="sRecordFome.extOrphan"
                placeholder="是否为孤儿？"
              >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="烈士/优抚子女" prop="extMartyrs">
              <el-select
                v-model="sRecordFome.extMartyrs"
                placeholder="是否为烈士或优抚子女？"
              >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否残疾" prop="extDisabled">
              <el-select
                v-model="sRecordFome.extDisabled"
                placeholder="是否残疾？"
              >
                <el-option
                  v-for="item in isTrueArr"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交通方式" prop="extTransportation">
              <el-input
                v-model="sRecordFome.extTransportation"
                placeholder="上下学交通方式？"
              />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </m-dialog>
  </main-box>
</template>

<script>
import {
  sRecordAdd,
  sRecordDel,
  sRecordFix,
  sRecord,
  sRecordList,
  getClassSelect
} from '@/api/archives/student'
import { classOptionselect } from '@/api/basic/classSetting'
import { getSelectTechItem } from '@/api/comment/index'
import { getToken } from '@/utils/auth'
import store from '@/store/index.js'
import { isID, isPhone } from '@/utils/validate.js'

export default {
  data() {
    return {
      // 校验规则
      rules: {
        num: [
          { required: true, message: '请输入学籍号/学号', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
        grade: [
          { required: true, message: '请选择所在年级', trigger: 'change' }
        ],
        classId: [
          { required: true, message: '请选择所在班级', trigger: 'change' }
        ],
        sexValue: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        idCardNo: [
          {
            required: true,
            trigger: 'blur',
            // message: '请输入正确的身份证号码',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入正确的身份证号码'))
              } else if (!isID(value)) {
                callback(new Error('身份证号码格式不正确'))
              } else {
                callback()
              }
            }
          }
        ],
        statusValue: [
          { required: true, message: '请选择学籍状态', trigger: 'change' }
        ],
        'studentParents[0].name': [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        'studentParents[0].relationshipValue': [
          { required: true, message: '请选择关系', trigger: 'change' }
        ],
        'studentParents[0].contactInfo': [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!isPhone(value)) {
                callback(new Error('请输入联系方式'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      // 班级下拉
      classSelect: [],
      // 年级下拉
      classOptionselect: [],
      // 学籍列表
      student_status: [],
      // 家长关系字典
      parent_relation: [],
      // 学历字典
      user_education: [],
      // 职业字典
      user_occupation: [],
      isTrueArr: [
        { dictValue: '0', dictLabel: '否' },
        { dictValue: '1', dictLabel: '是' }
      ],
      // 国籍地区
      nationalityList: [
        { dictValue: '0', dictLabel: '中国' },
        { dictValue: '1', dictLabel: '外国' }
      ],
      // 民族列表
      nationList: this.$store.state.nationList,
      // 性别列表数据
      sys_user_sex: [],
      // 户口性质
      registered_residence: [],
      // 就读方式
      attend_school_type: [],
      // 入学方式
      entrance_school_type: [],
      // 上传配置
      upload: {
        // 设置上传的请求头部
        headers: {
          Authorization: getToken()
        },
        // 上传的地址
        url:
          store.state.apiConfiguration.url +
          store.state.serviceName.jurisdiction +
          '/fs/upload'
      },
      // 加载状态
      tableloading: false,
      // 展开的折叠面板
      activeNames: ['1', '2', '3'],
      // 筛选栏
      searchCol: [
        {
          label: '年级',
          propVal: 'grade',
          type: 'select',
          optionBd: { label: 'keyValue', value: 'keyID' },
          optionsIdx: 'classOptionselect'
        },
        {
          label: '班级',
          propVal: 'classId',
          type: 'select',
          optionBd: { label: 'className', value: 'classId' },
          optionsIdx: 'classSelect'
        },
        {
          label: '身份证号',
          propVal: 'idCardNo'
        },
        {
          label: '学生姓名',
          propVal: 'name'
        },
        {
          label: '学籍状态',
          propVal: 'statusValue',
          type: 'select',
          optionBd: { label: 'dictLabel', value: 'dictValue' },
          optionsIdx: 'student_status'
        }
      ],
      // 表格上方按钮
      tableBtnArr: [
        {
          label: '新增',
          eventName: 'sRecordAdd'
        },
        {
          label: '批量导入',
          eventName: 'importFun'
        },
        {
          label: '批量导出',
          eventName: 'exportFun'
        }
      ],
      // 表格列配置
      tableCol: [
        {
          label: '学籍号/学号',
          propVal: 'num',
          width: '280'
        },
        {
          label: '学生姓名',
          propVal: 'name',
          width: '140'
        },
        {
          label: '年级名称',
          propVal: 'grade'
        },
        {
          label: '班级名称',
          propVal: 'classId',
          width: '140'
        },
        {
          label: '性别',
          propVal: 'sexLabel'
        },
        {
          label: '身份证号',
          propVal: 'idCardNo',
          width: '280'
        },
        {
          label: '民族',
          propVal: 'nation',
          width: '120'
        },
        {
          label: '籍贯  ',
          propVal: 'nativeplace',
          width: '280'
        },
        {
          label: '学籍状态',
          propVal: 'statusLabel'
        },
        {
          label: '是否录入人脸',
          propVal: 'customizeId',
          width: '120'
        }
      ],
      // 操作栏按钮
      operationArr: [
        { label: '修改', eventName: 'editor' },
        {
          label: '删除',
          eventName: 'handleDelete'
        }
      ],
      pageForm: {
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      // 总页数
      total: 100,
      // 弹窗标题
      sRecordTitle: '修改',
      // 弹窗显示控制
      dialogVisible: false,
      // 弹窗按钮
      dialogBtn: [{ btnName: '保存', eventName: 'confirm' }],
      sRecordFome: {
        num: '',
        name: '',
        oldName: '',
        grade: '',
        classId: '',
        sexValue: '0',
        idCardNo: '',
        birthday: '',
        nationality: '',
        overseas: '0',
        nation: '',
        nativeplace: '',
        enrollment: '',
        residenceValue: '',
        studyMethodValue: '',
        entranceValue: '',
        address: '',
        statusValue: '',
        changes: '',
        file: '',
        studentParents: [
          {
            name: '',
            relationshipValue: '',
            contactInfo: ''
          },
          { name: '', relationshipValue: '', contactInfo: '' }
        ]
      }
    }
  },
  methods: {
    // 获取表格数据
    async getList(demand) {
      this.listLoading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await sRecordList(demand)
      } else {
        res = await sRecordList(this.pageForm)
      }
      this.tableData = res.rows
      this.total = res.total
      this.listLoading = false
    },
    // 新增
    sRecordAdd() {
      this.sRecordTitle = '新增'
      this.sRecordFome = {
        num: '',
        name: '',
        oldName: '',
        grade: '',
        classId: '',
        sexValue: '0',
        idCardNo: '',
        birthday: '',
        nationality: '',
        overseas: '0',
        nation: '',
        nativeplace: '',
        enrollment: '',
        residenceValue: '',
        studyMethodValue: '',
        entranceValue: '',
        address: '',
        statusValue: '',
        changes: '',
        file: '',
        studentParents: [
          {
            name: '',
            relationshipValue: '',
            contactInfo: ''
          },
          { name: '', relationshipValue: '', contactInfo: '' }
        ]
      }

      this.dialogVisible = true
    },
    // 修改
    async editorFun(scoped) {
      console.log(scoped)
      this.sRecordTitle = '修改'
      this.sRecordFome = await sRecord(scoped.sRecordId)
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.sRecordFome.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          // let FormDatas = new FormData()
          // let needData = this.sRecordFome
          // this.sRecordFome.file = FormDatas.append(
          //   'file',
          //   this.sRecordFome.file
          // )
          if (this.sRecordTitle == '新增') {
            // await sRecordAdd(needData)
            await sRecordAdd(this.sRecordFome)
          } else if (this.sRecordTitle == '修改') {
            await sRecordFix(this.sRecordFome)
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    // 删除
    handleDelete(scope) {
      console.log(scope)
      this.$confirm('该档案下数据，确认要删除？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await sRecordDel(scope.id)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    },
    // 上传前
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('单个附件最大不可超过5M!')
      }
      return isLt5M
    },
    // 上传成功
    uploadSuccess(response) {
      this.$set(this.sRecordFome, 'file', response.body.url)
      this.$forceUpdate()
    }
  },
  async created() {
    this.getList()
    this.classSelect = await getClassSelect()
    this.classOptionselect = await classOptionselect()
    this.student_status = await getSelectTechItem('student_status')
    this.parent_relation = await getSelectTechItem('parent_relation')
    this.user_occupation = await getSelectTechItem('user_occupation')
    this.user_education = await getSelectTechItem('user_education')
    this.sys_user_sex = await getSelectTechItem('sys_user_sex')
    this.registered_residence = await getSelectTechItem('registered_residence')
    this.attend_school_type = await getSelectTechItem('attend_school_type')
    this.entrance_school_type = await getSelectTechItem('entrance_school_type')
  }
}
</script>

<style lang="" scoped></style>
