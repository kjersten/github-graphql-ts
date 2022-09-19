import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/topbar/Header";
import { Container, Heading, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import ClientOnly from "../components/control_panel/ClientOnly";
import ControlPanel from "../components/control_panel/ControlPanel";
import MainContentPanel from "../components/content/MainContentPanel";
import { getDefaultDateRange } from "../utilities/date_utils";

import { DateRange } from "../types";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [org, setOrg] = useState<string>();
  const [team, setTeam] = useState<string>();
  const [teamFullName, setTeamFullName] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());

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
    if (window.localStorage.getItem("teamFullName") !== undefined) {
      const storedTeamFull = window.localStorage.getItem("teamFullName");
      if (storedTeamFull !== null) {
        setTeamFullName(storedTeamFull);
      }
    }
  }, []);

  if (status === "authenticated") {
    console.log(`session access token: ${session.accessToken}`);
  }

  function renderContentBasedOnAuth(
    authStatus: "authenticated" | "loading" | "unauthenticated"
  ) {
    if (authStatus === "authenticated") {
      return (
        <ClientOnly>
          <ControlPanel
            org={org}
            setOrg={setOrg}
            team={team}
            setTeam={setTeam}
            setTeamFullName={setTeamFullName}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          {team ? (
            <MainContentPanel
              org={org}
              team={team}
              teamFullName={teamFullName}
              dateRange={dateRange}
            />
          ) : (
            <></>
          )}
        </ClientOnly>
      );
    }
    return (
      <>
        <Heading mb="4" size="md">
          See your Pull Requests
        </Heading>
        <Text fontSize="md">Sign in for a list of PRs awaiting review.</Text>
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>GH Team View</title>
        <meta name="description" content="View Your Team's Activity" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
        <meta
          name="google-site-verification"
          content="uNBFx20dKT8iXB1sIi4jLufzmHFEe-2_rmep8WS7aig"
        />
      </Head>

      <header>
        <Container maxW="container.lg">
          <Header />
        </Container>
      </header>
      <main>
        <Container maxW="container.lg">
          {renderContentBasedOnAuth(status)}
        </Container>
      </main>
    </div>
  );
};

export default Home;
