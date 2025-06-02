import Head from "next/head";
import "@/styles/globals.css";
import "@/styles/paymentslip.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/theme";
import store from "../store";
import { Provider } from "react-redux";



export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>TCAC&apos;24</title>
        <meta name="description" content="TCAC'24 - Connecting the Community" />
        <link rel="icon" href="/timsan-logo.png" />
      </Head>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </>
  );
}
