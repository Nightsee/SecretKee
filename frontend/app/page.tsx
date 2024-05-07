'use client'
import { useRouter } from "next/navigation"
import { useState} from "react"
import {Connect} from "@/wailsjs/wailsjs/go/main/App"
import Loading from "@/components/Loading"

export default function Home() {
  const router = useRouter()
  const [username, setusername] = useState<null | string>(null)
  const [password, setpassword] = useState<null | string>(null)
  const [LOADING, setLOADING] = useState<boolean>(false)

  
  async function handleclick() {
    setLOADING(!LOADING)
    if(username != null && password != null){
      if(username.length >= 3 && password.length >= 3){
        let credentials = await Connect(username, password).then(res=>JSON.parse(res))
        if(credentials.status == true){
          setLOADING(false)
          return router.push('dashboard')
        }else {
          router.refresh()
        }
      }
    }
  }

  return (
    <main className="flex min-h-screen min-w-screen justify-center items-center bg-neutral-900">
      <div className='min-w-[40%] h-fit p-2 pr-3 rounded-xl bg-slate-800'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex-[1_1_20%] text-center'>Username</div>
          <div className='flex-[1_1_80%]'>
            <input type="text" onChange={(e)=>setusername(e.target.value)} placeholder="Type here" className="input input-primary w-full focus:outline-none"/>
          </div>
        </div>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex-[1_1_20%] text-center'>Password</div>
          <div className='flex-[1_1_80%]'>
            <input type="password" onChange={(e)=>setpassword(e.target.value)} placeholder="password" className="input input-primary w-full focus:outline-none"/>
          </div>
        </div>
        <div className='flex justify-center'>
          {LOADING ? 
          <button className="btn cursor-default opacity-60 hover:bg-primary btn-primary w-[30%] rounded-full">
            <span className="loading loading-spinner"></span>
            Login
          </button>
           :
           <button onClick={handleclick}  className='btn  btn-primary w-[30%] p-3 rounded-full'>
            Login
          </button> 
           }
        </div>
      </div>
    </main>
  )
}
