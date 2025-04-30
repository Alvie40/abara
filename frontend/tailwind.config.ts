import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'background': "var(--background)",
                'foreground': "var(--foreground)",
                'primary': '#FFCE1A',
                'secondary' : "#0D0842",
                'blackBG': '#F3F3F3',
                'Favorite': '#FF5841'
            },
            fontFamily: {
                'primary' : ["Montserrat", "sans-serif"],
                'secondary' : ["Nunito Sans", "sans-serif"]
            }
        },
    },
    plugins: [],
};
export default config;
