export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        animation: {
            'float': 'float 6s ease-in-out infinite',
            'float-2': 'float 6s ease-in-out infinite 2s',
            'float-3': 'float 6s ease-in-out infinite 4s',
        },
        keyframes: {
            float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-20px)' },
            }
        }
    },
};
export const plugins = [];