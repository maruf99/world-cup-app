import { type GameData, generateSeats, getCountryFlag, findGame, SeatType, type Game } from '@/util/util';
import { Box, HStack, Text, VStack, Heading, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Seat from '@/components/Seat';
import Loading from '@/components/Loading';
import PurchaseButton from '@/components/PurchaseButton';
import { useQueryGameTickets } from '@/util/queries';

function Country({ name }: { name: string }) {
	return (
		<HStack>
			<Image width={10} src={getCountryFlag(name)} />
			<Heading size="xl">{name}</Heading>
		</HStack>
	);
}

export default function SeatDisplay({ data }: { data: GameData[] }) {
	const router = useRouter();

	const [game, setGame] = useState<Game>(null);

	useEffect(() => {
		if (router.isReady) {
			const found = findGame(data, router.query.id as string);
			setGame(found);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady]);

	const { isLoading, error, data: tickets } = useQueryGameTickets(game?.id, Boolean(game));

	const [seats, setSeats] = useState(generateSeats(tickets));

	useEffect(() => {
		if (router.isReady) {
			setSeats(generateSeats(tickets));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, tickets]);

	const seatRows = [];

	const handleSelect = (type: SeatType, row: string, index: number) => {
		switch (type) {
			case SeatType.Empty:
				seats[row][index] = SeatType.Selected;
				break;
			case SeatType.Selected:
				seats[row][index] = SeatType.Empty;
				break;
		}

		setSeats({ ...seats });
	};

	for (const [row, col] of Object.entries(seats)) {
		const seatRow = [];

		for (const [index, type] of col.entries()) {
			seatRow.push(
				<HStack spacing={3}>
					{index === 0 ? (
						<Box w={5}>
							<Text size="md" fontWeight="bold" userSelect="none">
								{row}
							</Text>
						</Box>
					) : null}
					<Seat type={type} text={type === SeatType.None ? null : `${index + 1}`} onClick={() => handleSelect(type, row, index)} />
				</HStack>
			);
		}

		seatRows.push(seatRow);
	}

	if (isLoading) {
		return <Loading color="white" />;
	}

	if (error) {
		return <Heading size="4xl">An error occurred.</Heading>;
	}

	return game ? (
		<Box>
			<VStack spacing={10}>
				<VStack spacing={3}>
					<HStack spacing={3}>
						<Country name={game.teams[0]} />
						<Heading size="xl">vs.</Heading>
						<Country name={game.teams[1]} />
					</HStack>
					<Heading size="sm" color="gray.700">
						{game.venue}
					</Heading>
					<Heading size="sm" color="gray.700">
						{game.city}, {game.state}
					</Heading>
				</VStack>
				<VStack spacing={4}>
					{seatRows.map((x, i) => (
						<HStack key={i} spacing={3}>
							{x}
						</HStack>
					))}
				</VStack>
				<PurchaseButton seats={seats} game={game} />
			</VStack>
			<Text fontSize="4xl" fontWeight="bold" textAlign="center" position="absolute" top="52.3%" left="47.8%" zIndex={999}>
				Field
			</Text>
		</Box>
	) : (
		<Loading color="white" />
	);
}
