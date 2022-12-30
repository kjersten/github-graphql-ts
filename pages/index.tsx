import { Heading, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import Layout from "../components/layout";
import LayoutWithNav from "../components/layout_with_nav";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    console.log(`session access token: ${session.accessToken}`);
  }

  function renderContentBasedOnAuth(
    authStatus: "authenticated" | "loading" | "unauthenticated"
  ) {
    if (authStatus === "authenticated") {
      return (
        <LayoutWithNav>
          <Heading mb="4" size="md">
            Team Activity
          </Heading>
          <Text fontSize="md">
            Select a tab for an overview of your team&apos;s pull requests,
            reviews and the time it takes to get a review.
          </Text>
        </LayoutWithNav>
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
