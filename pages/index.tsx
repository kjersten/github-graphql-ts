import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/topbar/Header";
import { Container, Heading, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";

import ClientOnly from "../components/control_panel/ClientOnly";
import ControlPanel from "../components/control_panel/ControlPanel";
import TeamMembers from "../components/content/TeamMembers";
import { getDefaultDateRange } from "../utilities/date_utils";

import { DateRange } from "../types";
import { setDate } from "date-fns";

const Home: NextPage = () => {
  const [session] = useSession();
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [org, setOrg] = useState<string>();
  const [team, setTeam] = useState<string>();

  console.log(`date range is ${dateRange.start} to ${dateRange.end}`);

  useEffect(() => {
    if (window.localStorage.getItem("org") !== undefined) {
      const storedOrg = window.localStorage.getItem("org");
      if (storedOrg !== null) {
        setOrg(storedOrg);
      }
    }
    if (window.localStorage.getItem("team") !== undefined) {
      const storedTeam = window.localStorage.getItem("team");
      if (storedTeam !== null) {
        setTeam(storedTeam);
      }
    }
  }, []);

  if (session) {
    console.log(`session access token: ${session.accessToken}`);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>GH Team View</title>
        <meta name="description" content="View Your Team's Activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Container maxW="container.lg">
          <Header />
        </Container>
      </header>
      <main>
        <Container maxW="container.lg">
          {!session && (
            <>
              <Heading mb="4" size="md">
                See your Pull Requests
              </Heading>
              <Text fontSize="md">
                Sign in for a list of PRs awaiting review.
              </Text>
            </>
          )}
          {session && (
            <ClientOnly>
              <ControlPanel
                org={org}
                setOrg={setOrg}
                team={team}
                setTeam={setTeam}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
              {team ? <TeamMembers org={org} team={team} /> : <></>}
            </ClientOnly>
          )}
        </Container>
      </main>
    </div>
  );
};

export default Home;
