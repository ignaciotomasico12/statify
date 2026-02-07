import type { Metadata } from "next";
import { Montserrat, } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner"
import Providers, { Theme } from "./providers";
import Header from "@/components/layout/header";

import "./globals.css";

const monserrat = Montserrat({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: "--font-monserrat",
});


export const metadata: Metadata = {
  title: "Spotify Stats App",
  description: "View your Spotify statistics with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${monserrat.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Theme>
              <div className="fixed left-0 top-0 -z-10 h-screen w-screen">
                <div className="relative h-full w-full dark:bg-[#000000] bg-[#ffffff]">
                  <div className="absolute bottom-0 top-0 right-0 left-0 dark:bg-[#000000] bg-[#ffffff] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:1.5rem_2rem]"></div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-auto w-full aspect-square min-w-[800px] rounded-full"></div>
                </div>
              </div>
              <div className="relative">
                <Header />
                <main className="px-5 md:px-20 lg:px-32 xl:px-40 py-5">
                  {children}
                </main>
                <Toaster />
              </div>
            </Theme>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
