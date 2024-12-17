"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status  } = useSession();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    window.location.href = "/auth/signin";
    return null;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

    </div>
  );
}
