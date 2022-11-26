import {
  Container,
  createTheme,
  CssBaseline,
  Stack,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { SyncSteps } from "./components/SyncSteps/SyncSteps";
import { Icon56LogoVk } from "@vkontakte/icons";
import { YandexMusicLogo } from "./components/YandexMusicLogo";
import { MusicServices } from "./enums";
import { SnackbarProvider } from "notistack";
import SpotifyApi from "api/spotify";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const [musicService, setMusicService] = useState<MusicServices | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SpotifyApi.getCurrentUser().then(() => setIsLoading(false));
  }, []);

  const onMusicServiceChange = (_: unknown, service: MusicServices | null) => {
    setMusicService(service);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider>
        <CssBaseline />
        <Header isFetchingCurrentUser={isLoading} />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Stack direction="row" justifyContent="center" sx={{ mb: 4 }}>
            <ToggleButtonGroup
              value={musicService}
              exclusive
              onChange={onMusicServiceChange}
            >
              <ToggleButton value={MusicServices.VK}>
                <Icon56LogoVk />
              </ToggleButton>
              <ToggleButton value={MusicServices.YandexMusic}>
                <YandexMusicLogo />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {musicService ? (
            <SyncSteps musicService={musicService} />
          ) : (
            <Typography align="center">
              Выберите музыкальный сервис для синхронизации со Spotify
            </Typography>
          )}
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
