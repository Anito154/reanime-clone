/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				card: '#0a0a0a',
				'card-background': '#0a0a0a',
				primary: {
					DEFAULT: '#aec9e4',
					foreground: '#000000'
				}
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(12px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out forwards',
				'slide-up': 'slide-up 0.5s ease-out forwards'
			}
		}
	},
	plugins: []
};