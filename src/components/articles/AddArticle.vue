<template>
  <div id="add-article">
    <Fuwenben />
  </div>
</template>
<script>
import Fuwenben from "@/components/Fuwenben";

export default {
  data() {
    return {};
  },
  watch: {
    $route() {
      this.type = this.$route.params.about;
    }
  },
  methods: {},
  components: {
    Fuwenben
  }
};
</script>

<style lang="scss" scoped>
#add-article {
  padding: 20px;
  box-sizing: border-box;
  .el-form {
    width: 80%;
  }
}
</style>