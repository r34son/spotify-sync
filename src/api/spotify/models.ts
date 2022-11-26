type URL = string;

type State = string;

export type AuthResponseHash =
  | {
      access_token: string;
      token_type: "Bearer";
      expires_in: number;
      state?: State;
    }
  | { error: string; state?: State };

interface Image {
  height: number | null;
  url: URL;
  width: number | null;
}

export interface Album {}

export interface Artist {}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string; ean: string; upc: string };
  external_urls: { spotify: URL };
  href: URL;
  id: string;
  is_playable: boolean;
  linked_from: Track | null;
  name: string;
  popularity: number;
  preview_url: URL | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface Tracks {
  href: URL;
  items: Track[];
  limit: number;
  next: URL | null;
  offset: number;
  previous: URL | null;
  total: number;
}

export interface User {
  display_name: string;
  external_urls: { spotify: URL };
  followers: { href: null; total: number };
  href: URL;
  id: string;
  images: Image[];
  type: "user";
  uri: string;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: { spotify: URL };
  followers: { href: null; total: number };
  href: URL;
  id: string;
  images: Image[];
  name: string;
  owner: Omit<User, "followers" | "images">;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: "playlist";
  uri: string;
}

export interface TrackSearch {
  tracks: Tracks;
}
