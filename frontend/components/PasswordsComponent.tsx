'use client'
import React, { useEffect, useState } from 'react'
import PasswordRowComponent from './subComponenets/PasswordRowComponent'
import {GetPlist, RegeneratePassword, DeletePassword} from "@/wailsjs/wailsjs/go/main/App"
import { useRouter } from 'next/navigation'
import Loading from './Loading'

interface DATA_I {
  data: string[] | undefined;
}
// {data}: DATA_I
function PasswordsComponent() {
  const router = useRouter()
  const [Plist, setPlist] = useState<null | string[] | undefined>(null)  
  const [LOADING, setLOADING] = useState(true)

  async function fetchPlist() {
    let tmp = await GetPlist().then((res: string) => JSON.parse(res))
    if(tmp.status){
      setPlist(tmp.passwordsList)
    }
  }

  useEffect(() => {
    fetchPlist().then(()=>setLOADING(false))
  }, [])
  
  async function regenerateHandler(w: string) {
    let tmp = await RegeneratePassword(w).then((res: string)=>JSON.parse(res))
    if(tmp.status){
      setLOADING(true)
      fetchPlist().then(()=>setLOADING(false))
    }
  }
  async function deleteHandler(w: string){
    let tmp = await DeletePassword(w).then((res: string)=>JSON.parse(res))
    if(tmp.status){
      setLOADING(true)
      fetchPlist().then(()=>setLOADING(false))
    }
  }

  function preparePasswordsList() {
    let tmp = (Plist == undefined ? [] : Plist)
    let tmparray: {[key: string]:  string | undefined}[] = []
    for(let i = 0; i< tmp.length; i+=2){
      let obj: { [key: string]:  string | undefined } = {}
      obj[tmp[i]] = tmp[i+1]
      tmparray.push(obj)
    }
    return tmparray
  }

  function renderPlist(): any {
    let tmparray = preparePasswordsList()
    return tmparray.map((el, index)=>{
      let k: string | undefined, v: string | undefined
      for (const [key, value] of Object.entries(el)) {
        console.log(key, value)
        k = key
        v = value 
      }
      return <PasswordRowComponent key={index} idx={index+1} Website={k} Password={v}
         regenerateHandler={regenerateHandler} deleteHandler={deleteHandler}/>
    })
    
  }

  if(LOADING){
    return(
      <div className='center'>
        <Loading />
      </div>
    )
  }else{
    return (
      <div className="">
        <h2 className='font-semibold text-[16px] my-10 text-center'>List of passwords</h2>
        <div className="w-[80%] mx-auto overflow-x-auto relative ">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th className='text-center'>Website</th>
                <th className='text-center'>Password</th>
                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                renderPlist()
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default PasswordsComponent