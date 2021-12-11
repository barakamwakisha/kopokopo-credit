import 'jest';
import { join } from 'path';
import readCsv from './read-csv';

describe('IO Module', () => {
    it('can read a csv file given a correct path', async () => {
        const filePath = join(__dirname, '../../tests/e2e/data/transaction_data_1.csv');
        const data = await readCsv(filePath);
        expect(data.length).toBe(34);
    });

    it('throws an error when given an icorrect path', () => {
        const filePath = join(__dirname, '../../tests/e2e/data/non_existent_file.csv');
        expect(async() => await readCsv(filePath)).rejects.toThrow(`File at path ${filePath} does not exists`);
    });

    it('throws an error when provided a path to a file that\'s not a csv', () => {
        const filePath = join(__dirname, '../../tests/e2e/data/unsupported_file_format.xls');
        expect(async() => await readCsv(filePath)).rejects.toThrow('Only csv input files are supported by this program');
    });
});