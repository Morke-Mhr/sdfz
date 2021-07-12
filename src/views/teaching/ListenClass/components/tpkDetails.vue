<template>
  <el-tabs class="tpkDetails" v-model="listenActive">
    <el-tab-pane label="详情" name="details">
      <el-form :model="detailsData" ref="detailsData" label-width="90px">
        <el-form-item label="听评课标题">
          <el-input v-model="detailsData.title" readonly />
        </el-form-item>
        <el-form-item label="授课教师">
          <el-input v-model="detailsData.userName" readonly />
        </el-form-item>
        <el-form-item label="听评课类型">
          <el-input v-model="detailsData.listenClassTypeName" readonly />
        </el-form-item>
        <el-form-item label="所属学科">
          <el-input v-model="detailsData.subjectName" readonly />
        </el-form-item>
        <el-form-item label="听评课时间">
          <el-date-picker
            v-model="detailsData.time"
            type="datetimerange"
            readonly
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授课班级">
          <el-input v-model="detailsData.className" readonly />
        </el-form-item>
        <el-form-item label="评价方案">
          <el-input v-model="detailsData.schemeName" readonly />
        </el-form-item>
        <el-form-item label="授课教案">
          <template v-for="(item, idx) in fileList1">
            <el-button
              :key="idx"
              class="el-icon-download download"
              type="text"
              @click="uploadFilePreview(item)"
              >{{ item.fileName }}</el-button
            >
          </template>
        </el-form-item>
        <el-form-item label="授课课件">
          <template v-for="(item, idx) in fileList2">
            <el-button
              :key="idx"
              class="el-icon-download download"
              type="text"
              @click="uploadFilePreview(item)"
              >{{ item.fileName }}</el-button
            >
          </template>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="其他附件">
              <template v-for="(item, idx) in fileList3">
                <el-button
                  :key="idx"
                  class="el-icon-download download"
                  type="text"
                  @click="uploadFilePreview(item)"
                  >{{ item.fileName }}</el-button
                >
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他附件">
              <template v-for="(item, idx) in fileList4">
                <el-button
                  :key="idx"
                  class="el-icon-download download"
                  type="text"
                  @click="uploadFilePreview(item)"
                  >{{ item.fileName }}</el-button
                >
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="授课说明">
          <el-input
            v-model="detailsData.instruction"
            readonly
            type="textarea"
            :autosize="{ minRows: 2 }"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="评价" name="evaluation">
      <div class="cardTop">
        <span class="left"
          >参与评价：{{ detailsData.evaluatePersonCount }}人</span
        >
        <div class=" right">
          平均评分：
          <em class="cRed">{{ detailsData.avgScore }}</em>
          <span class="cRed">分</span>
        </div>
      </div>
      <div
        class="evaluationCard"
        v-for="(item, idx) in detailsData.classEvaluateList"
        :key="idx"
      >
        <div class="cardHearder">
          <span class="left">评价人：{{ item.createBy }}</span>
          <span class="hui">时间{{ item.createTime }}</span>
          <span class="right"
            >评价分数：
            <span class="cRed">{{ item.itemScore }}分</span>
          </span>
        </div>
        <div class="cardBody">
          <div
            class="conItem"
            v-for="(cItem, cIdx) in item.classEvaluateItemList"
            :key="cIdx"
          >
            <span class="left">{{ cIdx + 1 + '、' + cItem.project }}</span>
            <span class="right" style="color:#2B302D">{{ cItem.score }}分</span>
          </div>
        </div>
        <div class="cardFoot">
          课堂两点与不足：
          <p>
            {{ item.content }}
          </p>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="反思" name="reflection">
      <div class="evaluationCard reflection">
        <p>{{ detailsData.reflect }}</p>
      </div>
      <el-form style="padding:0">
        <el-form-item label="其他附件">
          <template v-for="(item, idx) in fileList4">
            <el-button
              :key="idx"
              class="el-icon-download download"
              type="text"
              @click="uploadFilePreview(item)"
              >{{ item.fileName }}</el-button
            >
          </template>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'tpkDetails',
  props: {
    detailsData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      listenActive: 'details',
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: []
    }
  },
  methods: {
    // 点击文件列表下载
    async uploadFilePreview(file) {
      console.log(file)
      let download =
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction //下载地址
      let fileDowloadName =
        download +
        `/fs/download?name=${encodeURI(encodeURI(file.fileName))}&path=${
          file.filePath
        }`
      location.href = fileDowloadName
    }
  },
  created() {},
  beforeUpdate() {
    this.detailsData.time = [
      this.detailsData.startTime,
      this.detailsData.endTime
    ]
    this.fileList1 = []
    this.fileList2 = []
    this.fileList3 = []
    this.fileList4 = []
    this.detailsData.listenClassFiles.forEach((item) => {
      item.name = item.fileName
      if (item.fileType == 1) {
        console.log(item.fileType)
        this.fileList1.push(item)
      } else if (item.fileType == 2) {
        this.fileList2.push(item)
      } else if (item.fileType == 3) {
        this.fileList3.push(item)
      } else if (item.fileType == 4) {
        this.fileList4.push(item)
      }
    })
  },
  beforeMount() {
    this.detailsData.time = [
      this.detailsData.startTime,
      this.detailsData.endTime
    ]
    this.fileList1 = []
    this.fileList2 = []
    this.fileList3 = []
    this.fileList4 = []
    this.detailsData.listenClassFiles.forEach((item) => {
      item.name = item.fileName
      if (item.fileType == 1) {
        console.log(item.fileType)
        this.fileList1.push(item)
      } else if (item.fileType == 2) {
        this.fileList2.push(item)
      } else if (item.fileType == 3) {
        this.fileList3.push(item)
      } else if (item.fileType == 4) {
        this.fileList4.push(item)
      }
    })
    console.log(this.detailsData)
  }
}
</script>

<style lang="scss" scoped>
.tpkDetails {
  .el-icon-download:before {
    margin-right: 5px;
    color: #8f8f8f;
  }
  .download.el-button {
    display: block;
    margin: 0;
    line-height: 40px !important;
  }
  .cRed {
    color: #ff0000;
  }
  em.cRed {
    font-style: normal;
    font-size: 22px;
  }
  .left {
    float: left;
    font-weight: 700;
  }
  .right {
    float: right;
    font-weight: 700;
  }
  .cardTop {
    overflow: hidden;
  }
  .evaluationCard {
    box-shadow: 0 0 2px 2px rgba(196, 196, 196, 0.2);
    border-radius: 4px;
    .cardHearder {
      background-color: #f0f0f0;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      text-align: center;
      .hui {
        color: #9c9c9c;
      }
    }
    .cardBody {
      .conItem {
        margin: 0 20px;
        height: 50px;
        line-height: 50px;
        color: #a9b2ad;
        border-bottom: 1.5px solid rgba(196, 196, 196, 0.3);
        .right,
        .left {
          font-weight: normal;
        }
      }
      .conItem:last-of-type {
        border: none;
      }
      border-bottom: 1.5px solid rgba(196, 196, 196, 0.3);
    }
    .cardFoot {
      padding: 20px;
      p {
        margin-top: 10px;
        width: 100%;
      }
    }
  }
  .reflection.evaluationCard {
    padding: 20px;
    max-height: 45vh;
    overflow-y: auto;
  }
}
</style>
