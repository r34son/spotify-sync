import axios from "axios";
import qs from "qs";
import { Me } from "../../interfaces";

const { access_token } = qs.parse(window.location.hash.substring(1));

const spotifyApi = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: { Authorization: `Bearer ${access_token}` },
});

const authQueryParams = qs.stringify({
  response_type: "token",
  client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  scope: "playlist-modify-public user-library-modify",
  redirect_uri: "http://localhost:3000",
});

export const authUrl = `https://accounts.spotify.com/authorize?${authQueryParams}`;

// TODO: refresh token on 401
export const getUser = () => spotifyApi.get<Me>("/me");

export const createPlaylist = (userId: string, name: string) =>
  spotifyApi.post(`/users/${userId}/playlists`, { name });

export const search = (q: string) =>
  spotifyApi.get("/search", { params: { q, type: "track" } });

export const saveTracks = (ids: string[]) =>
  spotifyApi.put("/me/tracks", { ids });
