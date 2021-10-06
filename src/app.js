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

const getValidTop = (top) => {
  if (Number.isNaN(top) || top < 1) {
    return DEFAULT_TOP;
  }
  if (top > MAX_TOP) {
    return MAX_TOP;
  }
  return top;
};
// command line interface
const { version } = require("../package.json");
process
  .version(version)
  .option(
    "-f, --find [symbol]",
    "Find specific coin data with coin symbol (can be a command separators list",
    list,
    [],
  )
  .option(
    "-t, --top [index]",
    "Show the top coins ranked from 1 - [index] according to the market cap",
    validate.validateNumber,
    DEFAULT_TOP,
  )
  .parse(process.argv);

console.log("\n");

const find = program.find;
const top = find.length > 0 ? MAX : getValidTop(program.top);
