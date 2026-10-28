import { v4 } from "uuid"

export function cryptoRandomUUIDPolyfill() {
    if (typeof crypto.randomUUID !== "function") {
        crypto.randomUUID = function randomUUID() {
            return v4() as `${string}-${string}-${string}-${string}-${string}`
        }
    }
}
