"use client"
import { useState } from "react"
import { CrossIcon } from "../Icon/Cross";
import { mutate } from "swr";
export default function  ModalComponent({open,onClose}:{
    open:boolean,
    onClose:()=>void
}){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const handelChangeTitle = (e:any) =>{
        setTitle(e.target.value)
    }
    const handelChangeDescription = (e:any) =>{
        setDescription(e.target.value)
    }
    //req send to backend to store title name and description
    const handleSubmit = async ()=>{
        try{
            const res = await fetch("/api/events",{
            method:"POST",
            headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
            title,
            description
        })
        });
        const newEvent = await res.json(); 
         mutate('/api/dashboard/events', (events: any[] | undefined) => {
      return events ? [newEvent, ...events] : [newEvent];
    }, false);
        setTitle("");
        setDescription("");
        }
        catch(e){
            console.error("This is the ERROR: ",e)
        }
    }
    return(
        <div>
            {open && (
  <div className="w-full h-full bg-slate-500/60 fixed top-0 left-0 flex justify-center items-center">
    <div className="h-auto w-96 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 ">Add Event</h2>
            <div onClick={onClose} className="hover:cursor-pointer">
                <CrossIcon size="md" />
            </div>
        </div>
      <div className="flex flex-col gap-4">
        {/* Title input */}
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={handelChangeTitle}
          className="h-10 px-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Description input */}
        <input
          type="text"
          placeholder="Description..."
          value={description}
          onChange={handelChangeDescription}
          className="h-10 px-3 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}  
          className=" bg-slate-50  border-1  text-gray-700 font-medium py-2 rounded-md hover:bg-slate-300 transition"
        >
          Add Event
        </button>
      </div>
    </div>
  </div>
)}


        </div>
        
    )
}