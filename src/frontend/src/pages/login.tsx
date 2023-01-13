import type { LoginData, UserData } from '@/util/interfaces';
import FormBox from '@/components/FormBox';
import { fetchAPI, setUser } from '@/util/util';

export default function LoginPage() {
	const setCurrentUser = setUser();


	const handleLogin = async (data: LoginData) => {
		const loginData = await fetchAPI<UserData>('/login', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	};

	return (<FormBox onSubmit={handleLogin} title="Login" />);
}
