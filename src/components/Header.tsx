import { AppBar, Avatar, Button, Toolbar, Typography } from "@mui/material";
import SpotifyApi from "api/spotify";
import { FC } from "react";

interface HeaderProps {
  isFetchingCurrentUser: boolean;
}

export const Header: FC<HeaderProps> = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Spotify Sync
        </Typography>
        {SpotifyApi.isAuthorized ? (
          <Avatar
            title={SpotifyApi.currentUser?.display_name}
            alt={SpotifyApi.currentUser?.display_name}
            src={SpotifyApi.currentUser?.images[0].url ?? ""}
          />
        ) : (
          <Button onClick={SpotifyApi.authorize}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
