/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                cream: '#F6F1E8',
                sand: '#E3D2B8',
                milk: '#FFFDF9',
                ink: {DEFAULT: '#29231F', soft: '#5C534A'},
                walnut: {DEFAULT: '#6B4F3A', dark: '#57402E'},
                terra: {DEFAULT: '#B8613F', dark: '#9A4E32'},
                // legacy-алиасы, чтобы страницы, которые ещё не редизайнены, не развалились
                primary: '#6B4F3A',
                dark: '#29231F',
                success: '#5A7D52',
                border: '#E5DCCB',
            },
            fontFamily: {
                sans: ['Manrope', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                btn: '12px',
                input: '12px',
                card: '16px',
                img: '20px',
                modal: '20px',
            },
            boxShadow: {
                soft: '0 10px 30px rgba(41, 35, 31, 0.07)',
                lift: '0 16px 44px rgba(41, 35, 31, 0.12)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
