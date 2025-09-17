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
				'heading': ['Alegreya Sans', 'sans-serif'],
				'body': ['Alegreya Sans', 'sans-serif'],
			},
			fontSize: {
				// Optimized for readability - minimum 16px for body text on mobile
				'mobile-xs': ['12px', { lineHeight: '18px', letterSpacing: '0.01em' }], // Labels, captions
				'mobile-sm': ['14px', { lineHeight: '21px', letterSpacing: '0.01em' }], // Small text, metadata
				'mobile-base': ['16px', { lineHeight: '24px', letterSpacing: '0.01em' }], // Body text (minimum readable size)
				'mobile-lg': ['18px', { lineHeight: '28px', letterSpacing: '0.01em' }], // Subheadings
				'mobile-xl': ['20px', { lineHeight: '30px', letterSpacing: '0.01em' }], // Section headings
				'mobile-2xl': ['24px', { lineHeight: '32px', letterSpacing: '0.01em' }], // Page titles
				'mobile-3xl': ['28px', { lineHeight: '36px', letterSpacing: '0.01em' }], // Hero headings
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
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
