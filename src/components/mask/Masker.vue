<template>
  <div
    id="model"
    v-show="loading"
    v-loading="loading"
    element-loading-text="拼命加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  ></div>
</template>

<script>
export default {
  props: ["loading"]
};
</script>

<style>
#model {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
}
</style>