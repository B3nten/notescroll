export type SupabaseQuery = {
    loaded: boolean,
    error: null|object,
    data: Array<object> | object | null | any,
    isValidating?: boolean,
}


