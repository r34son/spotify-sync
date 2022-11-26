import { AppBar, Avatar, Button, Toolbar, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { authUrl, getUser } from "../api/spotify";
import qs from "qs";
import { Me } from "../interfaces";

export const Header = () => {
  const [spotifyUser, setSpotifyUser] = useState<Me>();
  const isAuthorized = useMemo(() => {
    return qs.parse(window.location.hash.substring(1)).access_token;
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      getUser().then(({ data }) => setSpotifyUser(data));
    }
  }, [isAuthorized]);

  const onSpotifyLogin = () => {
    window.location.href = authUrl;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          VK Spotify Sync
        </Typography>
        {isAuthorized ? (
          <Avatar
            alt={spotifyUser?.display_name}
            src={spotifyUser?.images[0].url ?? ""}
          />
        ) : (
          <Button onClick={onSpotifyLogin}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
