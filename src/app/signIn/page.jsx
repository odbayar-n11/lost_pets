"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react"
import { supabaseClient } from "../lib/client"


export default function LogInPage() {
    const router = useRouter()
    const supabase = supabaseClient('https://auiyrnfvxwojdjlraske.supabase.co', 'sb_publishable_sRHNA1Iev1pTNT33fLoxJA_bT3X8jGd');

    const Login = () => {
    router.push("/logIn")
}
const [info, setInfo] = useState({
    email: "",
    password: "",
})

    const handleInfo = (event) => {
    if(event.target.name === "email") {
        setInfo({...info, email: event.target.value})
    }
    if(event.target.name === "password") {
        setInfo({...info, password: event.target.value})
    }
}

const SignIn = async() => {
    const response = await supabase.auth.signUp({
    email: info.email,
    password: info.password,
  })
  router.push("/logIn")
  console.log(response.data)
}
console.log(info)
    return (
    <div className="flex min-h-screen items-center justify-center ">
        <Card className='w-150 h-87'>
  <CardHeader>
    <CardTitle>Sign Up</CardTitle>
    <CardDescription>Create new account</CardDescription>
    <CardAction>Already have an Account? 
   <button onClick={Login} style={{color: "blue"}}>Log In</button>
    </CardAction>
  </CardHeader>
  <CardTitle className="ml-10 mt-5">Email</CardTitle>
  <CardContent>
    <Input name="email" onChange={handleInfo}/>
  </CardContent>
  <CardTitle className="ml-10 mt-3">Password</CardTitle>
  <CardContent>
    <Input name="password" onChange={handleInfo}/>
  </CardContent>
  <CardFooter className='flex justify-center'>
    <Button variant="outline" onClick={SignIn} className='w-40'>Sign up</Button>
  </CardFooter>
</Card>
    </div>
)
} 