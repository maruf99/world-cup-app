import type { Middleware, Request, Response, NextHandler } from 'polka';
import type { CookieSerializeOptions } from 'cookie';
import cookie from 'cookie';
import send from '@polka/send';


declare module 'http' {
	export interface ServerResponse {
		append: (header: string, value: any) => void;
		cookie: (name: string, data: string, options?: CookieSerializeOptions) => void;
		send: (code: number, data?: any, headers?: Record<string, string | string[]>) => void;
	}

	export interface IncomingMessage {
		cookies: { [key: string]: string };
	}
}

export enum Methods {
	Get = 'get',
	Post = 'post',
	Patch = 'patch',
	Delete = 'delete'
}

type RouteHandler = (req?: Request, res?: Response, next?: NextHandler) => void;

// Each Route class follows this interface, and can have GET, POST, PATCH, and DELETE methods.
export interface Route {
	// Whether or not the user needs to be authenticated to use this route.
	auth?: boolean;

	[Methods.Get]?: RouteHandler;
	[Methods.Post]?: RouteHandler;
	[Methods.Patch]?: RouteHandler;
	[Methods.Delete]?: RouteHandler;
}

// Adds various helper methods to HTTP request object, such as parsing cookies.
export const extensions: Middleware = (req, res, next) => {
	req.cookies = cookie.parse(req.headers.cookie ?? '');

	res.append = (header, value) => {
		const set = res.getHeader(header);
		res.setHeader(header, set ? (Array.isArray(set) ? set.concat(value) : [set].concat(value)) : value);
	};

	res.cookie = (name, data, options) => {
		res.append('Set-Cookie', cookie.serialize(name, data, options));
	};

	res.send = send.bind(null, res);

	void next();
};