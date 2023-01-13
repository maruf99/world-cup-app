import type { Route } from "#util/http";
import { Database } from "better-sqlite3";
import { injectable, inject } from "tsyringe";
import { COOKIE_EXPIRES_IN, COOKIE_NAME, encryptSession } from '#util/auth';
import type { Request, Response } from 'polka';
import type { User } from "#util/util";
import type { Session } from "#util/auth";

@injectable()
export default class implements Route {
    public constructor(@inject('sql') private readonly sql: Database) {}

	public async post(req: Request, res: Response) {
        const { username, password } = req.body as User;

        if (username?.length && password?.length) {
            const query = this.sql.prepare('SELECT username FROM users WHERE username = ?');

            const found = query.get(username.toLowerCase()) as User;

            if (found) {
                return res.send(401, { error: "That username already exists." });
            }

            const { changes } = this.sql.prepare('INSERT INTO users (username, password) VALUES (?, ?) RETURNING username, id').get(username.toLowerCase(), password);

            if (changes < 1) {
                return res.send(500, { error: "An unknown error occurred. Please try again later." });
            }

            const session: Session = {
                username,
                expires: Date.now() + (COOKIE_EXPIRES_IN * 1000)
            };

            res.cookie(COOKIE_NAME, encryptSession(session), { maxAge: COOKIE_EXPIRES_IN, httpOnly: true, path: '/' });
            res.send(200, session);
        } else {
            res.send(400, { error: 'Missing parameters' });
        }
	}
}