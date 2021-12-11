import readCsvFile from "../io/read-csv";
import Transaction from "./types/transaction";
import dayjs from 'dayjs';

export async function getTransactions(filePath: string): Promise<Transaction[]> {
    const data = await readCsvFile(filePath);
    const requiredFields = ["Customer ID", "Transaction Amount", "Transaction Date"];

    const hasRequiredFields = (row: Object) => {
        return requiredFields.every(field => row.hasOwnProperty(field));
    };
    
    if(!hasRequiredFields(data[0])) {
        throw new Error(`One or more required fields are missing. Please confirm your csv file has the columns ${requiredFields.join(', ')}`);
    }

    const transactions = data.map((row) => ({
        customerId: row['Customer ID'] as string,
        amount: row['Transaction Amount'] as string,
        date: row['Transaction Date'] as string
    }));

    return transactions;
}

/**
 * Sorts transactions in place by date
 */
export function sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
    transactions.sort((prev, curr) => {
        const sortBefore = dayjs(prev.date).isBefore(dayjs(curr.date), 'day');
        const sortAfter = dayjs(prev.date).isAfter(dayjs(curr.date), 'day');

        if(sortBefore) return -1;
        if(sortAfter) return 1;
        return 0;
    });
    return transactions;
}

function groupTransactionsByCustomer(transactions: Transaction[]) {
    const transactionsMap = new Map();

    const groupedTransactions = transactions.reduce((acc, value) => {
        const key = `${value.customerId}-${value.date}`;
        if(!transactionsMap.has(key)) {
            (acc[value.customerId] ||= []).push(value);
            sortTransactionsByDate(acc[value.customerId]);
            transactionsMap.set(key, value);
        }
        return acc;
    }, {} as { [customerId: string]: Transaction[] });

    return groupedTransactions;
}

export function rankCustomersByCreditScore(transactions: Transaction[], limit: number): string[] {
    // Group transactions by customer
    const groupedTransactions = groupTransactionsByCustomer(transactions);

    /**
     * A hashmap to store each customers longest consecutive daily payments (cdp) period
     * The key is the customerId and the value is their longest cdp period, represented by a number
     */
    const cdpPeriodMap: { [customerId: string]: number } = {};

    for(let [customerId, transactions] of Object.entries(groupedTransactions)) {
        const cdpPeriods: { [periodStartDate: string]: Transaction[] } = {};

        let periodStartDate = dayjs(transactions[0].date);
        let dayIncrement = 0;

        for(let transaction of transactions) {
            const currDate = dayjs(transaction.date);
            
            if(periodStartDate.add(dayIncrement, 'days').isSame(currDate)) {
                (cdpPeriods[periodStartDate.toString()] ||= []).push(transaction);
                dayIncrement++;
            } else {
                dayIncrement = 1;
                periodStartDate = currDate;
                (cdpPeriods[periodStartDate.toString()] ||= []).push(transaction);
            }
        }

        const greatestPeriod = Object.values(cdpPeriods).reduce((prev, transactions) => {
            if(transactions.length > prev) {
                return transactions.length;
            }
            return prev;
        }, 0);

        cdpPeriodMap[customerId] = greatestPeriod;
    }

    // Sort customers by cdp period and IDs incase of ties
    const sortedCustomers = Object.keys(cdpPeriodMap).sort((prev, curr) => {
        return cdpPeriodMap[curr] - cdpPeriodMap[prev] || prev.localeCompare(curr);
    });

    return sortedCustomers.slice(0, limit);
}