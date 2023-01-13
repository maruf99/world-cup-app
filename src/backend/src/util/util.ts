import * as colorette from 'colorette';

export function log(text: any, type: 'log' | 'error' = 'log') {
	text = type === 'error' ? text?.stack ?? text : text;

	console[type](colorette.bold(colorette[type === 'error' ? 'red' : 'green'](text)));
}

export interface User {
	id: number;
	username: string;
	password: string;
}
