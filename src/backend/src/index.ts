// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config();

import 'reflect-metadata';

import type { Route } from '#util/http';
import { extensions, Methods } from '#util/http';
import { log, parseGames } from '#util/util';
import { auth, checkAuth } from '#util/auth';

import { json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { join } from 'node:path';
import type { Middleware } from 'polka';
import polka from 'polka';
import readdirp from 'readdirp';
import { container } from 'tsyringe';
import { STATUS_CODES } from 'node:http';
import Database from 'better-sqlite3';

const sql = new Database(join(__dirname, '..', 'database', 'database.sqlite'));

sql.pragma('journal_mode = WAL');

sql.prepare(
	`CREATE TABLE IF NOT EXISTS users(
	id INTEGER PRIMARY KEY NOT NULL,
	username TEXT NOT NULL,
	password TEXT NOT NULL
	)`
).run();

sql.prepare(
	`CREATE TABLE IF NOT EXISTS tickets(
	id INTEGER PRIMARY KEY NOT NULL,
	owner TEXT NOT NULL,
	created INTEGER NOT NULL,
	row TEXT NOT NULL,
	column INTEGER NOT NULL,
	price REAL NOT NULL,
	country TEXT NOT NULL,
	city TEXT NOT NULL,
	game_id TEXT NOT NULL,
	state TEXT NOT NULL,
	venue TEXT NOT NULL
	)`
).run();

container.register('sql', { useValue: sql });

const app = polka({
	onError(err, _, res) {
		res.setHeader('Content-Type', 'application/json');

		log(err, 'error');

		if (typeof err === 'string' || Buffer.isBuffer(err)) {
			res.end(JSON.stringify({ error: err.toString() }));
		} else {
			res.end(JSON.stringify({ error: err.message ?? STATUS_CODES[err.code ?? err.status ?? 500] }));
		}
	},
	onNoMatch(_, res) {
		res.setHeader('Content-Type', 'application/json');
		res.statusCode = 404;
		res.end(JSON.stringify({ error: 'Not found.' }));
	}
});

app.use(cors({ origin: process.env.WEB_URL, credentials: true }));
app.use(helmet() as Middleware);
app.use(json());
app.use(extensions);
app.use(auth);

const METHODS = [Methods.Get, Methods.Post, Methods.Patch, Methods.Delete];

const routes = readdirp(join(__dirname, 'routes'), { fileFilter: '*.js' });

async function init() {
	const loaded = [];

	const gameData = await parseGames();

	container.register('gameData', { useValue: gameData });

	for await (const file of routes) {
		let routePath = file.path
			.replace(/.js$/g, '')
			.replace(/\[([a-zA-Z]+)\]/g, ':$1')
			.replace(/\\/g, '/')
			.replace(/\/index/g, '');

		routePath = routePath.startsWith('/') ? routePath : `/${routePath}`;

		loaded.push(routePath);

		const route = container.resolve<Route>((await import(file.fullPath)).default);

		for (const method of METHODS) {
			if (method in route) {
				app[method](routePath, checkAuth(route), route[method].bind(route));
			}
		}
	}

	log(`Loaded ${loaded.length} routes:\n\n${loaded.join('\n')}`);
}

void init().catch((e) => log(e, 'error'));

app.listen(Number(process.env.PORT), () => {
	log(`Listening on port ${process.env.PORT}`);
});
