<!-- WebStorm
  @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
  @Created: 2021/8/15 18:10
  @Filename: Risk.vue
  @Function: do nothing >_>
-->
<template>
  <div id="risk">
    <h1>易方达消费行业股票风险分析</h1>
    <div id="risk-sharpe-area" class="risk-area">
      <div id="risk-sharpe-data" class="risk-data">
        <ul>
          <li>夏普率（频率/年）: {{ sharpe_yearly }}</li>
          <li>夏普率（频率/月）: {{ sharpe_monthly }}</li>
          <li>夏普率（频率/日）: {{ sharpe_daily }}</li>
        </ul>
      </div>
      <div id="risk-sharpe-container" class="risk-container"></div>
    </div>

    <div id="risk-mdd-area" class="risk-area">
      <div id="risk-mdd-data" class="risk-data">
        <h3>{{ from_date }} - {{ to_date }}</h3>
        <h4 v-if="sharpe !== ''">时间段内夏普率: {{ sharpe }}</h4>
        <ul>
          <li>最大回撤率: {{ mdd === "" ? "" : mdd["mdd"] }}</li>
          <li>
            回撤峰值: {{ mdd === "" ? "" : mdd["mdd_peak"]["net_asset_value"] }}
          </li>
          <li>回撤峰值日期: {{ mdd === "" ? "" : mdd["mdd_peak"]["date"] }}</li>
          <li>
            回撤谷值:
            {{ mdd === "" ? "" : mdd["mdd_nadir"]["net_asset_value"] }}
          </li>
          <li>
            回撤谷值日期: {{ mdd === "" ? "" : mdd["mdd_nadir"]["date"] }}
          </li>
        </ul>
      </div>
      <div id="risk-mdd-container" class="risk-container"></div>
    </div>
  </div>
</template>

<script>
import { DataSet } from "@antv/data-set";
import { Chart } from "@antv/g2";

import constants from "../lib/constants";
import reqTool from "../lib/util/reqTool";

const ds = new DataSet();

export default {
  name: "Risk",
  data() {
    return {
      sharpe_chart: null,
      mdd_chart: null,
      sharpe_rows: [],
      mdd_rows: [],
      code: constants.CONSUMER_SECTOR_STOCK_CODE,
      mdd: "",
      mdd_list: [],
      sharpe: "",
      sharpe_year_list: [],
      sharpe_yearly: "",
      sharpe_monthly: "",
      sharpe_daily: "",
      range_type: constants.QUERY_RANGE_ALL,
      from_date: "",
      to_date: "",
      sharpe_scale: {
        year: {
          alias: "年份",
          // type: "time",
        },
        sharpe: {
          alias: "年夏普率",
          nice: true,
          sync: true,
        },
      },
      mdd_scale: {
        date: { alias: "起始日期" },
        mdd: { alias: "最大回撤率", nice: true, sync: true },
        mdd_peak_value: { alias: "回撤峰值", sync: true },
        mdd_nadir_value: { alias: "回撤谷值", sync: true },
        mdd_peak_date: { alias: "回撤峰值日期", sync: true },
        mdd_nadir_date: { alias: "回撤谷值日期", sync: true },
      },
    };
  },
  created() {},
  mounted() {
    this.sharpe_chart = new Chart({
      container: "risk-sharpe-container",
      autoFit: true,
      height: 200,
      // padding: [20, 50, 50, 50],
    });
    this.mdd_chart = new Chart({
      container: "risk-mdd-container",
      autoFit: true,
      height: 300,
    });
    let that = this;
    this.get_risk_data().then(() => {
      that.render_sharpe_data();
      that.render_mdd_data();
    });
  },
  methods: {
    async get_risk_data() {
      await this.$axios
        .get(reqTool.generate_url(constants.REQ_URL.GET_RISK_DATA, this.code), {
          params: reqTool.generate_params(
            this.range_type,
            this.from_date,
            this.to_date
          ),
        })
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data;
            this.mdd = data["mdd"];
            this.mdd_list = data["mdd_list"];
            if (this.mdd_list.length > 0) {
              this.from_date = this.mdd_list[0]["from"];
              this.to_date = this.mdd_list[0]["to"];
            }
            if (reqTool.check_is_range_all(this.range_type)) {
              this.sharpe_year_list = data["sharpe_year_list"];
              this.sharpe_yearly = data["sharpe_yearly"];
              this.sharpe_monthly = data["sharpe_monthly"];
              this.sharpe_daily = data["sharpe_daily"];
            } else {
              this.sharpe = data["sharpe"];
            }
          }
          console.log(res.data.desc);
        });
    },
    transform_sharpe_data() {
      let dv = ds.createView().source(this.sharpe_year_list);
      dv.transform({
        type: "map",
        callback(row) {
          row["sharpe"] = parseFloat(row["sharpe"]);
          return row;
        },
      });
      return dv.rows;
    },
    render_sharpe_data() {
      // console.log(this.raw_data.length);

      this.sharpe_rows = this.transform_sharpe_data();
      this.sharpe_chart.data(this.sharpe_rows);
      this.sharpe_chart.scale(this.sharpe_scale);

      this.sharpe_chart.axis("year", {
        title: {},
        position: "bottom",
      });

      this.sharpe_chart.axis("sharpe", {
        title: {},
        position: "left",
      });

      this.sharpe_chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      this.sharpe_chart.line().position("year*sharpe").tooltip("year*sharpe");

      this.sharpe_chart.interaction("element-active");

      this.sharpe_chart.render();
    },
    transform_mdd_data() {
      let dv = ds.createView().source(this.mdd_list);
      dv.transform({
        type: "map",
        callback(row) {
          let date = row["from"];
          row["date"] =
            date.substring(0, 4) +
            "-" +
            date.substring(4, 6) +
            "-" +
            date.substring(6);
          row["mdd"] = parseFloat(row["mdd"]);
          row["mdd_peak_value"] = row["mdd_peak"]["net_asset_value"];
          row["mdd_nadir_value"] = row["mdd_nadir"]["net_asset_value"];
          row["mdd_peak_date"] = row["mdd_peak"]["date"];
          row["mdd_nadir_date"] = row["mdd_nadir"]["date"];
          return row;
        },
      });
      dv.transform({
        type: "pick",
        fields: [
          "date",
          "mdd",
          "mdd_peak_value",
          "mdd_nadir_value",
          "mdd_peak_date",
          "mdd_nadir_date",
        ],
      });
      return dv.rows;
    },
    render_mdd_data() {
      this.mdd_rows = this.transform_mdd_data();
      this.mdd_chart.data(this.mdd_rows);
      this.mdd_chart.scale(this.mdd_scale);

      this.mdd_chart.axis("date", {
        title: {},
        position: "bottom",
      });

      this.mdd_chart.axis("mdd", {
        title: {},
        position: "left",
      });

      this.mdd_chart.axis("mdd_peak_value", false);
      this.mdd_chart.axis("mdd_nadir_value", false);
      this.mdd_chart.axis("mdd_peak_date", false);
      this.mdd_chart.axis("mdd_nadir_date", false);

      this.mdd_chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      this.mdd_chart
        .line()
        .position("date*mdd")
        .tooltip(
          "date*mdd*mdd_peak_date*mdd_peak_value*mdd_nadir_date*mdd_nadir_value"
        );
      let mdd = parseFloat(this.mdd["mdd"]) * 100;
      this.mdd_chart.annotation().line({
        top: false,
        start: ["min", mdd],
        end: ["max", mdd],
        text: {
          content: `始末最大回撤率 ${mdd}%`,
          position: "end",
          style: {
            textAlign: "end",
            color: "green",
            fontSize: 20,
            fontWeight: "bold",
          },
        },
      });

      this.mdd_chart.interaction("element-active");

      this.mdd_chart.render();
    },
  },
};
</script>

<style scoped>
#risk {
  height: 100%;
}

#risk h1 {
  text-align: center;
}

#risk h3 {
  text-align: center;
}

.risk-area {
  width: 100%;
  display: inline-block;
}

.risk-area .risk-data,
.risk-area .risk-container {
  display: inline-block;
  vertical-align: middle;
}

.risk-area .risk-data {
  width: 16%;
}

.risk-data li {
  font-size: 16px;
}

.risk-area .risk-container {
  margin-left: 0.5%;
  width: 83%;
}

#risk-mdd-area {
  margin-top: 20px;
}
</style>
