import { getTransactions, rankCustomersByCreditScore } from "./domain/credit-score";

async function main() {
    try {
        const csvPath = process.argv[2];
        const limit = parseInt(process.argv[3]);

        console.log(csvPath, limit);

        const transactions = await getTransactions(csvPath);
        const bestCustomers = await rankCustomersByCreditScore(transactions, limit);

        console.log(`Best customers are ${JSON.stringify(bestCustomers)}`);

        process.exit(0);
    
    } catch(ex) {
        console.error(ex);
        process.exit(1);
    }
}

main();