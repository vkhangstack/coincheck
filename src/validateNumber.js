"use strict";
require("colors");
module.exports = {
  validateNumber: (value) => {
    if (isNaN(value) && +value >= 0) {
      console.log(`Please input a valid parameter.`.red);
      process.exit();
    }
    return +value;
  },
};
