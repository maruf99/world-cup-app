import constate from 'constate';
import { useState } from 'react';
import type { UserData } from './interfaces';

const STORAGE_KEY = 'user_data';

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

export async function fetchAPI<T>(path: string, options: RequestInit = {}) {
	console.log(process.env.NEXT_PUBLIC_API_URL);

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
export const wait = (ms: number) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});