import type { Route } from '#util/http';
import { COOKIE_NAME, deleteCookie } from '#util/auth';
import type { Request, Response } from 'polka';

export default class implements Route {
	public auth = true;

	public async post(_: Request, res: Response) {
		deleteCookie(res, COOKIE_NAME);
		res.send(200, { success: true });
	}
}