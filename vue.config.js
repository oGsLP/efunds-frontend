/**
 * WebStorm
 * @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
 * @Created: 2021/8/4 18:12
 * @Filename: vue.config.js
 * @Function: do nothing >_>
 */
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("components", resolve("./src/components"));
  },
  // css: {
  //   loaderOptions: {
  //     stylus: {
  //       import: "~@/style/style.sass",
  //     },
  //   },
  // },
};
