import { fetchAPI, useUser, wait } from "@/util/util";
import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Image, Input, Stack, Textarea, useToast } from "@chakra-ui/react";
import { Field, type FieldInputProps, Form, Formik, type FormikState } from "formik";
import dynamic from "next/dynamic";
import * as yup from 'yup';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

interface ContactData {
    subject: string;
    message: string;
}

const validator = (field: string, min: number, max: number) => {
	const text = `${field} must be between ${min} and ${max} characters`;
	return yup.string().min(min, text).max(max, text).required(`${field} is required.`);
};

const ContactSchema = yup.object().shape({
	subject: validator('Subject', 4, 20),
	message: validator('Message', 10, 250)
});

export default function Contact() {
    const user = useUser();
    const toast = useToast();

    const handleSubmit = async (data: ContactData & { user: string }) => {
        try {
			await fetchAPI('/contact', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			toast({
				title: 'Success!',
				description: 'Your message has been sent.',
				status: 'success',
				position: 'top',
				isClosable: true
			});
		} catch (e) {
			toast({
				title: 'Unable to log in.',
				description: (e as Error).message,
				status: 'error',
				position: 'top',
				isClosable: true
			});
		}
    };


    return (
		<Layout>
			<Stack bg="whiteAlpha.900" boxShadow="md" minWidth={600} p={20} paddingTop={10} rounded="lg">
				<Image maxWidth="300px" mx="auto" my={5} src="/logo.svg" />

				<Heading size="xl">Contact</Heading>
                <Heading size="sm">Send us a message!</Heading>

				<Formik
					initialValues={{ subject: '', message: '' }}
					onSubmit={async (data, { setSubmitting, resetForm }) => {
						await wait(1000);

						await handleSubmit({ user: user.username, ...data });
						setSubmitting(false);
                        resetForm();
					}}
					validationSchema={ContactSchema}
				>
					{({ isSubmitting }) => (
						<Form>
							<Stack my={4} spacing={6}>
								<Field name="subject">
									{({ field, form }: { field: FieldInputProps<string>; form: FormikState<ContactData> }) => (
										<FormControl isInvalid={form.errors.subject && form.touched.subject}>
											<FormLabel>Subject</FormLabel>
											<Input {...field} />
											<FormErrorMessage>{form.errors.subject}</FormErrorMessage>
										</FormControl>
									)}
								</Field>

								<Field name="message">
									{({ field, form }: { field: FieldInputProps<string>; form: FormikState<ContactData> }) => (
										<FormControl isInvalid={form.errors.message && form.touched.message}>
											<FormLabel>Message</FormLabel>
											<Textarea resize="none" {...field} />
											<FormErrorMessage>{form.errors.message}</FormErrorMessage>
										</FormControl>
									)}
								</Field>
								<Button colorScheme="blue" isLoading={isSubmitting} mt={4} size="lg" type="submit">
									Send
								</Button>
							</Stack>
						</Form>
					)}
				</Formik>
			</Stack>
		</Layout>
	);
}