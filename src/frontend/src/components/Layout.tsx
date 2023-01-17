import { Center } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/Body.module.css';

const NavBar = dynamic(() => import('./NavBar'), { ssr: false });

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<NavBar />
			<Center className={styles.centerBody} bg="blue.200" minH="calc(100vh - 4rem)">
				{children}
			</Center>
		</>
	);
}
