// File Path: /app/page.tsx

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link'; // Import Link for navigation
import UserView from "./components/UserDashboard";

// Helper component for the Organizer's view
//@ts-ignore
const OrganizerView = ({ session }) => (
  <div>
    <div className="text-center p-8 bg-white shadow-lg rounded-lg">
      <div className="flex justify-center items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold text-gray-800">Organizer Dashboard</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Sign Out
        </button>
      </div>
      <p className="text-lg text-gray-600 mb-6">Welcome back, {session.user?.name}! Manage your events or create a new one.</p>
      <Link 
        href="/Dashboard" 
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 inline-block"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

// Helper component for the regular User's view
//@ts-ignore


export default function Home() {
  const { data: session, status } = useSession();

  // Handle the loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  // If the user is authenticated, check their role and render the correct view
  if (session) {
    // @ts-ignore
    if (session.user?.role === 'ORGANIZER') {
      return <OrganizerView session={session} />;
    }
    // Default to User view if role is USER or not defined
    return <UserView session={session} />;
  }

  // If the user is not authenticated, show the sign-in prompt
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Event Platform</h1>
        <p className="text-gray-600 mb-6">Please sign in to view and register for events.</p>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}