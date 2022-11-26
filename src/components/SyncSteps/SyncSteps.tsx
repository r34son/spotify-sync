import { FC, useState } from "react";
import { MusicServices } from "../../enums";
import { VkSteps } from "./vk/VkSteps";

interface SyncStepsProps {
  musicService: MusicServices;
}

export const SyncSteps: FC<SyncStepsProps> = ({ musicService }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  if (musicService === MusicServices.VK)
    return (
      <VkSteps
        activeStep={activeStep}
        onNext={handleNext}
        onBack={handleBack}
      />
    );

  return null;
};
