import { Center } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import NavBar from './NavBar';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<NavBar />
			<Center bg="blue.200" h="100vh">
				{children}
			</Center>
		</>
	);
}
