import { fetchWebApi } from "@/lib/utils";
import { Artist, ArtistAlbums, ArtistRelatedArtists, ArtistTopTracks, Artists } from "@/types/artists";


export async function getOneArtist(accessToken: string, id: string) {
  return (await fetchWebApi(
    `v1/artists/${id}`, accessToken, 'GET'
  )) as Artist;
}

export async function searchArtists(accessToken: string, query: string) {
  return (await fetchWebApi(
    `v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`, accessToken, 'GET'
  )) as { artists: Artists };
}

export async function getArtistAlbums(accessToken: string, id: string) {
  return (await fetchWebApi(
    `v1/artists/${id}/albums`, accessToken, 'GET'
  )) as ArtistAlbums;
}

export async function getArtistTopTracks(accessToken: string, id: string) {
  return (await fetchWebApi(
    `v1/artists/${id}/top-tracks`, accessToken, 'GET'
  )) as ArtistTopTracks;
}

export async function getArtistRelatedArtists(accessToken: string, id: string) {
  return (await fetchWebApi(
    `v1/artists/${id}/related-artists`, accessToken, 'GET'
  )) as ArtistRelatedArtists;
}

export async function followArtist(accessToken: string, ids: string[]) {
  return (await fetchWebApi(
    `v1/me/following?type=artist&ids=${ids.map(String).join('%')}`, accessToken, 'PUT'
  ));
}

export async function unfollowArtist(accessToken: string, ids: string[]) {
  return (await fetchWebApi(
    `v1/me/following?type=artist&ids=${ids.map(String).join('%')}`, accessToken, 'DELETE'
  ));
}