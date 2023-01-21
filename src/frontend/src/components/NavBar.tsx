import { CloseIcon, HamburgerIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, IconButton, Image, Link, Stack, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import styles from '@/styles/NavBar.module.css';
import { clearUserState, fetchAPI, setUser, useUser } from '@/util/util';
import { useRouter } from 'next/router';
import type { MouseEventHandler } from 'react';

// Data for items on the navigation bar.
const NavPages = [
	{ name: 'Home', path: '/' },
	{ name: 'My Tickets', path: '/tickets' },
	{ name: 'Book Tickets', path: '/games' },
	{ name: 'Contact', path: '/contact' }
];

function NavTab({ page }: { page: { name: string; path: string } }) {
	return (
		<NextLink href={page.path}>
			<Link
				px={2}
				py={3}
				rounded="md"
				_hover={{
					textDecoration: 'none',
					bg: 'blue.300'
				}}
			>
				{page.name}
			</Link>
		</NextLink>
	);
}

export default function NavBar() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const user = useUser();
	const setCurrentUser = setUser();
	const router = useRouter();

	// Request the API to logout the user when they press the logout button,
	// and delete the user session from local storage.
	const handleLogout: MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault();

		await fetchAPI('/auth/logout', { method: 'POST' });

		clearUserState();
		setCurrentUser(null);

		void router.push('/login');
	};

	return (
		<Box bg="blue.100" shadow="sm" px={4} className={styles.navBar}>
			<Flex h={16} alignItems="center" justifyContent="space-between">
				<IconButton
					size="md"
					icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
					aria-label="Open Menu"
					display={{ md: 'none' }}
					onClick={isOpen ? onClose : onOpen}
				/>

				<HStack spacing={8} alignItems="center">
					<Box>
						<Image h={12} src={useBreakpointValue({ base: '/icon.svg', md: '/logo.svg' })} />
					</Box>
					<HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
						{NavPages.map((page) => (
							<NavTab key={page.name} page={page} />
						))}
					</HStack>
				</HStack>

				{user ? (
					<Flex alignItems="center">
						<Button variant="solid" colorScheme="red" size="md" mr={4} rightIcon={<ArrowForwardIcon />} onClick={handleLogout}>
							Log Out
						</Button>
					</Flex>
				) : null}
			</Flex>

			{isOpen ? (
				<Box pb={4} display={{ md: 'none' }}>
					<Stack as="nav" spacing={4}>
						{NavPages.map((page) => (
							<NavTab key={page.name} page={page} />
						))}
					</Stack>
				</Box>
			) : null}
		</Box>
	);
}
