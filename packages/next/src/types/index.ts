export interface PageError extends Error {
    digest?: string
}

export interface ErrorPageProps {
    error: PageError
    reset: () => void
}

export interface DynamicPageProps<Key extends string = string> {
    params: Promise<Record<Key, string>>
}
