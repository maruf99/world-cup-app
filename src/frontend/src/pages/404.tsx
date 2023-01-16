import Layout from '@/components/Layout';
import { Heading, VStack } from '@chakra-ui/react';

export default function NotFoundPage() {
	return (
		<Layout>
			<VStack spacing={6}>
				<Heading size="4xl">404</Heading>
				<Heading size="lg">This page wasn't found.</Heading>
			</VStack>
		</Layout>
	);
}
