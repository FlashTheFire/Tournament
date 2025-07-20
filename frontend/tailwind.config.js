/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic Color Palette
        cosmic: {
          black: '#0a0a0f',
          dark: '#121218',
          deep: '#1a1a26',
          medium: '#2a2a36',
          light: '#3a3a46',
        },
        // Neon Accent Colors
        neon: {
          blue: '#00d4ff',
          purple: '#8b5cf6',
          red: '#ff0080',
          green: '#00ff88',
          yellow: '#ffff00',
        },
        // Electric Colors
        electric: {
          blue: '#0066ff',
          purple: '#6600ff',
          cyan: '#00ffff',
          pink: '#ff00ff',
        },
        // Primary Brand Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Glass Effect Colors
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.08)',
          dark: 'rgba(0, 0, 0, 0.1)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'gaming': ['Orbitron', 'monospace'],
        'display': ['Exo 2', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 212, 255, 0.5)',
        'glow': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.5)',
        'neon': '0 0 5px currentColor, 0 0 20px currentColor, 0 0 35px currentColor',
        'neon-lg': '0 0 10px currentColor, 0 0 30px currentColor, 0 0 50px currentColor',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      },
      backdropBlur: {
        '4xl': '72px',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'particle': 'particle 4s ease-in-out infinite',
        'kinetic': 'kinetic 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor, 0 0 20px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 35px currentColor, 0 0 50px currentColor' },
        },
        particle: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '0.7' },
        },
        kinetic: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%) skewX(-15deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.bg-gradient-cosmic': {
          'background': 'radial-gradient(ellipse at center, #1a1a26 0%, #121218 50%, #0a0a0f 100%)',
        },
        '.bg-gradient-gaming': {
          'background': 'linear-gradient(135deg, #0066ff 0%, #6600ff 50%, #ff0080 100%)',
        },
        '.mobile-friendly': {
          'touch-action': 'manipulation',
          'tap-highlight-color': 'transparent',
          '-webkit-tap-highlight-color': 'transparent',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}