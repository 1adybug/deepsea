export interface PageError extends Error {
    digest?: string
}

export interface ErrorPageProps {
    error: PageError
    reset: () => void
}

export interface PageProps<Params extends Record<string, string> = Record<string, string>> {
    params: Promise<Params>
}
