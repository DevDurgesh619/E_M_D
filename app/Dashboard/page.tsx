"use client";
import useSWR from "swr";
import EventCardComponent from "../components/EventCard";
import { useState } from "react";
import ModalComponent from "../components/ModalComponent";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function DashboardPage() {
    const [modalOpen,setModalOpen] =useState(false);
    const { data, error } = useSWR('/api/dashboard/events', fetcher);
    if (error) return <div>Failed to load notifications.</div>;
    if (!data) return <div>Loading dashboard...</div>;
    
  return (
    <div>
     
      <ModalComponent open={modalOpen} onClose={()=>{setModalOpen(false)}}/>
      <div className="mb-2">
        <div className=" flex justify-between items-center px-4 h-14 bg-white shadow-sm rounded-md border-gray-300 border-[1px]" >
            <h1 className="text-xl text-gray-700 font-bold ml-2" > My Events </h1>
            <button className="px-4 py-2 rounded-md text-gray-700 font-semibold bg-slate-50 border-gray-300 border-[1px] hover:bg-slate-300 mr-2" onClick={() => {setModalOpen(true)}}>Add Event</button>
        </div>
      </div>
      <div className="grid grid-cols-1 items-center  sm:grid-cols-3  gap-2">
        {data.map((event:any)=><div  className ="p-3" key={event.id}>
        <EventCardComponent id={event.id} title = {event.title} description ={event.description} registrations={event._count?.registrations ?? 0} />
      </div>)}
      </div>
    </div>
  );
}