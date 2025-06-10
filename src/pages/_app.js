import Head from "next/head";
import "@/styles/globals.css";
import "@/styles/paymentslip.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/theme";
import { wrapper } from "../store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/auth/user/userAuthSlice";
import { useRouter } from "next/router";

function App({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Check sessionStorage for user data on client-side
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        const { user, token } = JSON.parse(userData);
        dispatch(setUser({ user, token }));
      }
    }
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>TCAC&apos;24</title>
        <meta name="description" content="TCAC'24 - Connecting the Community" />
        <link rel="icon" href="/timsan-logo.png" />
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

// Use the wrapper with the latest implementation
export default wrapper.withRedux(App);
