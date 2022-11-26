import axios from "axios";
import qs from "qs";
import { Me } from "../interfaces";

const { access_token } = qs.parse(window.location.hash.substring(1));

const spotifyApi = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: { Authorization: `Bearer ${access_token}` },
});

const authQueryParams = qs.stringify({
  response_type: "token",
  client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  scope: "playlist-modify-public",
  redirect_uri: "http://localhost:3000",
});

export const authUrl = `https://accounts.spotify.com/authorize?${authQueryParams}`;

export const getUser = () => spotifyApi.get<Me>("/me");
