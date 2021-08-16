<!-- WebStorm
  @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
  @Created: 2021/8/15 18:10
  @Filename: Returns.vue
  @Function: do nothing >_>
-->
<template>
  <div id="returns">
    <h1>易方达消费行业股票收益分析</h1>
    <h3>{{ from_date }} - {{ to_date }}</h3>
    <div id="returns-container"></div>
  </div>
</template>

<script>
import { DataSet } from "@antv/data-set";
import { Chart } from "@antv/g2";
import constants from "../lib/constants";
import reqTool from "../lib/util/reqTool";

const ds = new DataSet();

export default {
  name: "Returns",
  data() {
    return {
      chart: null,
      code: constants.CONSUMER_SECTOR_STOCK_CODE,
      /**
       * returns_data: {
       *   "hrr": "0.001", // holding return rate
       *   "crr_list": [
       *     {
       *       "crr": "3.5620", // cumulative return rate
       *       "date": "20210813"
       *     },
       *     ...
       *   ]
       * }
       */
      crr_list: [],
      hrr: "",
      range_type: constants.QUERY_RANGE_ALL,
      from_date: "",
      to_date: "",
      scale: {
        date: {
          alias: "日期",
          type: "time",
        },
        crr: {
          alias: "累计收益率",
          nice: true,
          sync: true,
          tickInterval: 50,
        },
      },
    };
  },
  created() {},
  mounted() {
    this.chart = new Chart({
      container: "returns-container",
      autoFit: true,
      height: 500,
      padding: [20, 80, 50, 80],
    });
    let that = this;
    this.get_returns_data().then(() => {
      that.render_data();
    });
  },
  methods: {
    async get_returns_data() {
      await this.$axios
        .get(
          reqTool.generate_url(constants.REQ_URL.GET_RETURNS_DATA, this.code),
          {
            params: reqTool.generate_params(
              this.range_type,
              this.from_date,
              this.to_date
            ),
          }
        )
        .then((res) => {
          if (res.data.code === 0) {
            this.crr_list = res.data.data["crr_list"];
            this.hrr = res.data.data["hrr"];
            if (this.crr_list.length !== 0) {
              this.from_date = this.crr_list[0]["date"];
              this.to_date = this.crr_list[this.crr_list.length - 1]["date"];
            }
          }
          console.log(res.data.desc);
        });
    },
    transform_data() {
      let dv = ds.createView().source(this.crr_list);
      dv.transform({
        type: "map",
        callback(row) {
          row["crr"] = parseFloat(row["crr"]) * 100;
          let date = row["date"];
          row["date"] =
            date.substring(0, 4) +
            "-" +
            date.substring(4, 6) +
            "-" +
            date.substring(6);
          return row;
        },
      });
      return dv.rows;
    },
    render_data() {
      // console.log(this.raw_data.length);

      this.rows = this.transform_data();
      this.chart.data(this.rows);
      this.chart.scale(this.scale);

      this.chart.axis("date", {
        title: {},
        position: "bottom",
      });

      this.chart.axis("crr", {
        label: {
          formatter: (val) => {
            return val + "%";
          },
          autoHide: false,
        },
        title: {},
        position: "left",
      });

      this.chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      this.chart.line().position("date*crr");
      let hrr = parseFloat(this.hrr) * 100;

      this.chart.annotation().line({
        top: true,
        start: ["min", hrr],
        end: ["max", hrr],
        text: {
          content: `持仓收益率 ${hrr}%`,
          position: "end",
          style: {
            textAlign: "end",
            color: "green",
            fontSize: 28,
            fontWeight: "bold",
          },
        },
      });

      this.chart.interaction("element-active");

      this.chart.render();
    },
  },
};
</script>

<style scoped>
#returns {
  height: 100%;
}

#returns h1 {
  text-align: center;
}

#returns h3 {
  text-align: center;
}

#returns-container {
  margin-top: 20px;
  width: 94%;
  margin-left: 2%;
}
</style>
