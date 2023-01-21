import type { Route } from '#util/http';
import { log } from '#util/util';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Request, Response } from 'polka';

const MESSAGE_PATH = join(__dirname, '..', '..', 'messages.txt');
const SEPARATOR = `\n${'-'.repeat(15)}\n`;

// File Reading/Writing logic.
export default class ContactRoute implements Route {
	public auth = true;

	public async post(req: Request, res: Response) {
		const { user, subject, message }: Record<string, string> = req.body;

        // Reads the current messages.txt file
        const data = await readFile(MESSAGE_PATH, { encoding: 'utf8' }).catch(() => '');

        // Splits each message entry into an array.
        const arr = data.split(SEPARATOR);

        // Adds the new message entry to the array.
        arr.push(`Author:${user}\nSubject: ${subject}\n\n${message}`);

        try {
            // Writes to the messages.txt file with the new data.
            await writeFile(MESSAGE_PATH, arr.join(SEPARATOR), { encoding: 'utf8' });
        } catch (e) {
            log((e as Error)?.stack ?? e, 'error');
            return res.send(500, { error: 'An unknown error occurred. Please try again later' });
        }

        return res.send(200, { success: true });
	}
}
