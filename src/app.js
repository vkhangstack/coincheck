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

const getColoredChangeValueText = (value) => {
  const text = `${value}%`;
  return (value && (value > 0 ? text.green : text.red)) || "NA";
};

const getValidTop = (value) => {
  if (Number.isNaN(value) || value < 1) {
    return DEFAULT_TOP;
  }
  if (value > MAX_TOP) {
    return MAX_TOP;
  }
  return value;
};
// command line interface
const { version } = require("../package.json");
program
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

// handle table
// create header table
const defaultHeader = [
  "Rank",
  "Coin",
  "Price (USD)",
  "Change 24H",
  "Market Cap",
  "Supply",
  "Volume 24H",
].map((title) => title.yellow);
// create column table
const defaultColumns = defaultHeader.map((_item, index) => index);
const columns = defaultColumns;
const sortedColumns = [...columns].sort((a, b) => a - b);
const header = sortedColumns.map((index) => defaultHeader[index]);
const table = new Table({
  chars: {
    "top": "─",
    "top-mid": "┬",
    "top-left": "┌",
    "top-right": "┐",
    "bottom": "─",
    "bottom-mid": "┴",
    "bottom-left": "└",
    "bottom-right": "┘",
    "left": "│",
    "left-mid": "├",
    "mid": "─",
    "mid-mid": "┼",
    "right": "│",
    "right-mid": "┤",
    "middle": "│",
  },
  head: header,
});

// loading data  animation
const spinner = ora("Loading daa").start();

// call coinmarketcap API
const sourceUrl = `https://api.coincap.io/v2/assets?limit=${top}`;

axios
  .get(sourceUrl)
  .then(function (response) {
    spinner.stop();
    response.data.data
      .filter((record) => {
        if (find.length > 0) {
          return find.some(
            (keyword) => record.symbol.toLowerCase() === keyword.toLowerCase(),
          );
        }
        return true;
      })
      .map((record) => {
        return (editedRecord = {
          name: record.name,
          symbol: record.symbol,
          rank: record.rank ? +record.rank : 0,
          price: record.priceUsd ? +record.priceUsd : 0,
          market_cap: record.marketCapUsd ? +record.marketCapUsd : 0,
          supply: record.supply ? +record.supply : 0,
          percent_change_24h: record.changePercent24Hr
            ? +record.changePercent24Hr
            : 0,
          volume: record.volumeUsd24Hr ? +record.volumeUsd24Hr : 0,
        });
      })
      .map((record) => {
        return (values = [
          record.rank,
          record.symbol,
          record.price.toFixed(4),
          getColoredChangeValueText(record.percent_change_24h.toFixed(2)),
          record.market_cap,
          record.supply,
          record.volume,
        ]);
        // const values = sortedColumns.map((index) => defaultValues[index]);
      })
      .forEach((record) => table.push(record));
    if (table.length === 0) {
      console.log("We are not able to find coins matching your keyword".red);
    } else {
      console.log(
        `Data source from coincap.io at ${new Date().toLocaleTimeString()}`
          .green,
      );
      console.log(table.toString());
    }
  })
  .catch((error) => {
    console.log("error", error);
    spinner.stop();
    console.error("CoinCheck is not working now, Please try again later".red);
  });
