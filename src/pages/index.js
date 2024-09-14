// pages/index.js
import Head from "next/head";
import { Box } from "@chakra-ui/react";
import Header from "../components/landingPage/Header";
import HeroSection from "../components/landingPage/HeroSection";
import PreviousTCACRecap from "../components/landingPage/PreviousTCACRecap";
import ActivitiesSection from "../components/landingPage/ActivitiesSession";
import Footer from "../components/landingPage/Footer";
import TCACUpdates from "@/components/landingPage/TCACUpdates";

export default function Home() {
  return (
    <>
    
      <Head>
        <title>TCAC&apos;24</title>
        <meta name="description" content="TCAC'24 - Connecting the Community" />
        <link rel="icon" href="/timsan-logo.png" />
      </Head>

      <Box>
        {/* header */}
        <Box borderBottom="2px solid" borderColor="gray.100" zIndex="10">
          <Header />
        </Box>

        <HeroSection />

        <PreviousTCACRecap />
        <ActivitiesSection />
        <TCACUpdates />
        <Footer />
      </Box>
    </>
  );
}
