import type { Route } from '#util/http';
import type { Request, Response } from 'polka';
import { inject, injectable } from 'tsyringe';
import { Database } from 'better-sqlite3';

@injectable()
export default class TicketsRoute implements Route {
	public constructor(@inject('sql') private readonly sql: Database) {}

	public auth = true;

	public get(req: Request, res: Response) {
		const user = req.query?.user as string;
		const city = req.query?.id as string;

		const query = this.sql.prepare(`SELECT * FROM tickets WHERE ${user ? 'owner' : 'game_id'} = ?`).all(user ? user : city);

		return res.send(200, query ? [query].flat() : []);
	}

	public delete(req: Request, res: Response) {
		const id = Number.parseInt(req.body.id as string);
		const user = req.body.user as string;

		const { changes } = this.sql.prepare('DELETE FROM tickets WHERE id = ? AND owner = ?').run(id, user);

        if (changes > 0) {
            return res.send(200, { success: true });
        }

        return res.send(500, { message: 'An error ocurred. Please try again later.' });
	}

	public post(req: Request, res: Response) {
		const { data } = req.body;

		if (!Array.isArray(data)) {
			return res.send(401, `Payload must be in array format.`);
		}

		for (const body of data) {
			const requiredFields = {
				owner: 'string',
				row: 'string',
				column: 'number',
				price: 'number',
				country: 'string',
				city: 'string',
				game_id: 'string',
				state: 'string',
				venue: 'string',
				match: 'string'
			};

			for (const [key, val] of Object.entries(requiredFields)) {
				if (typeof body[key] !== val) {
					return res.send(401, `Field '${key}' must be of type '${val}'`);
				}
			}

			body.created = Date.now();

			const { changes } = this.sql
				.prepare(
					'INSERT INTO tickets (owner, created, row, column, price, country, city, game_id, state, venue, match) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
				)
				.run(body.owner, body.created, body.row, body.column, body.price, body.country, body.city, body.game_id, body.state, body.venue, body.match);

			if (changes < 1) {
                return res.send(500, { message: 'An error occurred. Please try again later.' });
			}
		}

        return res.send(200, { success: true });
	}
}
