import { useSession, logOut } from "@/modules/supabase"



export default function Index(props: any){
  
  const session = useSession()


  return (
    <div className='break-words'>
      {JSON.stringify(session)}
      <button className='text-xl p-2 bg-slate-500 text-white' onClick={logOut}>logout</button>
    </div>
  )
}