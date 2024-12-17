import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers, { Theme } from "./providers";
import Header from "@/components/layout/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Stats App",
  description: "View your Spotify statistics with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Theme>
            <div className="fixed left-0 top-0 -z-10 h-screen w-screen">
              <div className="relative h-full w-full bg-background">
                <div className="absolute bottom-0 top-0 right-0 left-0 bg-background bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:1.5rem_2rem]"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-auto w-full aspect-square min-w-[800px] rounded-full bg-[radial-gradient(circle,#ffffff,transparent)] dark:bg-[radial-gradient(circle,#09090B,transparent)]"></div>
              </div>
            </div>
            <div className="relative">
              <Header />
              <main>
                {children}
              </main>
            </div>
          </Theme>
        </Providers>
      </body>
    </html>
  );
}
