export function parseJson<T = unknown>(raw: string): T {
    try {
        return JSON.parse(raw) as T
    } catch (error) {
        throw new Error("AI 返回的不是合法JSON")
    }
}