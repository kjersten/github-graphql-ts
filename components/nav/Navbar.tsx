import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import NavItem from "./NavItem";
import { Tab } from "../../types";

export default function Navbar() {
  const path = useRouter().pathname;
  const authorPulls = path.startsWith(Tab.AuthorPulls);
  const authorReviews = path.startsWith(Tab.AuthorReviews);

  return (
    <Flex flexDirection="column" gap={4} pr={7} pt={10}>
      <NavItem text="Team PRs" tabName={Tab.TeamPulls} selectedTab={path} />
      {authorPulls && (
        <NavItem
          text="> Author PRs"
          tabName={Tab.AuthorPulls}
          selectedTab={path}
        />
      )}
      <NavItem
        text="Team Reviews"
        tabName={Tab.TeamReviews}
        selectedTab={path}
      />
      {authorReviews && (
        <NavItem
          text="> Author Reviews"
          tabName={Tab.AuthorReviews}
          selectedTab={path}
        />
      )}
      <NavItem text="Time to Review" tabName={Tab.Ttr} selectedTab={path} />
    </Flex>
  );
}
