#!/user/bin/env node
const program = require("commander");
const axios = require("axios");
const ora = require("ora");
const Table = require("cli-table3");
const validate = require("./validateNumber");
require("colors");

const DEFAULT_TOP = 10;
const MAX_TOP = 2000;

// helper function
const list = (value) => (value && value.split(",")) || [];

const getColoredChangeValue = (value) => {
  const text = `${value}%`;
  return (value && (value > 0 ? text.green : text.red)) || "NA";
};
