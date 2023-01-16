import { type TicketPayload, useMutationInsertTickets } from '@/util/queries';
import { type Seats, SeatType, type Game, calcPrice, useUser } from '@/util/util';
import { Button, Heading, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import PurchaseModal from '@/components/PurchaseModal';

type Selected = { row: string; column: number };

export default function PurchaseButton({ seats, game }: { seats: Seats; game: Game }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const user = useUser();
	const toast = useToast();

	const { isLoading, mutateAsync } = useMutationInsertTickets();

    const handlePurchase = async (selected: Selected[], game: Game) => {
		const payloads = selected.map(seat => {
			const payload: TicketPayload = {
				owner: user.username,
				row: seat.row,
				column: seat.column,
				price: game.price,
				country: game.country,
				city: game.city,
				game_id: game.id,
				state: game.state,
				venue: game.venue,
				match: game.teams.join(' vs. ')
			};

			return payload;
		});

		await mutateAsync({ data: payloads }, {
			onSuccess: () => {
				toast({
					title: 'Congratulations!',
					description: `You have just bought ${selected.length} ticket${selected.length > 1 ? 's' : ''}.`,
					status: 'success',
					position: 'top',
					isClosable: true
				});
			}
		});

        onClose();
    };

	const total: Selected[] = [];

	for (const [row, columns] of Object.entries(seats)) {
        for (const [column, seat] of columns.entries()) {
            if (seat === SeatType.Selected) {
                total.push({ row, column });
            }
        }
	}

    const price = calcPrice(total, game);

	return (
		<>
			<VStack spacing={3}>
				<Heading size="md">Total Price: {price}</Heading>
				<Button colorScheme="blue" onClick={onOpen} disabled={total.length < 1}>Purchase</Button>
			</VStack>
            <PurchaseModal isOpen={isOpen} onClose={onClose} amount={total.length} price={price} isLoading={isLoading} onClick={() => handlePurchase(total, game)}/>
		</>
	);
}
