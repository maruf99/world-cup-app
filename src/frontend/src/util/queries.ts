import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchAPI, type GameData } from "./util";

// Fetches game data from the API backend.
export function useQueryGames() {
	return useQuery<GameData[]>('gameData', () => fetchAPI<GameData[]>('/games'));
}

export interface Ticket {
    id: number;
	owner: string;
	created: number;
	row: string;
	column: number;
	price: number;
	country: string;
	city: string;
	game_id: string;
	state: string;
	venue: string;
	match: string;
}

export type TicketPayload = Omit<Ticket, 'id' | 'created'>;

// Fetches all reserved tickets for a specific game from the API backend, so that the application can display
// and grey these seats out.
export function useQueryGameTickets(city: string, enabled: boolean) {
	return useQuery<Ticket[]>(['tickets', city], () => fetchAPI<Ticket[]>(`/tickets?id=${city}`), { enabled });
}

// Fetches all reserved tickets for a specific user from the API backend, in order to display in the My Tickets
// section.
export function useQueryUserTickets(user: string, enabled: boolean) {
	return useQuery<Ticket[]>(['tickets', user], () => fetchAPI<Ticket[]>(`/tickets?user=${user}`), { enabled });
}


export function useMutationInsertTickets() {
	const client = useQueryClient();

	return useMutation<unknown, unknown, { data: TicketPayload[] }>(
		async (payload) => {
			return fetchAPI('/tickets', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		},
		{
			onSuccess: () => {
				void client.invalidateQueries(['tickets']);
			}
		}
	);
}

export function useMutationDeleteTicket() {
	const client = useQueryClient();

	return useMutation<unknown, unknown, { id: number; user: string }>(
		async (payload) => {
			return fetchAPI(`/tickets`, {
				method: 'DELETE',
				body: JSON.stringify(payload)
			});
		},
		{
			onSuccess: () => {
				void client.invalidateQueries(['tickets']);
			}
		}
	);
}