import type { Config } from "tailwindcss"
const config: Config = {
    content: [
        "./index.html",
        "./public/index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
    extend: {},
    },
    plugins: [],
}

export default config
