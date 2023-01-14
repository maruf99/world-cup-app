import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import { clearUserState, setUser, useUser } from '@/util/util';
import { Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
	const user = useUser();
	const setCurrentUser = setUser();
	const router = useRouter();

	useEffect(() => {
		if (Date.now() >= user?.expires) {
			clearUserState();
			setCurrentUser(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (!user) {
			void router.push('/login');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<Layout>
			{user ? (
				<Heading as="h1" color="white">
					{`Welcome ${user.username}`}
				</Heading>
			) : (
				<Loading color="white"/>
			)}
		</Layout>
	);
}
