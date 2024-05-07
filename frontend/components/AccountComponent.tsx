'use client'
import React, {useRef, useState} from 'react'
import {UpdateUsername, RefetchAccountPage} from "@/wailsjs/wailsjs/go/main/App"


interface dataT {
  data: {
    Username: string;
    Password: string;
  }
}

function AccountComponent({data}: dataT) {
  const [Data, setData] = useState<{
    Username: string;
    Password: string;
  }>(data)
  const [edit, setedit] = useState(false)
  const usernameInput = useRef<HTMLInputElement>(null)
  const passwordInput = useRef<HTMLInputElement>(null)


  async function HandleSave() {
    let tmp = {
      newUsername: usernameInput.current?.value != undefined ? usernameInput.current?.value : "",
      newPassword: passwordInput.current?.value != undefined ? passwordInput.current?.value : ""
    }
    let response = await UpdateUsername(tmp.newUsername, tmp.newPassword).then((res: string)=>JSON.parse(res))
    if (response.status){
      let tmpp = await RefetchAccountPage().then((res: string)=>JSON.parse(res))
      let tmppp = {Username: tmpp.username, Password: tmpp.password}
      setData(tmppp)
      setedit(!edit)
    }
  }
  function displayPassword(): string {
    return "*****************"
  }
  return (
    <div className=''>
      <p className='text-center text-[16px] font-semibold my-3'>Account</p>
      <div className='w-[80%] bg-base-300 p-3 pt-9 mx-auto h-fit relative'>
        <div className='absolute right-3 -top-11'>
          <button onClick={()=>setedit(!edit)} className={edit ? "btn btn-square p-2 bg-blue-400/30 hover:bg-blue-400/30 ease-linear duration-150" : "btn btn-square p-2 bg-base-100 hover:bg-blue-400/30"}>
            <svg width="21" height="21" className='relative top-[2px] right-[2px]' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#fffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#ffffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899" stroke="#ffffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div className='grid grid-cols-3 mb-2'>
          <div className='flex justify-end items-center'>
            <p>Username</p>
          </div>
          <div className='col-span-2 flex justify-center items-center'>
            <input type="text" ref={usernameInput} placeholder={Data.Username} disabled={edit ? false:true} className="focus:outline-none input input-ghost w-[85%] disabled:bg-opacity-0 disabled:placeholder-opacity-100 disabled:cursor-default" />
          </div>
        </div>
        <div className='grid grid-cols-3 mb-2'>
          <div className='flex justify-end items-center'>
            <p>Password</p>
          </div>
          <div className='col-span-2 flex justify-center items-center'>
            <input type="text" ref={passwordInput} placeholder={displayPassword()} disabled={edit ? false:true} className="focus:outline-none input input-ghost min-w-[85%] disabled:bg-opacity-0 disabled:placeholder-opacity-100 disabled:cursor-default" />
          </div>
        </div>
        {edit ?
          <div className='w-full flex justify-center'>
            <button onClick={HandleSave} className='btn btn-primary'>Save</button>
          </div>
        :
        null
        }
      </div>
    </div>
  )
}

export default AccountComponent