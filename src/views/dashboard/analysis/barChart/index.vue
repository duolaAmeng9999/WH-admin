<template>
  <div ref="chart" class="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BarChart",
  mounted() {
    let myChart = echarts.init(this.$refs.chart);
    myChart.setOption({
      xAxis: {
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "bar",
        data: [3, 6, 9, 7, 5, 5, 6, 7, 5, 3, 3, 7, 9, 5],
        smooth: true,
        color: "#6395f9",
      },
      grid: {
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
      },
      animation: true,

    });
  },
};
</script>

<style lang="sass" scoped>
.charts
    width: 100%
    height: 46px
</style>