"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/auth";
import UserCard from "@/components/app/home/userCard";
import UserStats from "@/components/app/home/userStats";


export default function Home() {
    const { data: session, status } = useSession() as { data: ExtendedSession | null, status: "loading" | "authenticated" | "unauthenticated" };
    const [ selectedStats, setSelectedStats ] = useState<'artists' | 'shows' | 'tracks' | 'playlists'>("artists");

    if (status === "loading") {
        return <p>Cargando...</p>;
    }

    if (!session) {
        window.location.href = "/auth/signin";
        return null;
    }

    if(session && session.user) {
        return (
            <div className="w-full">
                <UserCard user={session.user} setStats={setSelectedStats}/>
                <UserStats selectedStats={selectedStats}/>
            </div>
        )
    }
}
