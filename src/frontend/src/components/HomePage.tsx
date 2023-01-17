import { BOX_SHADOW, useUser } from '@/util/util';
import { Box, Heading, HStack, Image, Link, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

const ActionItems = [
	{ name: 'View Your Tickets', path: '/tickets' },
	{ name: 'Book Tickets', path: '/games' },
	{ name: 'Contact Us', path: 'contact' }
];

function ActionItem({ href, text }: { href: string; text: string }) {
	return (
		<NextLink href={href} passHref>
			<Link>
				<Box
					as="button"
					width="500px"
					p={6}
					bgColor="blue.300"
					transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
					_hover={{ bgColor: 'blue.200' }}
					rounded="xl"
					boxShadow={BOX_SHADOW}
				>
					<Text fontSize="2xl" fontWeight="bold">
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
			<VStack spacing={10} bgColor="blue.300" rounded="xl" boxShadow={BOX_SHADOW} p={6}>
				<HStack spacing={4}>
					<Image h="65px" src="/assets/misc/soccer.png" />
					<Heading size="4xl">{`Welcome, ${user.username}!`}</Heading>
					<Image h="65px" src="/assets/misc/soccer.png" />
				</HStack>
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
