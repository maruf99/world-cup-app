import ErrorText from '@/components/ErrorText';
import Loading from '@/components/Loading';
import TicketDisplay from '@/components/TicketDisplay';
import { useQueryUserTickets } from '@/util/queries';
import { useUser } from '@/util/util';
import { Heading, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

export default function TicketsPage() {
	const user = useUser();

	const { isLoading, error, data: tickets } = useQueryUserTickets(user?.username, Boolean(user));

	return (
		<Layout>
			{error ? (
				<ErrorText />
			) : isLoading ? (
				<Loading color="white" />
			) : (
				<VStack spacing={10} p={6}>
					<VStack spacing={6}>
						<Heading size="2xl">Your Tickets</Heading>
						<Heading size="md">Here, you can view and manage your tickets.</Heading>
                        {tickets && <TicketDisplay tickets={tickets} />}
					</VStack>
				</VStack>
			)}
		</Layout>
	);
}
