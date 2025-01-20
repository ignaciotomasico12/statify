import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const baseURL = 'https://api.spotify.com';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatFollowers = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export async function fetchWebApi(endpoint: string, token: string, method: string) {
  const headers = new Headers({
    'Authorization': 'Bearer ' + token,
    'Accept': method !== 'GET' ? 'application/json' : ''
  });
  const res = await fetch(`${baseURL}/${endpoint}`, {
    headers: headers,
    method
  });
  if (!res.ok) {
    const errorDetails = await res.json();
    console.error('Detalles del error:', errorDetails);
    throw new Error(`Error en la llamada: ${errorDetails.error?.message || res.statusText}`);
  }
  if(res.status === 200) {
    return res.json()
  } else {
    return res
  }
}
