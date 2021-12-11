import { existsSync } from 'fs';
import { parse, normalize } from 'path';
import { parseFile } from '@fast-csv/parse';
import { AnyObjectArray } from '../domain/types/shared-types';

// TODO: Use strategy pattern to read from different datasources

/**
 * Read a csv file from path returning an object array
 * representing the rows
 */
export default async function readCsvFile(path: string): Promise<AnyObjectArray> {
    const normalizedPath = normalize(path);

    if(parse(normalizedPath).ext !== '.csv') {
        throw new Error('Only csv input files are supported by this program');
    }

    if(!existsSync(normalizedPath)) {
        throw new Error(`File at path ${normalizedPath} does not exists`);
    }

    const data: AnyObjectArray = await new Promise((resolve, reject) => {
        const data: AnyObjectArray = [];

        parseFile(normalizedPath, { headers: true })
        .on('error', (error) => reject(error))
        .on('data', (row) => data.push(row))
        .on('end', () => resolve(data));
    });

    return data;
}