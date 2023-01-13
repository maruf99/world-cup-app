declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'production' | 'development';

		PORT: `${number}`;

		SECRET_KEY: string;

		WEB_URL: string;
	}
}
