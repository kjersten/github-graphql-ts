import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/frame/Header";
import { Container, Heading, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";

import ClientOnly from "../components/frame/ClientOnly";
import Organizations from "../components/frame/Organizations";
import TeamMembers from "../components/TeamMembers";

const Home: NextPage = () => {
  const [session] = useSession();
  const [login, setLogin] = useState();
  const [org, setOrg] = useState<string>();
  const [team, setTeam] = useState<string>();

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
              <Organizations
                org={org}
                team={team}
                setOrg={setOrg}
                setTeam={setTeam}
                setLogin={setLogin}
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
