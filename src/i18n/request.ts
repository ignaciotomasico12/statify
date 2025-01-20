import {getRequestConfig} from 'next-intl/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ExtendedSession } from '@/types/auth';
 
export default getRequestConfig(async () => {
  const session = await getServerSession(authOptions)
  const sessionUser = session as ExtendedSession
  const locale = sessionUser ? sessionUser.user?.locale : 'en';
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});