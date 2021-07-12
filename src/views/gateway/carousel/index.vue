<template>
  <main-box>
    <filter-box
      slot="mheader"
      :searchCol="searchCol"
      @searchFun="getList"
      :pageConfig="{ pageSize: pageForm.pageSize }"
    ></filter-box>
    <!-- <m-table
      slot="mbody"
      @handleAdd="handleAdd"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      :tableBtnArr="tableBtnArr"
      :tableData="tableData"
      :tableCol="tableCol"
      :operationArr="operationArr"
      :wCaozuo="300"
      v-loading="tableloading"
    >
    </m-table> -->
    <!-- 自定义表格 -->
    <div class="mTable" slot="mbody">
      <div class="tableBtn">
        <template>
          <el-button @click="handleAdd()">新增</el-button>
        </template>
      </div>
      <el-table
        v-loading="tableloading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        :border="false"
        :height="`calc(100vh - 414px)`"
        :stripe="true"
      >
        <el-table-column label="序号">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="轮播图标题"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="linkUrl"
          label="轮播图路径"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="publisher"
          label="发布人"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="发布时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.noticeFlag"
              @change="changenoticeFlag($event, scope.row.carouselId)"
              active-text="显示"
              inactive-text="隐藏"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="300">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  -->
    <m-pagin
      slot="mfooter"
      :total="total"
      :pageSize="pageForm.pageSize"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :currentPage.sync="pageForm.pageNum"
    ></m-pagin>
    <m-dialog
      :title="dialogType === 'edit' ? '修改轮播图' : '新增轮播图'"
      :visible.sync="dialogVisible"
      @closeFun="dialogVisible = false"
      @confirm="confirm"
      v-loading="dialogloading"
      :dialogBtnArr="dialogType == 'get' ? [] : czArr"
    >
      <el-form
        :model="ruleForm"
        :rules="formRules"
        ref="operationFome"
        label-width="120px"
        class="form"
      >
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input
            placeholder="https://"
            v-model="ruleForm.linkUrl"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传轮播图片" prop="path">
          <img v-if="imgurl" :src="imgurl" class="avatar" />
          <el-upload
            ref="upload"
            :class="{ avatarUploader: !imgurl }"
            :on-error="uploadFileError"
            :on-success="uploadFileSuccess"
            :on-change="getValChange"
            :before-upload="beforeupload"
            accept=".jpg, .jpeg, .png, .gif "
            :headers="upload.headers"
            :action="upload.url"
            :show-file-list="false"
          >
            <i v-if="!imgurl" class="el-icon-plus avatar-uploader-icon"></i>
            <el-button v-if="imgurl" size="small" type="primary"
              >更换封面</el-button
            >
          </el-upload>
          <p class="avatar_p">
            建议尺寸：648px*1152px，6:9(此处尺寸待定)建议格式：jpg、jpeg、gif、png
          </p>
        </el-form-item>
      </el-form>
    </m-dialog>
  </main-box>
</template>
<script>
import {
  getbusCarousel,
  postbusCarousel,
  putbusCarousel,
  delbusCarousel,
  getiIbusCarousel
} from '@/api/gateway/carousel.js'

import { getToken } from '@/utils/auth'
import store from '@/store/index.js'
export default {
  data() {
    return {
      activeName: 'reptile',
      // 筛选栏
      searchCol: [
        {
          label: '轮播图标题',
          propVal: 'title'
        }
      ],
      // 请求参数
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        title: ''
      },
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
      filelist: [],
      // 新增表单
      ruleForm: {},
      imgurl: '',
      formRules: {
        title: [
          { required: true, message: '请填写轮播图标题', trigger: 'blur' }
        ],
        path: [{ required: true, message: '请上传轮播图片', trigger: 'change' }]
      },
      total: 0,
      dialogloading: false,
      tableloading: false,
      czArr: [{ btnName: '保存', eventName: 'confirm' }],
      dialogType: 'add',
      dialogVisible: false,
      carouselId: '',
      // // 表格上方按钮
      // tableBtnArr: [
      //   { label: '新增', eventName: 'handleAdd', has: 'system:user:add' }
      // ],
      // // 表格列配置
      // tableCol: [
      //   {
      //     label: '轮播图标题',
      //     propVal: 'title'
      //   },
      //   {
      //     label: '轮播图路径',
      //     propVal: 'linkUrl'
      //   },
      //   {
      //     label: '发布人',
      //     propVal: 'publisher'
      //   },
      //   {
      //     label: '发布时间',
      //     propVal: 'createTime'
      //   },
      //   {
      //     label: '状态',
      //     propVal: 'noticeFlag',
      //     atFilter: 'noticeFlag'
      //   }
      // ],
      // // 操作栏按钮
      // operationArr: [
      //   { label: '修改', eventName: 'handleEdit', has: 'system:user:edit' },
      //   { label: '删除', eventName: 'handleDelete', has: 'system:user:remove' }
      // ],
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 列表查询
    async getList(demand) {
      console.log(demand)
      this.tableloading = true
      let res = []
      if (demand) {
        this.pageForm = demand
        this.pageForm.pageNum = 1
        res = await getbusCarousel(this.pageForm)
      } else {
        res = await getbusCarousel(this.pageForm)
      }
      for (let v of res.rows) {
        if (v.noticeFlag == 0) {
          v.noticeFlag = true
        } else {
          v.noticeFlag = false
        }
      }
      this.tableData = res.rows
      this.total = res.total
      this.tableloading = false
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
    // 修改状态
    async changenoticeFlag(v, id) {
      let data = {
        carouselId: id,
        noticeFlag: v ? '0' : '1'
      }
      await putbusCarousel(data)
      this.getList()
    },
    // 新增按钮
    handleAdd() {
      this.dialogloading = true
      this.dialogType = 'add'
      this.ruleForm = {}
      this.filelist = []
      this.imgurl = ''
      this.dialogVisible = true
      this.dialogloading = false
    },
    // 确定按钮
    confirm() {
      // 表单验证
      this.$refs['operationFome'].validate(async (valid) => {
        if (valid) {
          // 新增
          if (!this.ruleForm.linkUrl) {
            this.ruleForm.linkUrl = '-'
          }
          if (this.dialogType == 'add') {
            await postbusCarousel(this.ruleForm)
          } else {
            // 修改
            this.ruleForm.carouselId = this.carouselId
            await putbusCarousel(this.ruleForm)
          }
          this.dialogVisible = false
          this.getList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传
    uploadFileSuccess(response) {
      if (response.code == 200) {
        this.$set(this.ruleForm, 'path', response.body.url)
        // this.ruleForm.path=response.body.url
        this.imgurl =
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.jurisdiction +
          response.body.url
        console.log(this.imgurl)
      }
    },
    uploadFileError(err, file) {
      this.$message.error('网络繁忙，请稍后再试！')
      console.log(err, file)
    },
    // 文件类型验证
    beforeupload(file) {
      let pnglist = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
      let isPNG = pnglist.filter((v) => {
        return file.type === v
      })
      if (isPNG.length == 0) {
        this.$message.error('上传图片只能是 PNG,JPG,JPEG,GIF格式!')
        return false
      }
    },
    // 重新上传覆盖
    getValChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      } else {
        this.fileList = fileList[0]
      }
    },
    // 修改
    async handleEdit(v) {
      this.dialogloading = true
      this.dialogType = 'edit'
      let res = await getiIbusCarousel(v.carouselId)
      this.ruleForm = res
      this.imgurl =
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        res.path
      this.carouselId = v.carouselId
      this.dialogloading = false
      this.dialogVisible = true
    },
    // 删除
    async handleDelete(v) {
      this.$confirm('确定删除此轮播图吗?', '删除轮播图', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delbusCarousel(v.carouselId)
          this.getList()
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.form /deep/ {
  .avatarUploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatarUploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar_p {
    font-size: 12px;
    color: #999999;
  }
}
</style>
