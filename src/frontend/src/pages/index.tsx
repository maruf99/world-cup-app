import HomePage from '@/components/HomePage';
import Loading from '@/components/Loading';
import { clearUserState, setUser, useUser } from '@/util/util';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

export default function Home() {
	// React hook that retrieves the user session from local storage.
	const user = useUser();
	const setCurrentUser = setUser();
	const router = useRouter();

	// If the user session is expired, require them to login again.
	useEffect(() => {
		if (Date.now() >= user?.expires) {
			clearUserState();
			setCurrentUser(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);
	
	// If the user is not logged in, redirect them to the login page
	useEffect(() => {
		if (!user) {
			void router.push('/login');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<Layout>
			{user ? <HomePage /> : <Loading color="white"/>}
		</Layout>
	);
}
