<template>
  <el-card>
    <div class="common-card">
      <div class="card-title">
        <div>{{ title }}</div>
        <svg
          t="1635990505618"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8746"
          width="20"
          height="20"
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
            p-id="8747"
            fill="#facee2"
          ></path>
          <path
            d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"
            p-id="8748"
            fill="#facee2"
          ></path>
          <path
            d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
            p-id="8749"
            fill="#facee2"
          ></path>
        </svg>
      </div>
      <div class="card-value">
        {{ value }}
      </div>
      <div class="card-charts">
        <div class="card-charts-wrap">
          <!-- 使用默认插槽 -->
          <slot></slot>
        </div>
      </div>
      <div class="card-footer">
        <!-- 使用具名插槽 -->
        <slot name="footer"></slot>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "CommonCard",
  props: {
    title: String,
    value: String,
  },
};
</script>

<style scpode lang="sass">
.common-card
  margin-bottom: 10px

.card-title
  display: flex
  justify-content: space-between
  align-items: center
  color: rgba(0,0,0,.45)
  font-size: 14px

.card-value
  height: 38px
  margin-top: 4px
  margin-bottom: 0px
  overflow: hidden
  font-size: 30px
  line-height: 30px
  white-space: nowrap
  text-overflow: ellipsis
  word-break: break-all

.card-charts
  position: relative
  height: 50px
  margin-bottom: 12px

.card-charts-wrap
  position: absolute
  width: 100%
  bottom: 0
  left: 0
  font-size: 14px

.card-footer
  margin-top: 8px
  padding-top: 9px
  border-top: 1px solid #f0f0f0
</style>