<!-- WebStorm
  @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
  @Created: 2021/8/15 18:10
  @Filename: Raw.vue
  @Function: do nothing >_>
-->
<template>
  <div id="raw">
    <h1>易方达消费行业股票走势</h1>
    <date-picker
      id="raw-date-picker"
      v-model="from_to"
      clearable="false"
      confirm
      format="YYYYMMDD"
      range
      value-type="format"
      @confirm="reset_date_and_data"
    ></date-picker>
    <div id="raw-container"></div>
  </div>
</template>

<script>
import { DataSet } from "@antv/data-set";
import { Chart } from "@antv/g2";

import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

import constants from "../lib/constants";
import reqTool from "../lib/util/reqTool";

const ds = new DataSet();
export default {
  name: "Raw",
  components: { DatePicker },

  data() {
    return {
      chart: null,
      rows: [],
      code: constants.CONSUMER_SECTOR_STOCK_CODE,
      /**
       * raw_data: [
       *    {
       *      "cumulative_return_rate": "3.56199900",
       *      "date": "20210813",
       *      "day_rate": "0.44",
       *      "net_asset_value": "4.562"
       *    }
       * ]
       */
      raw_data: [],
      from_to: ["", ""],
      scale: {
        date: {
          alias: "日期",
          type: "time",
        },
        day_rate: {
          alias: "日涨幅",
          min: -25,
          max: 15,
          nice: true,
          sync: true,
          tickInterval: 5,
        },
        net_asset_value: {
          alias: "净值",
          min: 0,
          nice: true,
          sync: true,
          tickInterval: 1,
        },
      },
    };
  },
  created() {},
  mounted() {
    this.chart = new Chart({
      container: "raw-container",
      autoFit: true,
      height: 500,
      padding: [20, 80, 50, 80],
    });

    this.get_raw_data().then(() => {
      this.render_data();
    });
  },
  methods: {
    async get_raw_data() {
      await this.$axios
        .get(reqTool.generate_url(constants.REQ_URL.GET_RAW_DATA, this.code), {
          params: reqTool.generate_params(
            this.range_type,
            this.from_to[0],
            this.from_to[1]
          ),
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.raw_data = res.data.data;
            if (this.raw_data.length !== 0) {
              this.from_to[0] = this.raw_data[0]["date"];
              this.from_to[1] = this.raw_data[this.raw_data.length - 1]["date"];
              this.from_to.sort();
            }
          }
          console.log(res.data.desc);
        });
    },
    transform_data() {
      let dv = ds.createView().source(this.raw_data);
      dv.transform({
        type: "pick",
        fields: ["date", "day_rate", "net_asset_value"],
      });
      dv.transform({
        type: "map",
        callback(row) {
          row["day_rate"] = parseFloat(row["day_rate"]);
          row["net_asset_value"] = parseFloat(row["net_asset_value"]);
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
      this.rows = this.transform_data();

      this.chart.data(this.rows);
      this.chart.scale(this.scale);

      this.chart.axis("date", {
        label: {
          formatter: (val) => {
            return val; // 格式化坐标轴显示文本
          },
          autoHide: false,
        },
        title: {},
        position: "bottom",
      });

      this.chart.axis("day_rate", {
        label: {
          formatter: (val) => {
            return val + "%";
          },
          autoHide: false,
        },
        title: {},
        position: "left",
      });

      this.chart.axis("net_asset_value", {
        label: {
          autoHide: false,
        },
        title: {},
        position: "right",
      });

      this.chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      this.chart
        .point()
        .position("date*day_rate")
        .size(1.5)
        .shape("circle")
        .tooltip("")
        .color("day_rate", (val) => {
          return val < 0 ? "red" : "green";
        });

      this.chart
        .line()
        .position("date*net_asset_value")
        .tooltip("date*day_rate*net_asset_value");

      this.chart.option("scrollbar", false);
      this.chart.option("slider", false);
      this.chart.interaction("element-active");

      this.chart.render();
    },
    reset_date_and_data() {
      this.range_type = constants.QUERY_RANGE_PERIOD;
      this.get_raw_data().then(() => {
        this.render_data();
      });
    },
  },
};
</script>

<style scoped>
#raw {
  height: 100%;
}

#raw h1 {
  text-align: center;
}

#raw-date-picker {
  left: 40%;
  width: 20%;
  text-align: center;
}

#raw-container {
  margin-top: 20px;
  width: 94%;
  margin-left: 2%;
}
</style>
