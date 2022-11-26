import { Box, Button } from "@mui/material";
import { FC } from "react";

interface StepControlsProps {
  isFirstStep?: boolean;
  isLastStep?: boolean;
  onNext: () => void;
  onBack: () => void;
}

export const StepControls: FC<StepControlsProps> = ({
  isFirstStep = false,
  isLastStep = false,
  onBack,
  onNext,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", width: "100%", pt: 2 }}>
      <Button disabled={isFirstStep} onClick={onBack} sx={{ mr: 1 }}>
        Назад
      </Button>
      <Box sx={{ flex: "1 1 auto" }} />
      <Button onClick={onNext}>{isLastStep ? "Завершить" : "Далее"}</Button>
    </Box>
  );
};
