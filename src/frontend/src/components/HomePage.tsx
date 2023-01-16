import { useUser } from '@/util/util';
import { Box, Heading, Link, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

const ActionItems = [
	{ name: 'View My Tickets', path: '/tickets' },
	{ name: 'Book Tickets', path: '/games' }
];

function ActionItem({ href, text }: { href: string; text: string }) {
	return (
		<NextLink href={href} passHref>
			<Link>
				<Box
					as="button"
					width="500px"
					p={6}
					bgColor="blue.400"
					transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
					_hover={{ bgColor: 'blue.300' }}
					rounded="xl"
				>
					<Text fontSize="xl" fontWeight="bold">
						{text}
					</Text>
				</Box>
			</Link>
		</NextLink>
	);
}

export default function HomePage() {
	const user = useUser();

	return (
		<VStack spacing={20}>
			<VStack spacing={10}>
				<Heading size="4xl">{`Welcome, ${user.username}!`}</Heading>
				<Heading size="md">Here, you can view and purchase tickets for upcoming matches in the 2026 FIFA World Cup™!</Heading>
			</VStack>
			<VStack spacing={6}>
				{ActionItems.map((item) => (
					<ActionItem key={item.name} text={item.name} href={item.path} />
				))}
			</VStack>
		</VStack>
	);
}
