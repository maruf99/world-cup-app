import type { Middleware, Response } from 'polka';
import { randomBytes, createCipheriv, createDecipheriv,  } from 'node:crypto';
import type { Route } from '#util/http';

declare module 'http' {
	interface IncomingMessage {
		session?: Session | null;
	}
}

export const COOKIE_NAME = 'WORLD_CUP_AUTH';

// The amount of time it takes for the session/cookie to expire, in seconds.
export const COOKIE_EXPIRES_IN = 4 * 3600; // Number of hours converted to seconds

export interface Session {
	expires: number;
	username: string;
}

// Adds the session to the Request object, if there is an active one.
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

// Checks that there is an active session and that a user is logged in.
export const checkAuth = (route: Route): Middleware => {
	return (req, res, next) => {
		if (route.auth && !req.session) {
			res.send(401, { error: 'Unauthorized.' });
			return;
		}

		void next();
	};
};

// Deletes a stored browser cookie by setting it's contents to nothing.
export function deleteCookie(res: Response, name: string) {
	res.cookie(name, '', { expires: new Date(0), path: '/' });
}

export const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

// Encrypts session objects to be stored securely.
export function encryptSession(session: Session) {
	const iv = randomBytes(16);
	const cipher = createCipheriv(ENCRYPTION_ALGORITHM, process.env.SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(session)), cipher.final()]);

	return `${encrypted.toString('hex')}.${iv.toString('hex')}`;
}

export function decryptSession(encrypted: string) {
	const [data, iv] = encrypted.split('.');
	const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, process.env.SECRET_KEY, Buffer.from(iv, 'hex'));

	let decrypted = decipher.update(Buffer.from(data, 'hex'));
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	try {
		const session = JSON.parse(decrypted.toString()) as Session;
		return session.expires >= Date.now() ? session : null;
	} catch {
		return null;
	}
}
