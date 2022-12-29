import { Heading, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import Layout from "../components/layout";
import ClientOnly from "../components/control_panel/ClientOnly";
import MainContentPanel from "../components/content/MainContentPanel";

export default function Home() {
  const { data: session, status } = useSession();

  // useEffect(() => {
  //   if (window.localStorage.getItem("org") !== undefined) {
  //     const storedOrg = window.localStorage.getItem("org");
  //     if (storedOrg !== null) {
  //       setOrg(storedOrg);
  //     }
  //   }
  //   if (window.localStorage.getItem("team") !== undefined) {
  //     const storedTeam = window.localStorage.getItem("team");
  //     if (storedTeam !== null) {
  //       setTeam(storedTeam);
  //     }
  //   }
  // }, []);

  if (status === "authenticated") {
    console.log(`session access token: ${session.accessToken}`);
  }

  function renderContentBasedOnAuth(
    authStatus: "authenticated" | "loading" | "unauthenticated"
  ) {
    if (authStatus === "authenticated") {
      return (
        <ClientOnly>
          <MainContentPanel />
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
}
