<!-- WebStorm
  @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
  @Created: 2021/8/15 18:10
  @Filename: Raw.vue
  @Function: do nothing >_>
-->
<template>
  <div id="raw">
    {{ raw_data }}
  </div>
</template>

<script>
import constants from "../lib/constants";

export default {
  name: "Raw",
  data() {
    return {
      raw_data: {},
    };
  },
  created() {
    this.get_raw_data();
  },
  mounted() {},
  methods: {
    get_raw_data(code = constants.CONSUMER_SECTOR_STOCK_CODE) {
      this.$axios
        .get(
          constants.REQ_URL.GET_RAW_DATA.replace(constants.CODE_HOLDER, code)
        )
        .then((res) => {
          if (res.data.code === 0) {
            this.raw_data = res.data.data;
          }
          console.log(res.data.desc);
        });
    },
  },
};
</script>

<style scoped></style>
