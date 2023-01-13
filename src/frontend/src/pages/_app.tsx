import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import { UserProvider } from '@/util/util';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>World Cup 2026</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
				<link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />

				<meta name="theme-color" content="#f2b139" />
				<meta name="og:site_name" content="World Cup 2026" />
				<meta property="og:title" content="World Cup App" />
				<meta property="og:description" content="Application to book tickets for World Cup 2026" />
				<meta property="og:type" content="website" />
			</Head>
			<UserProvider>
				<ChakraProvider>
					<Component {...pageProps} />
				</ChakraProvider>
			</UserProvider>
		</>
	);
}
