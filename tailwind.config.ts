import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				widget: {
					bg: 'hsl(var(--widget-bg))',
					card: 'hsl(var(--widget-card))',
					border: 'hsl(var(--widget-border))',
					text: 'hsl(var(--widget-text))',
					'text-soft': 'hsl(var(--widget-text-soft))',
					muted: 'hsl(var(--widget-muted))'
				},
				reflection: {
					bg: 'hsl(var(--reflection-bg))',
					card: 'hsl(var(--reflection-card))',
					success: 'hsl(var(--reflection-success))',
					improve: 'hsl(var(--reflection-improve))',
					accent: 'hsl(var(--reflection-accent))',
					muted: 'hsl(var(--reflection-muted))',
					text: 'hsl(var(--reflection-text))',
					'text-soft': 'hsl(var(--reflection-text-soft))',
					border: 'hsl(var(--reflection-border))'
				},
				// Beach/green tokens
				sand: 'hsl(var(--sand))',
				shell: 'hsl(var(--shell))',
				seafoam: 'hsl(var(--seafoam))',
				deepGreen: 'hsl(var(--deep-green))',
				'deepGreen-foreground': 'hsl(var(--deep-green-foreground))',
				glass: 'hsl(var(--glass))',
				chartCenter: 'hsl(var(--chart-center))',
				ctaFrom: 'hsl(var(--cta-from))',
				ctaTo: 'hsl(var(--cta-to))',
				// Palette tokens
				peach: 'hsl(var(--peach))',
				'peach-orange': {
					DEFAULT: 'hsl(var(--peach-orange))',
					foreground: 'hsl(var(--peach-orange-foreground))'
				},
				blush: 'hsl(var(--blush))',
				lavender: 'hsl(var(--lavender))',
				mint: 'hsl(var(--mint))',
				gold: 'hsl(var(--gold))'
			},
			fontFamily: {
				'heading': ['Lexend Deca', 'sans-serif'],
				'body': ['Open Sans', 'sans-serif'],
			},
			fontSize: {
				'mobile-xs': ['15px', { lineHeight: '20px' }],
				'mobile-sm': ['17.5px', { lineHeight: '24px' }],
				'mobile-base': ['20px', { lineHeight: '28px' }],
				'mobile-lg': ['22.5px', { lineHeight: '32px' }],
				'mobile-xl': ['25px', { lineHeight: '36px' }],
				'mobile-2xl': ['30px', { lineHeight: '40px' }],
			},
			backgroundImage: {
				'gradient-success': 'var(--gradient-success)',
				'gradient-improve': 'var(--gradient-improve)',
				'gradient-widget': 'var(--gradient-widget)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
