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

	const handleRegister = async (data: LoginData) => {
		try {
			const registerData = await fetchAPI<UserData>('/auth/register', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			setCurrentUser(registerData);
			saveUserState(registerData);

			toast({
				title: 'Success!',
				description: 'You have been successfully registered.',
				status: 'success',
				position: 'top',
				isClosable: true
			});

			void router.push('/');
		} catch (e) {
			toast({
				title: 'Unable to register.',
				description: (e as Error).message,
				status: 'error',
				position: 'top',
				isClosable: true
			});

			console.log((e as Error).stack);
		}
	};

	return (<FormBox onSubmit={handleRegister} title="Register" />);
}
