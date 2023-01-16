import { type Ticket, useMutationDeleteTicket } from '@/util/queries';
import {
	Box,
	Button,
	Grid,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToast,
	VStack
} from '@chakra-ui/react';
import { Fragment, type MouseEventHandler } from 'react';

export default function TicketDisplay({ tickets }: { tickets: Ticket[] }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const { isLoading, mutateAsync } = useMutationDeleteTicket();

	const handleDelete = async (ticket: Ticket) => {
		await mutateAsync(
			{ id: ticket.id, user: ticket.owner },
			{
				onSuccess: () => {
					toast({
						title: 'Success',
						description: `Cancelled the ticket for ${ticket.venue}, at seat ${ticket.row}${ticket.column}`,
						status: 'success',
						position: 'top',
						isClosable: true
					});
				}
			}
		);

        onClose();
	};

	return (
		<Grid templateColumns={`repeat(${useBreakpointValue({ base: 1, md: 2 })}, 1fr)`} gap={6}>
			{tickets.map((ticket) => {
				return (
					<Fragment key={ticket.id}>
						<Box width="300px" height="250px" p={6} rounded="xl" bgColor="blue.300" boxShadow="md">
							<VStack spacing={1} alignItems="start">
								<Text fontSize="xl" fontWeight="bold">
									{ticket.match}
								</Text>
								<Text fontSize="sm" fontWeight="bold">
									Venue: {ticket.venue}
								</Text>
								<Text fontSize="sm" fontWeight="bold">
									{ticket.city}, {ticket.state}
								</Text>
                                <Text fontSize="sm" fontWeight="bold">
									{ticket.country}
								</Text>
								<Text fontSize="sm" fontWeight="bold">
									Seat Location: {ticket.row}
									{ticket.column}
								</Text>
								<Text fontSize="sm" fontWeight="bold">
									Booked on {new Date(ticket.created).toLocaleString()}
								</Text>
								<Text fontSize="sm" fontWeight="bold">
									Amount Paid: ${ticket.price}.00
								</Text>
								<Button size="sm" colorScheme="red" isLoading={isLoading} alignSelf="center" onClick={onOpen}>
									Cancel
								</Button>
							</VStack>
						</Box>
						<CancelModal isOpen={isOpen} onClose={onClose} isLoading={isLoading} onClick={() => handleDelete(ticket)}/>
					</Fragment>
				);
			})}
		</Grid>
	);
}

function CancelModal({
	isOpen,
	onClose,
	onClick,
	isLoading
}: {
	isOpen: boolean;
	onClose: () => void;
	onClick: MouseEventHandler<HTMLButtonElement>;
	isLoading: boolean;
}) {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="3xl" fontWeight="bold">
					Cancel Ticket
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>Are you sure you want to cancel this ticket?</ModalBody>

				<ModalFooter>
					<Button colorScheme="blue" _hover={{ bgColor: 'gray.300' }} variant="outline" mr={3} onClick={onClose}>
						Don't Cancel
					</Button>
					<Button colorScheme="red" onClick={onClick} isLoading={isLoading}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
