/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'bg': '#050505',
				'card': '#0a0a0a',
				'card-background': '#0a0a0a',
				'surface': '#050505',
				primary: {
					DEFAULT: '#ccff00',
					foreground: '#000000'
				},
				'accent-primary': '#ccff00',
				'accent-secondary': '#00ccff',
				'text-muted': '#a1a1aa',
				'text-primary': '#ffffff'
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
