"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-8">Iniciar sesión con Spotify</h1>
      <button
        onClick={() => signIn("spotify")}
        className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-400 transition"
      >
        Iniciar sesión
      </button>
    </div>
  );
}