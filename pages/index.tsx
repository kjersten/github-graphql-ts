import type { NextPage } from "next";
import { Heading, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import Layout from "../components/layout";
import ClientOnly from "../components/control_panel/ClientOnly";
import ControlPanel from "../components/control_panel/ControlPanel";
import MainContentPanel from "../components/content/MainContentPanel";
import { getDefaultDateRange } from "../utilities/date_utils";

import { DateRange } from "../types";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [org, setOrg] = useState<string>();
  const [team, setTeam] = useState<string>();
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
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          {team ? (
            <MainContentPanel org={org} team={team} dateRange={dateRange} />
          ) : (
            <></>
          )}
        </ClientOnly>
      );
    }
    return (
      <>
        <Heading mb="4" size="md">
          Team Activity
        </Heading>
        <Text fontSize="md">
          Sign in to get a team-level overview of pull requests, reviews and
          time to review.
        </Text>
      </>
    );
  }

  return <Layout>{renderContentBasedOnAuth(status)}</Layout>;
};

export default Home;
