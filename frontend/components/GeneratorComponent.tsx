'use client'
import React, {useState} from 'react'
import {AppGenerateV2} from "@/wailsjs/wailsjs/go/main/App"

function GeneratorComponent() {
  const [characters, setcharacters] = useState(true)
  const [specialCharacters, setspecialCharacters] = useState(true)
  const [digits, setdigits] = useState(true)
  const [Plength, setPlength] = useState("0")
  const [opsAlert, setopsAlert] = useState(false)

  async function handleclick(){
    if(digits && characters || digits && specialCharacters || characters && specialCharacters){
      setopsAlert(false)
      let tmpinput = document.querySelector('input')
      if(tmpinput?.value != undefined) {
        let tmp = await AppGenerateV2(tmpinput.value, {Digits: digits, Characters: characters, SpecialCharacters: specialCharacters}).then((res: string)=>JSON.parse(res))
        if(tmp.status){
          //show a toast to indicate successfull generation of password
          if(tmpinput != null) tmpinput.value = ""
        }
      }
    }else {
      setopsAlert(true)
    }
  }
  return (
    <div className='flex  center justify-center items-center'>
      <div className='w-[600px]'>
        <div className='flex items-center'>
          <div className='mr-3'><p>Website url or name :</p></div>
          <div className='w-[73%]'>
            <input type="text" placeholder="example.com" className="input input-primary w-full focus:outline-none" />
          </div>
        </div>
        <div className='relative'>
          <button onClick={handleclick} className='absolute right-3 mt-2 btn btn-primary'>Generate</button>
        </div>
        <div tabIndex={0} className="collapse-open collapse-arrow mt-2 p-0 w-[82%] text-[14px] bg-base-200">
          <div className="collapse-title font-medium text-[14px]">
            Options
          </div>
          <div className="collapse-content"> 
            <div className="form-control w-[88%] mx-auto">
              <label className="label cursor-pointer">
                <span className="label-text">Digits</span> 
                <input type="checkbox" defaultChecked onChange={()=>setdigits(!digits)} className="checkbox" />
              </label>
            </div>
            <div className="form-control w-[88%] mx-auto">
              <label className="label cursor-pointer">
                <span className="label-text">Characters</span> 
                <input type="checkbox" defaultChecked onChange={()=>setcharacters(!characters)} className="checkbox" />
              </label>
            </div>
            <div className="form-control w-[88%] mx-auto">
              <label className="label cursor-pointer">
                <span className="label-text">Special characters</span> 
                <input type="checkbox" defaultChecked onChange={()=>setspecialCharacters(!specialCharacters)} className="checkbox" />
              </label>
            </div>
            <div className="form-control w-[88%] mx-auto">
              <label className="label cursor-pointer">
                <span className="label-text">Password length</span> 
                <select className="select select-bordered focus:outline-none w-[50%] py-0 max-w-xs">
                  <option selected>12</option>
                  <option>18</option>
                  <option>32</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        {
          opsAlert ? 
        <div className='flex items-center animate-pulse'>
          <div className='mr-2'>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#d62b2d" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 18.0001H9.33004C6.02005 18.0001 4.66005 15.6501 6.32005 12.7801L7.66004 10.4701L9.00005 8.16007C10.66 5.29007 13.37 5.29007 15.03 8.16007L16.37 10.4701L17.71 12.7801C19.37 15.6501 18.01 18.0001 14.7 18.0001H12Z" stroke="#d62b2d" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p className='text-[14px] text-red-600'>Make sure to check at least two options.</p>
        </div> : null
        }
      </div>
    </div>
  )
}

export default GeneratorComponent