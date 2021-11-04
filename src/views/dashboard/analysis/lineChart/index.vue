<template>
  <!-- 为 额chart 准备一个容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入 echarts 类库
import * as echarts from "echarts";
export default {
  name: "LineChart",
  mounted() {
    // 获取到容器对象, Vue 中只能通过 ref 才能获取到容器对象 通过 echarts.init echart 实例
    let myChart = echarts.init(this.$refs.charts);
    // 通过 setOption 在容器内部生成折线图
    myChart.setOption({
      // 表示 X 轴, X, Y 轴必须要同时写才能显示图表, 缺一不可
      xAxis: {
        // 类目轴，适用于离散的类目数据。为该类型时类目数据可自动从 series.data 或 dataset.source 中取，或者可通过 xAxis.data 设置类目数据。
        type: "category",
        // 用来减少图形两边的留白空间, 在此项目中的作用
        boundaryGap: false,
      },

      //  表示 Y 轴
      yAxis: {
        // 控制 Y 轴轴线是否显示
        show: false,
      },
      //  为图表提供数据, 设置图表的类型, 是折线图, 还是柱状图
      series: {
        //   category 在那个轴的对象里就为那个轴提供数据
        data: [3, 6, 9, 7, 5, 5, 6, 7, 5, 1, 3, 7, 9, 5],
        // 设置图表显示的类型, 折线图, 柱状图
        type: "line",
        // 是否平滑曲线
        smooth: true,
        // 设置线的颜色
        lineStyle: {
          color: "pink",
        },
        // 设置每个数据拐点的透明度
        itemStyle: {
          opacity: 0,
        },
        // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#89e5b7", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#6ebeca", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      //  设置组件于容器的距离
      grid: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
    //   是否动画显示
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