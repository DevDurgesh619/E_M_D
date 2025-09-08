"use client";
import React from "react";
import useSWR,{ mutate } from "swr";
import { CrossIcon } from "../Icon/Cross";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
interface EventProps {
  title: string;
  description: string;
  registrations:number
  id:string
}

// I'm changing this to a default export for simplicity and best practice
export default function EventCard({ title, description,registrations,id}: EventProps) {
  const handleDeleteCard = async () => {
  try {
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");

    // Correctly typed mutation
     mutate(
        "/api/dashboard/events",
        (events: any[] | undefined) =>
          events ? events.filter((e) => e.id !== id) : [],
        false
      );
  } catch (e) {
    console.error("Error deleting event:", e);
  }
}

  return (
        <div className="w-full  p-4 border-gray-300 border-[1px] h-48 rounded shadow-md mb-2 bg-white">
          <div className=" flex justify-between">
            <h2 className=" mb-5 text-xl font-bold text-gray-700">{title}</h2>
            <div onClick={handleDeleteCard} className="hover:cursor-pointer transition duration-300 ease-in-out transform  hover:scale-130 inline-block">
                <CrossIcon size="md" />
            </div>
          </div>
            <p className="text-gray-600 mt-1">{description}</p>
            <p className="text-sm text-gray-500 mt-2">Registrations: {registrations}</p>
        </div>
  );
}