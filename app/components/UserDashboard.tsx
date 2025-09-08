"use client"
import { signOut } from "next-auth/react";
import useSWR, { mutate } from "swr";
import EventCardUser from "./EventCardUser";
import ModalComponent from "./ModalComponent";
import { useState } from "react";
//@ts-ignore
export default function UserView ({ session }){
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR('/api/events', fetcher );
     if (error) return <div>Failed to load notifications.</div>;
    if (!data) return <div>Loading dashboard...</div>;
    return(
        <div>
        
      <div className="mb-2">
        <div className=" flex justify-between items-center px-4 h-14 bg-white shadow-sm rounded-md border-gray-300 border-[1px]" >
            <h1 className="text-xl text-gray-700 font-bold ml-2" > My Events </h1>
            <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Sign Out
        </button>
        </div>
        <div className="flex justify-center">
            <p className="text-lg text-gray-500 mt-2">Welcome back, {session.user?.name}! Discover and register for events below.</p>
        </div>
    </div>
     <div className="grid grid-cols-1 items-center  sm:grid-cols-3  gap-2">
            {data.map((event:any)=><div  className ="p-3" key={event.id}>
            <EventCardUser  title = {event.title} description ={event.description} id={event.id} />
          </div>)}
    </div>
  </div>
    )
};