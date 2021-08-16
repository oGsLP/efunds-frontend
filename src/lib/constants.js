/**
 * WebStorm
 * @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
 * @Created: 2021/8/15 21:41
 * @Filename: constants.js
 * @Function: do nothing >_>
 */
const BASE_URL = "/api";
const CODE_HOLDER = "#code";
const constants = {
  CODE_HOLDER: CODE_HOLDER,
  REQ_URL: {
    GET_RAW_DATA: `${BASE_URL}/data/${CODE_HOLDER}`,
    GET_RETURNS_DATA: `${BASE_URL}/data/${CODE_HOLDER}/returns`,
    GET_RISK_DATA: `${BASE_URL}/data/${CODE_HOLDER}/risk`,
  },
  CONSUMER_SECTOR_STOCK_CODE: 110022,
  QUERY_RANGE_ALL: "all",
  QUERY_RANGE_CURRENT_YEAR: "cy",
  QUERY_RANGE_PERIOD: "period",
};

export default constants;
