import * as colorette from 'colorette';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Country, Game } from '#util/structures';

export function log(text: any, type: 'log' | 'error' = 'log') {
	text = type === 'error' ? text?.stack ?? text : text;

	console[type](colorette.bold(colorette[type === 'error' ? 'red' : 'green'](text)));
}

export interface User {
	id: number;
	username: string;
	password: string;
}

/*
See games.txt

The information in this text file follows the following format:

# Country Name
~ City, State/Province
@ Venue
- Team 1, Team 2
$ Price per ticket

In order to parse this data into a class/object we will read the file
with Node.js's File system API, which is similar to Java's Files API.
The data string is split per country and iterated through with a for loop.
We then use a Regular Expression to extract each type of information stored
using the format above.

We used the extracted data to create instances of the Game and Country classes,
in order to represent the data.
*/

const GAMES_PATH = join(__dirname, '..', '..', 'games.txt');
const PARSING_REGEX = /(?:~\s)(.*),\s(.*)\n(?:@\s)(.*)\n(?:-\s)(.*),\s(.*)\n(?:\$\s)(.*)/gmi;

export async function parseGames() {
	const data = await readFile(GAMES_PATH, { encoding: 'utf8' });
	const [, ...groups] = data.split('# ');

	const final = [];

	for (const group of groups) {
		const matches = group.matchAll(PARSING_REGEX);

		const countryName = group.slice(0, group.indexOf('\n'));

		const games: Game[] = [];

		for (const match of matches) {
			const [, city, state, venue, team1, team2, price] = match;
			games.push(new Game(city, state, venue, [team1, team2], price, countryName));
		}

		const country = new Country(countryName, games);

		final.push(country);
	}

	return final;
}
