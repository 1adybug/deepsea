export const additionalEffectHooks = "^useStableEffect$"

export const reactHooksSettings = {
    "react-hooks": {
        additionalEffectHooks,
    },
} as const

const config = [
    {
        name: "soda-hooks/react-hooks",
        settings: reactHooksSettings,
    },
] as const

export default config
