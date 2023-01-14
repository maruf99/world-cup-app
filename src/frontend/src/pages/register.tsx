import type { LoginData, UserData } from '@/util/interfaces';
import FormBox from '@/components/FormBox';
import { fetchAPI, saveUserState, setUser } from '@/util/util';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

export default function LoginPage() {
	const setCurrentUser = setUser();
	const router = useRouter();
	const toast = useToast();

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
