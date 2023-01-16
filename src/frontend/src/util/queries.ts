import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchAPI, type GameData } from "./util";

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
}

export type TicketPayload = Omit<Ticket, 'id' | 'created'>;

export function useQueryGameTickets(city: string, enabled: boolean) {
	return useQuery<Ticket[]>(['tickets', city], () => fetchAPI<Ticket[]>(`/tickets?id=${city}`), { enabled });
}

export function useQueryUserTickets(user: string) {
	return useQuery<Ticket[]>(['tickets', user], () => fetchAPI<Ticket[]>(`/tickets?user=${user}`));
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

	return useMutation<unknown, unknown, { id: number }>(
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