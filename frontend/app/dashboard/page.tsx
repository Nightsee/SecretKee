'use client'
import AccountComponent from "@/components/AccountComponent"
import { useRouter } from "next/navigation"
import GeneratorComponent from "@/components/GeneratorComponent"
import PasswordsComponent from "@/components/PasswordsComponent"
import { useEffect, useState } from "react"
import {GetData} from "@/wailsjs/wailsjs/go/main/App"
import {Logout} from '@/wailsjs/wailsjs/go/main/App'

interface Account {
    Username: string;
    Password: string;
    Cost: number;
    Data: string[];
}

export default function Dashboard() {
    const [content, setcontent] = useState<string>("generator")
    const [data, setdata] = useState<null | Account>(null)
    const router = useRouter()

    async function loaddata() {
        let tmp = await GetData().then(res=>JSON.parse(res))
        console.log('getdata returned this: ', tmp)
        setdata(tmp)
    }

    useEffect(()=>{   
        loaddata()
    } ,[])

    function renderContentComponent() {
        switch(content) {
            case "generator":
                return <GeneratorComponent />
            case "passwords":
                // return <GeneratorComponent />
                return <PasswordsComponent />
            case "account":
                let tmp = {
                    Username: data?.Username == undefined ? "" : data.Username,
                    Password: data?.Password == undefined ? "" : data.Password
                }
                return <AccountComponent data={tmp} />
            default:
                return "nill"
        }
    }

    async function logout() {
        // empty the go struct
        let logoutResponse = await Logout().then((res: string)=> JSON.parse(res))
        if(logoutResponse.status) {
            router.push("/")
        }else {
            console.log("error")
        }
    }

    useEffect(()=>{
        //console.log('data: ',data)
        let el = document.getElementById("underliner")
        switch(content) {
            case "generator":
                el?.classList.remove("right-3")
                el?.classList.add("right-[114px]")
                break
            case "passwords":
                el?.classList.remove("right-[114px]")
                el?.classList.add("right-3")
                break
        }
    }, [content])

    return (
    <main className="min-h-screen min-w-screen bg-base-300 flex flex-col">
        <div className="navbar bg-base-100 px-12 mb-2">
            <div className="navbar-start">
                <p className="title">secretKee</p>
            </div>
            <div className="navbar-center relative">
                <ul className="menu menu-horizontal">
                    <li className="ml-8 px-1 cursor-pointer" id="generator" onClick={()=>{setcontent("generator")}}>Generator</li>
                    <li className="ml-8 px-1 cursor-pointer" id="passwords" onClick={()=>setcontent("passwords")}>Passwords</li>
                </ul>
                <span id="underliner" className="absolute bottom-0 border border-b-white w-[70px] ease-linear duration-150"></span>
            </div>
            <div className="navbar-end">
            <div className="dropdown dropdown-hover">
                <div tabIndex={0} role="button" className="btn m-1 text-[14px] font-medium text-white">Account</div>
                <ul tabIndex={0} className="dropdown-content relative right-1 top-[60px] z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a onClick={()=>setcontent("account")}>Edit</a></li>
                    <li><a onClick={logout} className="hover:bg-red-600/20">Logout</a></li>
                </ul>
                </div>
            </div>
        </div>
        <div className="w-[95%] mx-auto flex-1 relative pb-7">
            {renderContentComponent()}
        </div>
        <div>
        </div>
    </main>
    )
}