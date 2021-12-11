import 'jest';
import { join } from 'path';
import { getTransactions, sortTransactionsByDate, rankCustomersByCreditScore } from './credit-score';
import Transaction from './types/transaction';

describe('Credit Score Module', () => {
    it('can get transactions when given a csv file path', async () => {
       const transactions = await getTransactions(join(__dirname, '../../tests/e2e/data/transaction_data_2.csv'));
       expect(transactions.length).toBe(1597);
    });

    it('throws an error when attempting to read from a csv file with missing required column(s)', () => {
        const filePath = join(__dirname, '../../tests/e2e/data/invalid_transaction_data.csv');
        expect(async() => await getTransactions(filePath)).rejects.toThrow();
    });

    it('can sort transactions by date', () => {
        const transactions: Transaction[] = [
            { customerId: 'CUST 01', amount: '244', date: '2021-12-09 00:00:00' },
            { customerId: 'CUST 01', amount: '350', date: '2021-11-14 00:00:00' },
            { customerId: 'CUST 05', amount: '720', date: '2021-12-28 00:00:00' },
            { customerId: 'CUST 02', amount: '500', date: '2021-05-02 00:00:00' }
        ];

        expect(sortTransactionsByDate(transactions)).toEqual([
            { customerId: 'CUST 02', amount: '500', date: '2021-05-02 00:00:00' },
            { customerId: 'CUST 01', amount: '350', date: '2021-11-14 00:00:00' },
            { customerId: 'CUST 01', amount: '244', date: '2021-12-09 00:00:00' },
            { customerId: 'CUST 05', amount: '720', date: '2021-12-28 00:00:00' }
        ]);
    });

    it('can rank customers by credit score', async () => {
        const transactions1 = await getTransactions(join(__dirname, '../../tests/e2e/data/transaction_data_1.csv'));
        expect(rankCustomersByCreditScore(transactions1, 1)).toEqual(['K20008']);

        const transactions2 = await getTransactions(join(__dirname, '../../tests/e2e/data/transaction_data_2.csv'));
        expect(rankCustomersByCreditScore(transactions2, 3)).toEqual(['K20987', 'K20008', 'K20233']);

        const transactions3 = await getTransactions(join(__dirname, '../../tests/e2e/data/transaction_data_3.csv'));
        expect(rankCustomersByCreditScore(transactions3, 5)).toEqual(['K20002', 'K20005', 'K20377', 'K20987', 'K22584']);
    })
});