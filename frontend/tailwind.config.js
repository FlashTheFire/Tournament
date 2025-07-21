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
        '3xs': '0.6rem',      // 9.6px - Ultra small mobile text
        '2xs': '0.625rem',    // 10px - Mobile micro text
        'xs': '0.75rem',      // 12px - Mobile small text
        'sm': '0.875rem',     // 14px - Mobile body text
        'base': '1rem',       // 16px - Desktop body text
        'lg': '1.125rem',     // 18px - Desktop large text
        'xl': '1.25rem',      // 20px - Small headings
        '2xl': '1.5rem',      // 24px - Medium headings
        '3xl': '1.875rem',    // 30px - Large headings
        '4xl': '2.25rem',     // 36px - Extra large headings
        '5xl': '3rem',        // 48px - Display text
        '6xl': '3.75rem',     // 60px - Large display
        '7xl': '4.5rem',      // 72px - Hero text
        '8xl': '6rem',        // 96px - Desktop hero
        '9xl': '8rem',        // 128px - Ultra hero
        // Mobile-specific font sizes
        'mobile-xs': '0.6875rem',  // 11px
        'mobile-sm': '0.8125rem',  // 13px
        'mobile-base': '0.9375rem', // 15px
        'mobile-lg': '1.0625rem',   // 17px
        'mobile-xl': '1.1875rem',   // 19px
        'mobile-2xl': '1.375rem',   // 22px
        'mobile-3xl': '1.625rem',   // 26px
        'mobile-4xl': '2rem',       // 32px
        'mobile-5xl': '2.5rem',     // 40px
        'mobile-6xl': '3rem',       // 48px
        // Desktop-specific font sizes
        'desktop-xs': '0.8125rem',  // 13px
        'desktop-sm': '0.9375rem',  // 15px
        'desktop-base': '1.0625rem', // 17px
        'desktop-lg': '1.1875rem',   // 19px
        'desktop-xl': '1.375rem',    // 22px
        'desktop-2xl': '1.75rem',    // 28px
        'desktop-3xl': '2.25rem',    // 36px
        'desktop-4xl': '3rem',       // 48px
        'desktop-5xl': '4rem',       // 64px
        'desktop-6xl': '5rem',       // 80px
        'desktop-7xl': '6rem',       // 96px
        'desktop-8xl': '8rem',       // 128px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        // Mobile-specific spacing
        'mobile-xs': '0.125rem',   // 2px
        'mobile-sm': '0.375rem',   // 6px
        'mobile-md': '0.75rem',    // 12px
        'mobile-lg': '1.25rem',    // 20px
        'mobile-xl': '2rem',       // 32px
        'mobile-2xl': '3rem',      // 48px
        // Desktop-specific spacing
        'desktop-xs': '0.25rem',   // 4px
        'desktop-sm': '0.625rem',  // 10px
        'desktop-md': '1rem',      // 16px
        'desktop-lg': '1.75rem',   // 28px
        'desktop-xl': '3rem',      // 48px
        'desktop-2xl': '4rem',     // 64px
        'desktop-3xl': '6rem',     // 96px
        // Touch-friendly sizes
        'touch-sm': '2.75rem',     // 44px - Minimum touch target
        'touch-md': '3rem',        // 48px - Comfortable touch target
        'touch-lg': '3.5rem',      // 56px - Large touch target
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
        'xs': '375px',    // Small phones
        'sm': '640px',    // Large phones
        'md': '768px',    // Tablets
        'lg': '1024px',   // Small laptops
        'xl': '1280px',   // Desktops
        '2xl': '1536px',  // Large desktops
        '3xl': '1920px',  // Ultra-wide
        '4xl': '2560px',  // 4K displays
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
        },
        '.line-clamp-1': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.line-clamp-none': {
          'overflow': 'visible',
          'display': 'block',
          '-webkit-box-orient': 'horizontal',
          '-webkit-line-clamp': 'none',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}