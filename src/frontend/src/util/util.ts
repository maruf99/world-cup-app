import constate from 'constate';
import { useState } from 'react';
import type { Ticket } from './queries';

const STORAGE_KEY = 'user_data';

export interface LoginData {
	username: string;
	password: string;
}

export interface UserData {
	id?: number;
	username: string;
	expires: number;
}

export interface GameData {
	name: string;
	games: {
		id: string;
		city: string;
		state: string;
		venue: string;
		teams: string[];
		price: number;
		country: string;
	}[];
}

export interface ErrorData {
	headers: Headers;
	ok: boolean;
	redirected: boolean;
	status: number;
	statusText: string;
	type: ResponseType;
	url: string;
}

export class APIError extends Error {
	public constructor(message: string, data: ErrorData) {
		super(message);
		Object.assign(this, data);
	}
}

export type Game = GameData['games'][number];

export function findGame(data: GameData[], target: string): Game {
	let countryIndex = -1;
	let gameIndex = -1;

	for (const country of data) {
		// In order to use Binary Search, the array must already be sorted from 'low' to 'high'.
		// In this case, alphabetically, because we are using these algorithms for sorting an
		// array of objects by one of their string properties, rather than the base use case of
		// sorting an array of numbers. The quickSort() and binarySearch() functions, defined
		// below this function, are used for this.
		quickSort(country.games, 0, country.games.length - 1);

		gameIndex = binarySearch(country.games, target);

		if (gameIndex > -1) {
			countryIndex = data.indexOf(country);
			break;
		}
	}

	return gameIndex === -1 ? null : data[countryIndex].games[gameIndex];
}

function binarySearch(list: GameData['games'], target: string) {
	let start = 0;
	let end = list.length - 1;

	while (start <= end) {
		// We need to use Math.floor here, as dividng by an integer
		// in JavaScript keeps the decimal point, unlike in Java.
		const mid = Math.floor((start + end) / 2);

		const current = list[mid].id;

		if (current === target) {
			return mid;
		} else if (current > target) {
			end = mid - 1;
		} else if (current < target) {
			start = mid + 1;
		}
	}

	return -1;
}

function quickSort(list: GameData['games'], low: number, high: number) {
	if (low < high) {
		const partitioned = partition(list, low, high);

		quickSort(list, low, partitioned - 1);
		quickSort(list, partitioned + 1, high);
	}
}

function partition(list: GameData['games'], low: number, high: number) {
	const pivot = list[high].city.toLowerCase();

	let i = low - 1;

	for (let j = low; j <= high - 1; j++) {
		if (list[j].city.toLowerCase().localeCompare(pivot, 'en') === -1) {
			i++;
			swap(list, i, j);
		}
	}

	swap(list, i + 1, high);

	return i + 1;
}

function swap(list: any[], i: number, j: number) {
	const temp = list[i];
	list[i] = list[j];
	list[j] = temp;
}

export function calcPrice(seats: any[], game: Game) {
	return `$${seats.length * game.price}.00`;
}

export function getCountryFlag(name: string) {
	return `/assets/countries/${name.replaceAll(' ', '-').toLowerCase()}.svg`;
}

export const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

export enum SeatType {
	None = 0,
	Empty = 1,
	Selected = 2,
	Reserved = 3
}

export type Seats = Record<string, SeatType[]>;

export function generateSeats(tickets: Ticket[]): Seats {
	const seats: Record<string, number[]> = {};

	for (const row of rows) {
		seats[row] = Array.from({ length: 20 });

		for (let i = 0; i < 20; i++) {
			if (checkSeat(tickets, row, i)) {
				seats[row][i] = SeatType.Reserved;
			} else {
				switch (row) {
					case rows[0]:
					case rows[1]:
					case rows[rows.length - 2]:
					case rows[rows.length - 1]:
						seats[row][i] = SeatType.Empty;
						break;
					default:
						if (i < 4 || i > 15) {
							seats[row][i] = SeatType.Empty;
						} else {
							seats[row][i] = SeatType.None;
						}
	
						break;
				}
			}
		}
	}

	console.log('generated', seats);

	return seats;
}

function checkSeat(tickets: Ticket[], row: string, column: number) {
	if (tickets) {
		for (const ticket of tickets) {
			if (ticket.row === row && ticket.column === column) {
				return true;
			}
		}
	}

	return false;
}

export async function fetchAPI<T>(path: string, options: RequestInit = {}) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			...options.headers,
			'Content-Type': 'application/json'
		}
	});

	const json = await res.json();

	if (json.error) {
		throw new APIError(json.error, {
			headers: res.headers,
			ok: res.ok,
			redirected: res.redirected,
			status: res.status,
			statusText: res.statusText,
			type: res.type,
			url: res.url
		});
	} else {
		return json as T;
	}
}

export function getUserState(): UserData {
	if (typeof window !== 'undefined') {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : null;
	}

	return null;
}

export function saveUserState(data: UserData) {
	try {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		}
	} catch {}

	return data;
}

export function clearUserState() {
	if (typeof window !== 'undefined') {
		localStorage?.removeItem(STORAGE_KEY);
	}
}

const state = getUserState();

const useUserState = () => {
	const [user, setUser] = useState<UserData>(state ?? null);

	return { user, setUser };
};

export const [UserProvider, useUser, setUser] = constate(
	useUserState,
	(value) => value.user,
	(value) => value.setUser
);

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function wait(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
