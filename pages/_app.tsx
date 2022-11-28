import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import theme from "../styles/theme";
import { store } from "../rstore/store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ApolloProvider client={client}>
        <SessionProvider session={pageProps.session}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </SessionProvider>
      </ApolloProvider>
    </ChakraProvider>
  );
}
export default MyApp;
