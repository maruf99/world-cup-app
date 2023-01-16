import type { Route } from '#util/http';
import { log } from '#util/util';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Request, Response } from 'polka';

const MESSAGE_PATH = join(__dirname, '..', '..', 'messages.txt');
const SEPARATOR = `\n${'-'.repeat(15)}\n`;

export default class TicketsRoute implements Route {
	public auth = true;

	public async post(req: Request, res: Response) {
		const { user, subject, message }: Record<string, string> = req.body;

        const data = await readFile(MESSAGE_PATH, { encoding: 'utf8' }).catch(() => '');
        const arr = data.split(SEPARATOR);

        arr.push(`Author:${user}\nSubject: ${subject}\n\n${message}`);

        try {
            await writeFile(MESSAGE_PATH, arr.join(SEPARATOR), { encoding: 'utf8' });
        } catch (e) {
            log((e as Error)?.stack ?? e, 'error');
            return res.send(500, { error: 'An unknown error occurred. Please try again later' });
        }

        return res.send(200, { success: true });
	}
}
