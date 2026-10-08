"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const supabase = supabaseClient();

export const CreatePostDialog = (props) => {
    
    const [Description, setDescription] = useState("")
    const [image, setImage] = useState(null)
      const [email, setEmail] = useState("")
    

    const handleDescription = (e) => {
        setDescription(e.target.value)
    }

    const handleImage = (event) => {
        const file = event.target.files[0]
        setImage(file)
    }

 useEffect(() => {
     const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email)
      }
    }
    getUser()
  }, [])


    const addPost = async () => {
       if (!image) return;

       const response = await supabase.storage.from("post.images").upload(`pet/${Date.now()}`, image)
       if (response.error) return console.log(response.error);

       const uploadedPath = response.data.path

       const SecondResponse = supabase.storage.from('post.images').getPublicUrl(uploadedPath)

       const uploadedImgUrl = SecondResponse.data.publicUrl

        const postRes = await supabase.from("posts").insert({
            imageUrl: uploadedImgUrl,
            description: Description,
            isFound: false,
            username: email,
        })
       console.log(postRes)
       setDescription("")
        setImage(null)
        props.openDialog(false)
    }



    return (
    <Dialog open={props.isOpen} onOpenChange={props.openDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create post</DialogTitle>
       <Textarea placeholder="Description" value={Description} onChange={handleDescription}/>
      <Input placeholder="Picture" type='file' onChange={handleImage} className="w-90 h-30 flex items-center justify-center"/>
      <Button variant="outline" onClick={addPost}>POST</Button>
    </DialogHeader>
  </DialogContent>
</Dialog>)
}