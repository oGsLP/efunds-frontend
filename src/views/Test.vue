<!-- WebStorm
  @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
  @Created: 2021/8/4 18:16
  @Filename: Test.vue
  @Function: for test
-->
<template>
  <p>{{ this.dta }}</p>
</template>

<script>
export default {
  name: "Test",
  created() {
    this.getTest();
  },
  data() {
    return {
      dta: "",
    };
  },
  methods: {
    async getTest() {
      await this.$axios("/api/test", { method: "get" }).then((res) => {
        this.dta = res.data;
      });
    },
  },
};
</script>

<style scoped></style>
