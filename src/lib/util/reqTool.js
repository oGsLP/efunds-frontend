/**
 * WebStorm
 * @Author: oGsLP(1145234011@qq.com/ogssober@gmail.com)
 * @Created: 2021/8/16 11:31
 * @Filename: reqTool.js
 * @Function: do nothing >_>
 */

import constants from "./../constants";

const generate_url = (url_template, code) => {
  return url_template.replace(constants.CODE_HOLDER, String(code));
};

const check_is_range_all = (range_type) =>
  range_type !== constants.QUERY_RANGE_CURRENT_YEAR &&
  range_type !== constants.QUERY_RANGE_PERIOD;

const generate_params = (range_type, from_date, to_date) => {
  if (range_type === constants.QUERY_RANGE_CURRENT_YEAR) {
    return {
      type: range_type,
    };
  }
  if (range_type === constants.QUERY_RANGE_PERIOD) {
    return {
      type: range_type,
      from: from_date,
      to: to_date,
    };
  }
  return {
    type: constants.QUERY_RANGE_ALL,
  };
};

const reqTool = {
  generate_url,
  generate_params,
  check_is_range_all,
};

export default reqTool;
