import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();


//// Route1 ////

const entries = path.resolve(process.env.USERS);

const entryFile = async data => await fs.writeFile(entries, JSON.stringify(data))

const getEntry = async () => JSON.parse(await fs.readFile(entries))

const addEntry = async data => {
    let content = await getEntry()
    content.push(data)
    await entryFile(content)
}

//////////

export default {
    getEntry,
    addEntry
}
