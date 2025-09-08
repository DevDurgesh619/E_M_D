"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { useSWRConfig } from "swr";
interface EventUserProps {
  title: string;
  description: string;
  id:string
}

// I'm changing this to a default export for simplicity and best practice
export default function EventCardUser({ title, description,id}: EventUserProps) {
    
    const { mutate } = useSWRConfig();
    const handleRegister = async ()=>{
        try{
             mutate(
            '/api/dashboard/events',
            (events: any) =>
                events
                ? events.map((event: any) =>
                    event.id === id
                        ? { ...event, _count: { registrations: event._count.registrations + 1 } }
                        : event
                    )
                : events,
            false
            );
            const res = await fetch("/api/register",{
            method:"POST",
            headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
           eventId:id
        })
        });
        if (!res.ok) {
        throw new Error("Failed to register");
        }
            mutate(`/api/register/${id}`); // user dashboard
            mutate(`/api/dashboard/events`);
        }
        catch(e){
            console.error("This is the ERROR: ",e)
            mutate(`/api/register/${id}`); // user dashboard
            mutate(`/api/dashboard/events`);
        }
    }
    const handleUnRegister = async () => {
    try {
      // Optimistic update → set to false
      mutate(`/api/register/${id}`, { isRegistered: false }, false);

      const res = await fetch(`/api/register/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to unregister");

      // Revalidate both dashboards
      mutate(`/api/register/${id}`);
      mutate(`/api/dashboard/events`);
    } catch (e) {
      console.error("This is the ERROR:", e);
      mutate(`/api/register/${id}`);
      mutate(`/api/dashboard/events`);
    }
  };
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`/api/register/${id}`, fetcher);
    const isRegistered = data?.isRegistered;  
    return (
        <div className="w-full  p-4 border-gray-300 border-[1px] h-48 rounded shadow-md mb-2 bg-white">
            <div className="flex justify-between">
                 <h2 className=" mb-5 text-xl font-bold text-gray-700">{title}</h2>
                {isRegistered ? (
                <div >
                ☑️ 
                </div>
            ) : (
                <div > 
                    🔘
                </div>
            )}
            </div>
            <p className="text-gray-600 mt-1">{description}</p>
           {isRegistered ? (
                 <button className="px-4 py-2 mt-8 rounded-md text-gray-700 font-semibold bg-slate-50 border-gray-300 border-[1px] hover:bg-slate-300 mr-2" onClick={handleUnRegister} >UnRegister</button>
            ) : (
                 <button className="px-4 py-2 mt-8 rounded-md text-gray-700 font-semibold bg-slate-50 border-gray-300 border-[1px] hover:bg-slate-300 mr-2" onClick={handleRegister} >Register</button>
            )}
           
        </div>
  );
}