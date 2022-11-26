export interface Me {
  display_name: string;
  external_urls: { spotify: string };
  followers: { href: null; total: 0 };
  href: string;
  id: string;
  images: {
    height: number | null;
    url: string;
    width: number | null;
  }[];
  type: string;
  uri: string;
}
