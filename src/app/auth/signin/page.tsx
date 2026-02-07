"use client";

import { signIn } from "next-auth/react";
import {useTranslations} from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth.signIn');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black dark:text-white px-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">{t('pageTitle')}</h1>
      <button
        onClick={() => signIn("spotify")}
        className="px-5 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white rounded-md hover:bg-green-400 transition text-sm sm:text-base"
      >
        {t('signInButton')}
      </button>
    </div>
  );
}