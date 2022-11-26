import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FC, useRef, useState } from "react";
import { parseVkAudiosScript } from "parseVkAudios";
import {
  Box,
  LinearProgress,
  linearProgressClasses,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { copyToClipboard } from "utils/text";
import { StepControls } from "components/StepControls";
import { Code } from "components/Code";
import SpotifyApi from "api/spotify";
import { chunkArray } from "utils/array";
import { promiseSequence } from "utils/promise";

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

enum SyncStatus {
  UNITIALISED,
  PENDING,
  SUCCESS,
  ERROR,
}

const NOT_EMPTY_STRING_REGEXP = /^(?!\s*$).+/;

const steps = ["Получите список аудиозаписей", "Ваша музыка", "Плейлист"];

interface VkStepsProps {
  activeStep: number;
  onNext: () => void;
  onBack: () => void;
}

export const VkSteps: FC<VkStepsProps> = ({ activeStep, onNext, onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const audiosInputRef = useRef<HTMLTextAreaElement>(null);
  const playlistNameInputRef = useRef<HTMLInputElement>(null);
  const [isAudiosEmpty, setIsAudiosEmpty] = useState(false);
  const [isPlaylistNameEmpty, setIsPlaylistNameEmpty] = useState(false);
  const [audios, setAudios] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState(SyncStatus.UNITIALISED);
  const [remainingTracks, setRemainingTracks] = useState(0);

  const onCopyClick = async () => {
    try {
      await copyToClipboard(parseVkAudiosScript);
      enqueueSnackbar(
        "Код скопирован в буфер обмена. Вставьте его в консоли разработчика на странице с вашими аудиозаписями.",
        { variant: "success" }
      );
    } catch (error) {
      enqueueSnackbar("Не удалось скопировать.", { variant: "error" });
    }
  };

  const checkAudios = () => {
    const { value } = audiosInputRef.current!;
    if (value.match(NOT_EMPTY_STRING_REGEXP)) {
      setIsAudiosEmpty(false);
      setAudios(value.split("\n"));
      onNext();
    } else setIsAudiosEmpty(true);
  };

  const onAudiosSync = async () => {
    const { value: playlistName } = playlistNameInputRef.current!;
    if (playlistName.match(NOT_EMPTY_STRING_REGEXP)) {
      onNext();
      setIsPlaylistNameEmpty(false);

      try {
        setRemainingTracks(audios.length);
        setSyncStatus(SyncStatus.PENDING);

        const trackSearchs = await promiseSequence(audios, (raw) => {
          setRemainingTracks((v) => v - 1);
          const [artist, track] = raw.split(" - ");
          return SpotifyApi.searchTrack({ artist, track: track.slice(0, 100) });
        });

        const trackUris = trackSearchs
          .map(({ data }) => data.tracks.items[0]?.uri)
          .filter(Boolean);

        const { data: playlist } = await SpotifyApi.createPlaylist(
          playlistName
        );

        await promiseSequence(chunkArray(trackUris, 100), (trackUrisChunk) =>
          SpotifyApi.addItemsToPlaylist(playlist.id, trackUrisChunk)
        );

        setSyncStatus(SyncStatus.SUCCESS);
      } catch (error) {
        setSyncStatus(SyncStatus.ERROR);
      }
    } else setIsPlaylistNameEmpty(true);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Typography paragraph>
              Вставьте скрипт в консоль разработчика и нажмите Enter.
            </Typography>
            <Code>{parseVkAudiosScript}</Code>
            <Button variant="contained" onClick={onCopyClick}>
              Скопировать
            </Button>
            <StepControls isFirstStep onBack={onBack} onNext={onNext} />
          </>
        );
      case 1:
        return (
          <>
            <Typography paragraph>
              Вставьте полученные аудиозаписи в поле.
            </Typography>
            <TextField
              fullWidth
              multiline
              inputRef={audiosInputRef}
              label="Ваши аудиозаписи"
              rows={10}
              error={isAudiosEmpty}
              helperText={isAudiosEmpty && "Вставьте полученные аудиозаписи"}
            />
            <StepControls onBack={onBack} onNext={checkAudios} />
          </>
        );
      case 2:
        return (
          <>
            <Typography paragraph>
              Введите название плейлиста и нажмите завершить - начнется
              синхронизация ваших аудиозаписей.
            </Typography>
            <TextField
              fullWidth
              label="Название плейлиста"
              inputRef={playlistNameInputRef}
              error={isPlaylistNameEmpty}
              helperText={isPlaylistNameEmpty && "Введите название плейлиста"}
            />
            <StepControls isLastStep onBack={onBack} onNext={onAudiosSync} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Box sx={{ mt: 2 }}>
          {syncStatus === SyncStatus.PENDING && (
            <>
              <Typography paragraph align="center">
                Ваша музыка синзронизируется.{" "}
                {audios.length > 100
                  ? `Процесс может занять длительное время, т.к. синхронизируются все ваши ${audios.length} треков`
                  : ""}
              </Typography>
              <ProgressBar
                variant="determinate"
                value={
                  ((audios.length - remainingTracks) / audios.length) * 100
                }
              />
              <Typography paragraph align="center">
                Осталось {remainingTracks} треков.
              </Typography>
              <Typography paragraph align="center">
                По завершению вы получите плейлист с вашими аудиозаписями из VK.
              </Typography>
            </>
          )}
          {syncStatus === SyncStatus.SUCCESS && (
            <>
              {/* TODO: добавить ссылку на плейлист */}
              <Typography paragraph align="center">
                Сихронизация завершена успешно.
              </Typography>
            </>
          )}
          {syncStatus === SyncStatus.ERROR && (
            <>
              <Typography paragraph align="center">
                При синхронизации произошла ошибка.
              </Typography>
            </>
          )}
        </Box>
      ) : (
        <Stack alignItems="center" sx={{ my: 2 }}>
          {renderStep()}
        </Stack>
      )}
    </>
  );
};
