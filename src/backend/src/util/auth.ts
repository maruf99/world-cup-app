import type { Middleware, Response } from 'polka';
import { randomBytes, createCipheriv, createDecipheriv,  } from 'node:crypto';
import type { Route } from '#util/http';

declare module 'http' {
	interface IncomingMessage {
		session?: Session | null;
	}
}

export const COOKIE_NAME = 'WORLD_CUP_AUTH';

export const COOKIE_EXPIRES_IN = 4 * 3600; // Number of hours converted to seconds

export const ALGORITHM = 'aes-256-cbc';

export interface Session {
	expires: number;
	username: string;
}

export const auth: Middleware = (req, res, next) => {
	const auth = req.cookies[COOKIE_NAME];

	if (!auth) {
		req.session = null;
	} else {
		req.session = decryptSession(auth);

		if (req.session === null) {
			deleteCookie(res, COOKIE_NAME);
		}
	}

	void next();
};

export const checkAuth = (route: Route): Middleware => {
	return (req, res, next) => {
		if (route.auth && !req.session) {
			res.send(401, { error: 'Unauthorized.' });
			return;
		}

		void next();
	};
};

export function deleteCookie(res: Response, name: string) {
	res.cookie(name, '', { expires: new Date(0), path: '/' });
}

export function encryptSession(session: Session) {
	const iv = randomBytes(16);
	const cipher = createCipheriv(ALGORITHM, process.env.SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(session)), cipher.final()]);

	return `${encrypted.toString('hex')}.${iv.toString('hex')}`;
}

export function decryptSession(encrypted: string) {
	const [data, iv] = encrypted.split('.');
	const decipher = createDecipheriv(ALGORITHM, process.env.SECRET_KEY, Buffer.from(iv, 'hex'));

	let decrypted = decipher.update(Buffer.from(data, 'hex'));
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	try {
		const session = JSON.parse(decrypted.toString()) as Session;
		return session.expires >= Date.now() ? session : null;
	} catch {
		return null;
	}
}
