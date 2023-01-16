module.exports = {
	apps: [
		{
			name: 'api',
			cwd: './src/backend',
			script: 'npm',
			args: 'run start'
		},
		{
			name: 'site',
			cwd: './src/frontend',
			script: 'npm',
			args: 'run start'
		}
	]
};