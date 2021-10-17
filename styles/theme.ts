import { extendTheme } from "@chakra-ui/react";

// const fonts = { mono: `'Menlo', monospace` };
const config = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  // colors: {
  //   black: "#16161D",
  // },
  // fonts,
});

export default theme;
