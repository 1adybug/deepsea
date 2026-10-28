import plugin from "tailwindcss/plugin"

export function soda() {
    return plugin(
        ({ addUtilities }) => {
            addUtilities({
                ".justify-text": {
                    "text-align": "justify",
                    "text-align-last": "justify",
                },
                ".fill-x": {
                    flex: "1 1 auto",
                    "min-width": "0",
                },
                ".fill-y": {
                    flex: "1 1 auto",
                    "min-height": "0",
                },
            })
        },
        {
            theme: {
                extend: {
                    backgroundSize: {
                        full: "100% 100%",
                    },
                },
            },
        },
    )
}
