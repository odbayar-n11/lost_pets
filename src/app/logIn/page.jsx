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
import { supabaseClient } from "@/lib/client"


export default function LogInPage() {
    const router = useRouter()
    const supabase = supabaseClient('https://auiyrnfvxwojdjlraske.supabase.co', 'sb_publishable_sRHNA1Iev1pTNT33fLoxJA_bT3X8jGd');
    const [loading, setLoading] = useState(false)

    const [info, setInfo] = useState({
    email: "",
    password: "",
})

    const signUp = () => {
    router.push("/signIn")
}

const logIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: info.email,
        password: info.password,
    })
    console.log(data)
   setLoading(false)

    if (error) {
      console.log('error to login')
      return
    }

    if (data?.user) {
      router.push("/")
    }
   }


const handleInfo = (event) => {
    if(event.target.name === "email") {
        setInfo({...info, email: event.target.value})
    }
    if(event.target.name === "password") {
        setInfo({...info, password: event.target.value})
    }
}
    return (
    <div className="flex min-h-screen items-center justify-center ">
        <Card className='w-150 h-87'>
  <CardHeader>
    <CardTitle>Login to your account</CardTitle>
    <CardDescription>Enter your email and password below to login to your account</CardDescription>
    <CardAction>Don't have an account? 
   <button onClick={signUp} style={{color: "blue"}}>Sign up</button>
    </CardAction>
  </CardHeader>
  <CardTitle className="ml-10 mt-5">Email</CardTitle>
  <CardContent>
    <Input name="email" onChange={handleInfo}/>
  </CardContent>
  <CardTitle className="ml-10 mt-3">Password</CardTitle>
  <CardContent>
    <Input name="password" onChange={handleInfo} />
  </CardContent>
  <CardFooter className='flex justify-center'>
    <Button variant="outline" onClick={logIn} className=' w-40 '>Log In</Button>
  </CardFooter>
</Card>
    </div>
)
} 

