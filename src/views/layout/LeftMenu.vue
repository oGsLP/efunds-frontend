<!-- WebStorm
  @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
  @Created: 2021/8/15 20:16
  @Filename: LeftMenu.vue
  @Function: do nothing >_>
-->
<template>
  <div id="eff-left-menu">
    <el-menu
      :default-active="$route.path"
      class="mar-l el-menu-vertical-demo el-col el-col-3"
      light
      router
    >
      <el-menu-item-group title="数据展示">
        <template v-for="(item, index) in menu_item">
          <el-menu-item :key="'menu-item' + index" :index="item.path"
            ><i :class="item.class" class="fa"></i>{{ item.title }}
          </el-menu-item>
        </template>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "LeftMenu",
  data() {
    return {
      menu_item: [
        {
          title: "净值数据",
          path: "/data/raw",
          class: "fa-money",
        },
        {
          title: "收益分析",
          path: "/data/returns",
          class: "fa-bar-chart",
        },
        {
          title: "风险分析",
          path: "/data/risk",
          class: "fa-exclamation-triangle",
        },
      ],
    };
  },
};
</script>
<style>
i.fa {
  vertical-align: baseline;
  margin-right: 10px;
}

#menu .el-menu {
  height: 100%;
  background-color: #fff;
  position: fixed;
  float: left;
  border-right: solid 1px #ccc;
  overflow: auto;
}
</style>
