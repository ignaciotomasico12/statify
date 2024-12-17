"use client";
import Image from "next/image";
import ThemeToggle from "./themeToggler"
import { signOut, useSession } from "next-auth/react";
import { FiPower, FiUser } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "../ui/menubar";

export default function Header(){
    const { data: session  } = useSession();
    return(
        <header className="fixed top-0 left-0 w-full">
            <div className="w-full py-5 px-20 flex justify-between items-center">
                <Image
                    src="/statify.svg"
                    alt="Next.js logo"
                    width={120}
                    height={18}
                    priority
                />
                <div className="flex justify-end items-center gap-2">
                    <ThemeToggle />
                    {session &&
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger className="flex justify-start items-center gap-3">
                                    {session.user?.name}
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem className="flex justify-start items-center gap-3"><FiUser/> Profile</MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem 
                                        variant="error"
                                        className="flex justify-start items-center gap-3"
                                        onClick={() => signOut()}
                                    >
                                        <FiPower/> Log Out
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