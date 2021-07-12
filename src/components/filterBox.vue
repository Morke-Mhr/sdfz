<template>
  <div class="filterBox">
    <span
      v-if="isArrow"
      class="filterBox-prev el-icon-arrow-left"
      @click="arrowFun('left')"
    ></span>
    <span
      v-if="isArrow"
      class="filterBox-next el-icon-arrow-right"
      @click="arrowFun('right')"
    ></span>
    <div class="filterCont" id="filterCont">
      <el-form
        id="filterForm"
        class="filterForm"
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        :style="`transform: translateX(${translate}px)`"
      >
        <template v-for="(sItem, sIdx) in searchCol">
          <!-- :label="sItem.label" -->
          <el-form-item v-if="sItem.type == 'datePicker'" :key="sIdx">
            <el-date-picker
              v-if="sItem.dataType && sItem.dataType.includes('range')"
              v-model="dateList"
              @change="dateChange($event, sItem.propVal)"
              :type="sItem.dataType ? sItem.dataType : 'date'"
              :format="sItem.format ? sItem.format : ''"
              :value-format="sItem.valFormat ? sItem.valFormat : ''"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-date-picker>
            <el-date-picker
              v-else
              v-model="pageForm[sItem.propVal]"
              :type="sItem.dataType ? sItem.dataType : 'date'"
              :format="sItem.format ? sItem.format : ''"
              :value-format="sItem.valFormat ? sItem.valFormat : ''"
              :placeholder="
                sItem.placeholder ? sItem.placeholder : `请选择${sItem.label}`
              "
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item v-else-if="sItem.type == 'select'" :key="sIdx">
            <el-select
              v-model="pageForm[sItem.propVal]"
              :placeholder="
                sItem.placeholder ? sItem.placeholder : `请选择${sItem.label}`
              "
              clearable
              @change="selectChange($event, sItem.propVal)"
            >
              <el-option
                v-for="(oItem, oIdx) in optionObj[sItem['optionsIdx']]"
                :key="oIdx"
                :label="
                  sItem.optionBd ? oItem[sItem.optionBd.label] : oItem.label
                "
                :value="
                  sItem.optionBd ? oItem[sItem.optionBd.value] : oItem.value
                "
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="sItem.type == 'cascader'" :key="sIdx">
            <el-cascader
              v-model="pageForm[sItem.propVal]"
              :options="optionObj[sItem['optionsIdx']]"
              :props="{ checkStrictly: true, value: 'id' }"
              @change="cascaderFun($event, sItem.resetField)"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item v-else :key="sIdx">
            <el-input
              v-model="pageForm[sItem.propVal]"
              :maxlength="sItem.maxlength ? sItem.maxlength : -1"
              :placeholder="
                sItem.placeholder ? sItem.placeholder : `请输入${sItem.label}`
              "
              clearable
              :show-word-limit="sItem.maxlength"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="btnCont">
      <el-button class="chaxun" @click="search">查询</el-button>
      <el-button class="chongzhi" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  //时间格式显示设置参考  https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi
  name: 'filter-box',
  props: {
    /**
     * @searchCol 搜索项数组  数据类型[{}]
     * 数组对象属性对应值
     * @label  -->搜索项名称
     * @propVal  -->双向绑定数据字段名  当type为datePicker且dataType的值为范围选择类型 需绑定一个数组['开始时间对应字段','结束时间对应字段']
     * @type  -->表单项类型 1.input输入框 2.select下拉选择 3.datePicker日期下拉选择
     * @placeholder  -->默认提示文本
     * @maxlength  -->最大输入长度 当type为input时生效
     * 为下拉选择类型时
     * @optionBd  -->为下拉框绑定的字段值  {value:绑定值字段名,label:绑定文本值字段名} 当type为select时生效
     * 为级联选择器时
     * @optionObj 各个级联选择器需要绑定的数据 数据类型为{}
     * @optionsIdx 记录级联选择器所绑定的标识符 对应optionObj中的值
     * 为时间类型选择时
     * @dataType  -->时间选择类型 默认date: 对应日期选择/year： 对应年份选择/month：对应月份选择/dates：对应多个日期选择/week：对应周选择/datetime：对应日期-时间选择/datetimerange对应日期-时间范围选择/daterange：对应日期范围选择/monthrange：对应月份范围选择
     * @format  -->显示在输入框中的时间格式
     * @value-format -->时间选择器绑定值的格式
     *
     * @searchFun  -->查询对应事件
     * @pageConfig -->分页字段配置
     */
    optionObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    searchCol: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageConfig: {
      type: Object,
      default: () => {
        return {
          pageSize: 'pageSize'
        }
      }
    }
  },
  data() {
    return {
      // 视口宽度
      screenWidth: document.body.clientWidth,
      // 是否显示小箭头
      isArrow: false,
      // 表单绑定数据
      pageForm: {},
      // 偏移距离
      translate: 0,
      // 单次触发偏移距离
      filterCont: 0,
      // 小容器宽度
      filterForm: 0,
      // 时间选择器时绑定的值
      dateList: []
    }
  },
  methods: {
    // 查询方法
    search() {
      this.pageForm.pageNum = 1
      this.pageForm.pageSize = this.pageConfig.pageSize
      this.$emit('searchFun', this.pageForm)
    },
    // 重置方法
    reset() {
      this.dateList = []
      this.pageForm = {
        pageNum: 1,
        pageSize: 10
      }
      this.$emit('searchFun', this.pageForm)
    },
    // 根据宽度判断是否显示小箭头
    showArrow() {
      if (document.querySelector('#filterCont')) {
        this.filterCont = document.querySelector('#filterCont').clientWidth
        this.filterForm = document.querySelector('#filterForm').clientWidth
      }
      if (this.filterForm > this.filterCont) {
        this.isArrow = true
      } else {
        this.isArrow = false
        this.translate = 0
      }
    },
    // 选择时间段
    dateChange(val, dataArr) {
      console.log(val, dataArr)
      if (val == null) {
        this.dateList = []
        this.pageForm[dataArr[0]] = ''
        this.pageForm[dataArr[1]] = ''
      } else {
        this.pageForm[dataArr[0]] = val[0]
        this.pageForm[dataArr[1]] = val[1]
      }
    },
    // 下拉框改变选中事件 返回当前选中的值
    selectChange(e, propVal) {
      this.pageForm[propVal] = e
      // 强制刷新页面数据
      this.$forceUpdate()
    },
    //级联选择器change事件 选中值改变时置空resetField对应的字段 传入选中的值
    cascaderFun(val, resetField) {
      if (resetField) {
        this.selectChange('', resetField)
      }
      this.$emit('cascaderChange', val)
      this.$forceUpdate()
    },
    // 小箭头点击事件
    arrowFun(val) {
      switch (val) {
        case 'left':
          if (this.translate + this.filterCont >= 0) {
            this.translate = 0
          } else {
            this.translate += this.filterCont / 2
          }
          break
        case 'right':
          if (
            this.translate - this.filterCont <=
            this.filterCont - this.filterForm
          ) {
            this.translate = this.filterCont - this.filterForm
            // console.log(this.translate, this.filterCont, this.filterForm)
          } else {
            this.translate -= this.filterCont / 2
          }
          break
        default:
          break
      }
    },
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.showArrow()
      }
    }
  },
  mounted() {
    this.showArrow()
    this.watchWidth()
  }
}
</script>
