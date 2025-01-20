"use client";

import { useTheme } from "next-themes";
import { FiSun, FiMoon  } from "react-icons/fi";
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div>
      <div className="hidden dark:block">
        <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
            <FiMoon className="w-4 h-4"/>
        </Button>
      </div>
      <div className="dark:hidden">
        <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
            <FiSun className="w-4 h-4"/>
        </Button>
      </div>
    </div>
  );
}