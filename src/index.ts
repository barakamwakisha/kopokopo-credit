#!/usr/bin/env node

import {
  getTransactions,
  rankCustomersByCreditScore,
} from "./domain/credit-score";

const argv = require("yargs/yargs")(process.argv.slice(2))
  .option("csv", {
    alias: "c",
    describe: "The path to the csv file with KopoKopo transactions",
    type: "string"
  })
  .option("limit", {
    alias: "l",
    describe: "The first n best customers to display",
    type: "number"
  })
  .demandOption("csv", "Please specify the path to the csv file")
  .demandOption("limit", "Please specify the number of customers to display")
  .help().argv;

(async () => {
    try {
        const transactions = await getTransactions(argv.csv);
        const bestCustomers = await rankCustomersByCreditScore(transactions, argv.limit);

        console.log(`Best customers are ${JSON.stringify(bestCustomers)}`);
        process.exit(0);
    } catch (ex) {
      console.error(ex);
      process.exit(1);
    }
})();