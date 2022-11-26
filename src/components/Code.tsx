import { Box, Typography } from "@mui/material";
import { FC, PropsWithChildren } from "react";

export const Code: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        my: 2,
        p: 2,
        maxHeight: 285,
        overflowY: "scroll",
        backgroundColor: "rgb(0, 30, 60)",
        borderRadius: 10,
      }}
    >
      <Typography component="pre">{children}</Typography>
    </Box>
  );
};
