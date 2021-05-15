<template>
  <div class="dashboard-container">
    <!-- 面板统计组件 -->
    <panel-group :userTotal="userTotal" :articleTotal="articleTotal" :questionTotal="questionTotal" />
    <!-- 布局 -->
    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <!-- 
            echarts 渲染数据必须在初始化之前，否则将渲染默认数据
           -->
          <!-- 各技术频道文章统计 -->
          <!-- echarts 的数据必须在初始化的收传入 -->
          <pie-chart v-if="flag" :legendData="pieData.nameList" :series="pieData.nameAndValueList" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <!-- 各技术频道文章统计 -->
          <bar-chart v-if="flag" :xAxisData="barData.yearMonthList" :series="barData.aritcleTotalList" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import BarChart from './components/BarChart.vue'
import PanelGroup from './components/PanelGroup.vue'
import PieChart from './components/PieChart.vue'
// 导入查询数据api
import api from '@/api/dashboard'

export default {
  name: 'Dashboard',
  components: {
    PieChart,
    BarChart,
    PanelGroup,
  },
  data() {
    return {
      userTotal: 0,
      articleTotal: 0,
      questionTotal: 0,
      flag: false, // 用来判断是否渲染图表组件
      pieData: {},
      barData: {}
    }
  },
  mounted() {
    this.fetchTotalData()
    this.fetchGarphData()
  },
  methods: {
    async fetchTotalData() {
      const user = await api.getUserTotal()
      const article = await api.getArticleTotal()
      const question = await api.getQuestionTotal()
      this.userTotal = user.data
      this.articleTotal = article.data
      this.questionTotal = question.data
    },
    async fetchGarphData() {
      const pieData1 = await api.getPieData()
      const barData1 = await api.getBarData()
      this.pieData = pieData1.data
      this.barData = barData1.data
      // 查询到数据后再加载图表组件（对图表初始化）
      this.flag = true
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
