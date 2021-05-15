<template>
  <div
    ref="main"
    :class="className"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
import * as echarts from "echarts"
require("echarts/theme/macarons")
// 自适应窗口大小，从而改变图标的大小
import resize from './mixins/resize'

export default {
  name: "BarCharts",
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
    xAxisData: {
      // x轴显示的数据
      // 图例名称
      type: Array,
      default: () => [
        "2021-02",
        "2021-03",
        "2021-04",
        "2021-05",
        "2021-06",
        "2021-07",
      ],
    },
    series: {
      type: Array,
      default: () => [10, 52, 200, 334, 390, 330],
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.main, "macarons");
      this.chart.setOption({
        title: {
          text: "近六个月发布的文章数",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          backgroundColor: '#fff'
        },
        grid: { // 关于柱状图整体位置
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true, // 标签的宽度是否作为图标的宽度
        },
        xAxis: [
          {
            type: "category",
            data: this.xAxisData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value", // y轴自动根据数据生成对应坐标范围
          },
        ],
        series: [
          {
            name: "发布数",
            type: "bar",
            barWidth: "60%", // 每个柱状的宽度
            data: this.series,
          },
        ],
      });
    },
  }
};
</script>

<style scoped lang="scss">
</style>
