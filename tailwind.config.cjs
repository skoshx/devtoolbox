module.exports = {
  mode: 'jit',
	purge: ['./src/**/*.html', './src/**/*.svelte', './src/**/*.ts', './src/**/*.js'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			boxShadow: {
				'xl-center': '0 0 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
