"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { CreatePostDialog } from "./_components/CreatePostDialog";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/client";
import { Input } from "@/components/ui/input"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {

  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = supabaseClient()
  const [email, setEmail] = useState("")
    const [all, setAll] = useState([])

    


const GoTologIn = () => {
router.push("/logIn")
}

const openDialog = () => {
    setIsOpen((prev)=> !prev)
  }
  
    useEffect(() => {
     const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email)
      }
    }
    const getData = async () => {
      const response = await supabase.from('posts').select('*')
      console.log(response)
      setAll(response.data)
    }
    getData()
    getUser()
  }, [])

const goToComments = (postId) => {
  router.push(`/post/${postId}`)
}

  return (
    
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold tracking-tight">Feed</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={GoTologIn}>
            Log In
          </Button>
          <Button onClick={openDialog}>Create post</Button>
        </div>
      </div>

      <CreatePostDialog isOpen={isOpen} openDialog={openDialog} />


      <div className="space-y-6">
        {all.map((post) => {
    
          const formattedDate = post.created_at
            ? post.created_at.slice(0, 16).replace("T", " ")
            : ""

          return (
            
            <Card key={post.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow w-150">
        
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardDescription className='flex gap-3 items-center ml-1' >
                  <Avatar>
  <AvatarImage src="https://auiyrnfvxwojdjlraske.supabase.co/storage/v1/object/public/avatars/original-49446e05b567411680399878e2b14742%20(1).jpeg" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
                  {post.username.slice(0, -10)}
                </CardDescription>
                <span className="text-xs text-muted-foreground">
                  {formattedDate}
                </span>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {post.description}
                </p>
              </CardContent>

     
              {post.imageUrl && (
                <div className="relative w-full  overflow-hidden h-120 flex justify-center ">
                  <img
                    className="h-full object-cover"
                    src={post.imageUrl}
                    alt={post.description || "Post content"}
                    loading="lazy"
                  />
                </div>
              )}

            
              <CardFooter className="pt-3 pb-3 text-xs text-muted-foreground border-t bg-muted/20 flex justify-center">
        <Button className='bg-white w-100 text-black' onClick={() => goToComments(post.id)}>Comment</Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
