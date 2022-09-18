import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  layerStyles: {
    tooltip: {
      background: "gray.300",
      color: "black",
    },
  },
});

export default theme;
