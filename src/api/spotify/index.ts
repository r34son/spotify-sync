import axios, { AxiosError } from "axios";
import qs from "qs";
import { AuthResponseHash, Playlist, Track, TrackSearch, User } from "./models";

class SpotifyApi {
  static apiUrl = "https://api.spotify.com/v1/";
  isAuthorized: boolean = false;
  authError: string | null = null;
  axiosInstance = axios.create({ baseURL: SpotifyApi.apiUrl });
  currentUser: User | null = null;

  constructor() {
    const hash = qs.parse(
      window.location.hash.substring(1)
    ) as AuthResponseHash;
    if ("error" in hash) {
      this.authError = hash.error;
      console.error("You need to authorize first");
    } else if ("access_token" in hash) {
      this.isAuthorized = true;
      this.axiosInstance.defaults.headers.Authorization = `Bearer ${hash.access_token}`;
      this.axiosInstance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          if (error.response?.status === 401) {
            this.authorize();
          }
          return Promise.reject(error);
        }
      );
    }
  }

  authorize = () => {
    const authQueryParams = qs.stringify({
      response_type: "token",
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      scope: "playlist-modify-public user-library-modify",
      redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
    });
    window.location.href = `https://accounts.spotify.com/authorize?${authQueryParams}`;
  };

  getCurrentUser = async () => {
    const response = await this.axiosInstance.get<User>("/me");
    this.currentUser = response.data || null;
  };

  createPlaylist = (name: string) =>
    this.axiosInstance.post<Playlist>(
      `/users/${this.currentUser?.id}/playlists`,
      { name, public: true }
    );

  addItemsToPlaylist = (playlistId: Playlist["id"], uris: Track["uri"][]) =>
    this.axiosInstance.post<{ snapshot_id: string }>(
      `/playlists/${playlistId}/tracks`,
      { uris }
    );

  searchTrack = (q: string) =>
    this.axiosInstance.get<TrackSearch>("/search", {
      params: { q, type: "track", limit: 1 },
    });

  saveTracks = (ids: string[]) => this.axiosInstance.put("/me/tracks", { ids });
}

export default new SpotifyApi();
