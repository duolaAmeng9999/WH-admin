<template>
  <div class="dashboard-container">
    <Analysis></Analysis>
  </div>
</template>

<script>
import Analysis from "./analysis";
export default {
  name: "Dashboard",
  components: {
    Analysis,
  },
};
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
