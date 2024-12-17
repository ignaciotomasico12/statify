"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider basePath="/api/auth">
      {children}
    </SessionProvider>
  )
}

export function Theme({ children }: ProvidersProps) {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}