"use client";
import Image from "next/image";
import ThemeToggle from "./themeToggler"
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { FiPower } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../ui/menubar";

export default function Header(){
    const { data: session  } = useSession();
    const t = useTranslations('app.layout.header');
    return(
        <header className="sticky top-0 left-0 w-full z-10 bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-50 border-b dark:border-gray-800/50 border-slate-300/50">
            <div className="px-3 sm:px-5 md:px-20 lg:px-32 xl:px-40 w-full py-3 flex justify-between items-center">
                <Link href="/">
                    <Image
                        src="/statify.svg"
                        alt="Next.js logo"
                        width={100}
                        height={15}
                        priority
                        className="w-[120px] h-[18px] md:h-[40px]"
                    />
                </Link>
                <div className="flex justify-end items-center gap-1 sm:gap-2">
                    <ThemeToggle />
                    {session &&
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger className="flex justify-start items-center gap-2 sm:gap-3">
                                    <span className="hidden sm:inline">{session.user?.name}</span>
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem 
                                        variant="error"
                                        className="flex justify-start items-center gap-3"
                                        onClick={() => signOut()}
                                    >
                                        <FiPower className="w-4 h-4"/> {t('profile.menu.logOut')}
                                    </MenubarItem>       
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    }
                </div>
            </div>
          </header>
    )
}