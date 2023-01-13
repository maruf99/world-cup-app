import type { LoginData } from '@/util/interfaces';
import { Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Image, Input, Stack, Text } from '@chakra-ui/react';
import type { FieldInputProps, FormikState } from 'formik';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';

const validator = (field: string) => {
	const text = `${field} must be between 5 and 20 characters`;
	return yup.string().min(5, text).max(20, text).required(`${field} is required.`);
};

const LoginSchema = yup.object().shape({
	username: validator('Username'),
	password: validator('Password')
});

export default function FormBox({
	title,
	onSubmit
}: {
	title: string;
	onSubmit: (data: LoginData) => void;
}) {
	return (
		<Center bg="blue.200" h="100vh">
			<Stack bg="whiteAlpha.900" boxShadow="md" minWidth="500" p="20" paddingTop="10" rounded="lg">
				<Image marginBottom="2" maxWidth="100px" mx="auto" src="/world-cup-logo.svg" />

				<Heading as="h1">{title}</Heading>

				<Formik
					initialValues={{ username: '', password: '' }}
					onSubmit={(data, { setSubmitting }) => {
						setTimeout(() => {
							onSubmit(data);
							setSubmitting(false);
						}, 1000);
					}}
					validationSchema={LoginSchema}
				>
					{({ isSubmitting }) => (
						<Form>
							<Stack my="4" spacing="6">
								<Field name="username">
									{({ field, form }: { field: FieldInputProps<string>; form: FormikState<LoginData> }) => (
										<FormControl isInvalid={form.errors.username && form.touched.username}>
											<FormLabel>Username</FormLabel>
											<Input {...field} />
											<FormErrorMessage>{form.errors.username}</FormErrorMessage>
										</FormControl>
									)}
								</Field>

								<Field name="password">
									{({ field, form }: { field: FieldInputProps<string>; form: FormikState<LoginData> }) => (
										<FormControl isInvalid={form.errors.password && form.touched.password}>
											<FormLabel>Password</FormLabel>
											<Input {...field} />
											<FormErrorMessage>{form.errors.password}</FormErrorMessage>
										</FormControl>
									)}
								</Field>
								<Button colorScheme="blue" isLoading={isSubmitting} mt={4} size="lg" type="submit">
									{title}
								</Button>
							</Stack>
						</Form>
					)}
				</Formik>

				<Stack color="gray.600" justify="center" spacing="3">
					<Text as="div" textAlign="center">
						<span>{title === 'Login' ? "Don't have an account? " : 'Already have an account?'}</span>
						<Button colorScheme="blue" variant="link">
							{title === 'Login' ? 'Register' : 'Login'}
						</Button>
					</Text>
				</Stack>
			</Stack>
		</Center>
	);
}
