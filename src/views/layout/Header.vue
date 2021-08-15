<!-- WebStorm
  @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
  @Created: 2021/8/15 20:14
  @Filename: Header.vue
  @Function: do nothing >_>
-->
<template>
  <div id="eff-header">
    <header>
      <img alt="logo" class="header-logo" src="./../../assets/logo.png" />
      <ul class="header-operations">
        <li>@oGsLP</li>
      </ul>
    </header>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {};
  },
};
</script>
<style>
header {
  background-color: rgb(100, 100, 200);
  height: 80px;
  width: 100%;
  top: 0;
  left: 0;
  padding: 0 20px;
  z-index: 999;
  box-sizing: border-box;
  position: fixed;
}

.header-logo {
  display: inline-block;
  vertical-align: middle;
}

.header-operations {
  display: inline-block;
  vertical-align: middle;
  float: right;
  padding-right: 10px;
  height: 100%;
  margin: 10px 0 0;
}

.header-operations li {
  color: #fff;
  display: inline-block;
  vertical-align: middle;
  padding: 0;
  margin: 0;
  line-height: 60px;
  cursor: pointer;
}

.header-operations li:first-child {
  cursor: default;
}

.header-opacity {
  opacity: 0.7;
}

.header-operations:after,
header:after {
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
}
</style>
