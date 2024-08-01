export const proxyGetLocalStorage = (name: string) => {
    return localStorage.getItem(name)
}
export const proxyDeleteLocalStorage = (name: string) => {
    return localStorage.removeItem(name)
}

export const proxySetLocalStorage = (name: string, value: any) => {
    return localStorage.setItem(name, value)
}