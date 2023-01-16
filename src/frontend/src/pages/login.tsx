import FormBox from '@/components/FormBox';
import { fetchAPI, saveUserState, setUser, useUser, type LoginData, type UserData } from '@/util/util';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function LoginPage() {
	const user = useUser();
	const router = useRouter();
	const setCurrentUser = setUser();
	const toast = useToast();

	useEffect(() => {
		if (user && router.isReady) {
			void router.push('/');
		}
	});

	const handleLogin = async (data: LoginData) => {
		try {
			const loginData = await fetchAPI<UserData>('/auth/login', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			setCurrentUser(loginData);
			saveUserState(loginData);

			toast({
				title: 'Success!',
				description: 'You have been logged in.',
				status: 'success',
				position: 'top',
				isClosable: true
			});

			void router.push('/');
		} catch (e) {
			toast({
				title: 'Unable to log in.',
				description: 'Your username or password were incorrect.',
				status: 'error',
				position: 'top',
				isClosable: true
			});

			console.log((e as Error).stack);
		}
	};

	return (<FormBox onSubmit={handleLogin} title="Login" />);
}
