import { getTransactions, rankCustomersByCreditScore } from "./domain/credit-score";

async function main() {
    try {
        const csvPath = process.argv[0];
        const limit = Number(process.argv[1]);

        const transactions = await getTransactions(csvPath);
        const bestCustomers = await rankCustomersByCreditScore(transactions, limit);

        console.log(`Best customers are ${JSON.stringify(bestCustomers)}`);

        process.exit(0);
    
    } catch(ex) {
        console.error(ex);
        process.exit(1);
    }
}