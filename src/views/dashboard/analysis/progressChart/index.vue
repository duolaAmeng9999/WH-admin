<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressChart",
  mounted() {
    let myChart = echarts.init(this.$refs.charts);
    myChart.setOption({
      xAxis: {
        min: 0, // 最小显示
        max: 100, // 最大数据
        show: false, // 是否显示 X 轴坐标
        boundaryGap: false, // 用来减少两边留白
      },
      yAxis: {
        type: "category",
        show: false,
      },
      series: {
        type: "bar",
        data: [43],
        color: "pink",
        // 设置柱状图的背景颜色
        backgroundStyle: {
          color: "#74c4d6",
        },
        // 是否显示柱状图的背景颜色
        showBackground: true,
        // 控制柱状图的宽度
        barWidth: 10,
      },
      // 坐标轴指示器的文本标签。
      label: {
        show: true, // 是否显示文本标签
        formatter: "|", // 文本标签文字的格式化器。如果为 string，可以是例如：formatter: 'some text {value} some text，其中 {value} 会被自动替换为轴的值。
        position: "right", // 控制文本标签的位置
      },
      // 控制组件距离容器之间的距离
      grid: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
      // 是否动画战展示
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