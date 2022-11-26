import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Code } from "./components/Code";
import { Header } from "./components/Header";
import { parseVkAudiosScript } from "./parseVkAudios";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
      <Code>{parseVkAudiosScript}</Code>
    </ThemeProvider>
  );
};

export default App;
