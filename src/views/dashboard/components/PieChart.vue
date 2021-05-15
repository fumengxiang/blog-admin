<template>
  <!-- 使用charts需要提供一个可以设置宽高的dom元素 -->
  <div
    ref="main"
    :class="className"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
import * as echarts from "echarts"
require('echarts/theme/macarons')
import resize from './mixins/resize'

export default {
  name: "PieChart",
  mixins: [ resize ],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "400px",
    },
    legendData: {
      // 图例名称
      type: Array,
      default: () => ["前端", "Java", "移动端", "大数据"],
    },
    series: {
      // 饼状图中的数据
      type: Array,
      default: () => [
        { value: 100, name: "前端" },
        { value: 200, name: "Java" },
        { value: 500, name: "移动端" },
        { value: 300, name: "大数据" },
      ],
    },
  },
  mounted() {
    // 因为初始化echarts需要获取dom元素，必须保证所有dom节点已经挂载完成，
    // 所以需要调用$nickTick()函数，$nickTick()函数加载dom后才触发此方法
    this.$nextTick(() => {
      this.initChart();
    });
  },
  // 组件销毁之前调用此钩子
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },

  data() {
    return {
      chart: null, // 接收echsrts实例
    };
  },
  methods: {
    // 图表的初始化配置
    initChart() {
      // 初始化第二个参数设置主题
      this.chart = echarts.init(this.$refs.main, 'macarons');
      this.chart.setOption({
        title: {
          text: "各个技术频道文章统计",
          left: "center", // 居中显示标题
        },
        tooltip: { // 鼠标放在图标上的提示信息
          trigger: "item",
          formatter: '{a} <br /> {b} : {c} ({d}%)',
          backgroundColor: '#fff'
        },
        legend: { // 左上角的图例信息
          orient: "vertical",
          left: "left",
          data: this.legendData
        },
        series: [
          {
            name: "统计内容",
            type: "pie",
            radius: "50%", // 饼状图的大小
            center: ['50%', '50%'], // 饼图位置
            data: this.series,
            emphasis: {
              itemStyle: {
                shadowBlur: 10, // 阴影模糊的大小
                shadowOffsetX: 0, // 阴影水平方向偏移距离
                shadowColor: "rgba(0, 0, 0, 0.5)", // 阴影颜色
              },
            },
          },
        ],
      });
    },
  }
};
</script>

<style scoped lang="scss">
</style>
