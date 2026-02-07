import { fetchWebApi } from "@/lib/utils";
import { FollowedArtists, TopArtists } from "@/types/artists";
import { UserPlaylists } from "@/types/playlits";
import { SavedShows } from "@/types/shows";
import { SavedTracks } from "@/types/tracks";

export async function getCurrentUserProfile(accessToken: string) {
  return (await fetchWebApi(
    'v1/me', accessToken, 'GET'
  ));
}

export async function getCurrentUserFollowsArtist(accessToken: string, ids: string[]) {
  if (ids.length === 0) return [];
  return (await fetchWebApi(
    `v1/me/following/contains?type=artist&ids=${ids.map(String).join('%2C')}`, accessToken, 'GET'
  )) as boolean[];
}

export async function getCurrentUserFollowedArtists(accessToken: string, size: number = 20, after?: string) {
  const limit = Math.min(Math.max(size, 1), 50);
  const url = `v1/me/following?type=artist&limit=${limit}${after ? `&after=${after}` : ''}`;
  return (await fetchWebApi(url, accessToken, 'GET')) as FollowedArtists;
}

export async function getCurrentUserTopArtists(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term', size: number = 10, offset: number = 0) {
  return (await fetchWebApi(
    `v1/me/top/artists?time_range=${timeRange}&limit=${size}&offset=${offset}`, accessToken, 'GET'
  )) as TopArtists;
}

export async function getCurrentUserSavedTracks(accessToken: string) {
  return (await fetchWebApi(
    'v1/me/tracks', accessToken, 'GET'
  )) as SavedTracks;
}

export async function getCurrentUserSavedShows(accessToken: string) {
  return (await fetchWebApi(
    'v1/me/shows', accessToken, 'GET'
  )) as SavedShows;
}

export async function getCurrentUserPlaylists(accessToken: string, userId: string, limit: number = 20, offset: number = 0) {
  return (await fetchWebApi(
    `v1/users/${userId}/playlists?limit=${limit}&offset=${offset}`, accessToken, 'GET'
  )) as UserPlaylists;
}