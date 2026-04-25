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
			'xs': '475px',
			'2xl': '1400px'
		}
		},
		extend: {
			screens: {
				'xs': '475px',
			},
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
				// Legacy beach-palette gold (referenced via hsl(var(--gold)) in some files)
				goldHsl: 'hsl(var(--gold))',
				// NeoMe design system tokens (handoff-2 adoption — 2026-04-25)
				pillar: {
					telo:   { DEFAULT: '#C1856A', 100: '#EAD5C7', 300: '#D5AC95', 500: '#C1856A', 700: '#9C6148' },
					strava: { DEFAULT: '#8B9E88', 100: '#D8DFD7', 300: '#B2BFB0', 500: '#8B9E88', 700: '#6B7C68' },
					mysel:  { DEFAULT: '#A395AC', 100: '#E0D9E3', 300: '#C3B7CB', 500: '#A395AC', 700: '#7C6D88' },
					cyklus: { DEFAULT: '#B08A9A', 100: '#E8D8DF', 300: '#CFB0BC', 500: '#B08A9A', 700: '#8A6775' },
					myselCool: '#89B0BC',
				},
				cream: {
					DEFAULT: '#F8F5F0',
					50:  '#FBF9F5',
					100: '#F8F5F0',
					200: '#F1ECE3',
					300: '#EAE3D6',
					// Screen aliases used in handoff-2 (cream-2 == cream-200)
					'2': '#F1ECE3',
				},
				// Pillar accent aliases used directly in screens
				terra:  '#C1856A',  // alias for pillar-telo
				rose:   '#B08A9A',  // alias for pillar-cyklus
				mauve:  '#A395AC',  // alias for pillar-mysel
				// Hair = the standard 8% ink border
				hair:   'rgba(61, 41, 33, 0.08)',
				// Foreground tone shorthand used in screens (text-fg-3 / text-fg / text-fg-muted)
				fg: {
					DEFAULT: '#3D2921',
					'2':     'rgba(61, 41, 33, 0.72)',
					'3':     'rgba(61, 41, 33, 0.56)',
					muted:   'rgba(61, 41, 33, 0.40)',
				},
				ink: {
					DEFAULT: '#3D2921',
					500: '#8B6959',
					700: '#5F3E31',
				},
				gold: {
					DEFAULT: '#B8965A',
					100: '#EEDFC2',
				},
				sandy: '#D4C4B0',
				success: '#6B8C5F',
				danger: '#B5544A',
				// Legacy NeoMe brand tokens (kept for any prior callsites)
				neome: {
					primary: '#5F3E31',
					bg: '#F6F6F1',
					peach: '#F5D5C8',
					blush: '#F2C6C2',
					sage: '#C5D5C0',
					lavender: '#D5C8E0',
					card: '#FFFFFF',
				}
			},
			fontFamily: {
				// NeoMe (handoff-2): Gilda Display + DM Sans
				'serif':   ['Gilda Display', 'Didot', 'Bodoni 72', 'Georgia', 'serif'],
				'sans':    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
				'display': ['Gilda Display', 'Didot', 'Bodoni 72', 'Georgia', 'serif'],
				'body':    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
				// Legacy alias kept so any prior `font-lufga` references compile.
				'lufga':   ['DM Sans', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				// NeoMe type scale (handoff-2)
				'display': ['42px', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
				'hero':    ['34px', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
				'h1':      ['28px', { lineHeight: '1.15' }],
				'h2':      ['22px', { lineHeight: '1.15' }],
				'h3':      ['18px', { lineHeight: '1.45' }],
				'lg':      ['17px', { lineHeight: '1.55' }],
				'md':      ['15px', { lineHeight: '1.55' }],
				'sm':      ['13px', { lineHeight: '1.45' }],
				'xs':      ['11px', { lineHeight: '1.45', letterSpacing: '0.24em' }],
				// Legacy mobile-* scale kept (66 callsites still use these — migrate later)
				'mobile-xs': ['12px', { lineHeight: '18px', letterSpacing: '0.01em' }],
				'mobile-sm': ['14px', { lineHeight: '21px', letterSpacing: '0.01em' }],
				'mobile-base': ['16px', { lineHeight: '24px', letterSpacing: '0.01em' }],
				'mobile-lg': ['18px', { lineHeight: '28px', letterSpacing: '0.01em' }],
				'mobile-xl': ['20px', { lineHeight: '30px', letterSpacing: '0.01em' }],
				'mobile-2xl': ['24px', { lineHeight: '32px', letterSpacing: '0.01em' }],
				'mobile-3xl': ['28px', { lineHeight: '36px', letterSpacing: '0.01em' }],
			},
			letterSpacing: {
				'eyebrow': '0.24em',
				'display': '-0.015em',
				'hero':    '-0.01em',
			},
			spacing: {
				// NeoMe button heights (handoff-2 pill sizes use h-13)
				'13': '3.25rem', // 52px
			},
			transitionTimingFunction: {
				'nm':     'cubic-bezier(0.16, 1, 0.3, 1)',
				'nm-std': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-improve': 'var(--gradient-improve)',
				'gradient-widget': 'var(--gradient-widget)'
			},
			boxShadow: {
				'neome': '0 4px 20px rgba(95, 62, 49, 0.08)',
				'neome-lg': '0 8px 32px rgba(95, 62, 49, 0.12)',
				// NeoMe (handoff-2)
				'nm-xs': '0 1px 2px rgba(61, 41, 33, 0.04)',
				'nm-sm': '0 2px 8px rgba(61, 41, 33, 0.05)',
				'nm-md': '0 6px 24px rgba(61, 41, 33, 0.06)',
				'nm-lg': '0 20px 60px rgba(61, 41, 33, 0.10)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// NeoMe (handoff-2)
				'card':  '20px',
				'hero':  '28px',
				'sheet': '24px',
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
