import { useEffect, useState, createContext, useContext } from "react"
import toast from 'react-hot-toast'
import { createClient } from '@supabase/supabase-js'

const supabaseURL: string = (process.env.NEXT_PUBLIC_SUPABASE_URL as string);
const supabaseAnonKey: string = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)
const supabase = createClient(supabaseURL, supabaseAnonKey)
export default supabase

interface User{
    loaded: boolean,
    user: any
}
interface Session{
    loaded: boolean,
    session: any
}
interface SBContext{
    session?: any,
    user?: any,
}

const SupabaseContext = createContext<SBContext>({})

export function SupabaseProvider(props:any){

    const [user, setUser] = useState<User>({loaded: false, user: null})
    const [session, setSession] = useState<Session>({loaded: false, session: null})

    useEffect(() => {
        setUser({user: supabase.auth.user(), loaded: true})
        setSession({session: supabase.auth.session(), loaded: true})
        supabase.auth.onAuthStateChange(() => {
            setUser({user: supabase.auth.user(), loaded: true})
            setSession({session: supabase.auth.session(), loaded: true})
        })
    }, [])

    return <SupabaseContext.Provider value={{user, session}}>{props.children}</SupabaseContext.Provider>
}

export function useUser(){
    const context = useContext(SupabaseContext)
    return context.user
}
export function useSession(){
    const context = useContext(SupabaseContext)
    return context.session
}

export async function logOut(){
    await supabase.auth.signOut()
    toast.success('Logged out')
}