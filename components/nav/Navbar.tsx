import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import NavItem from "./NavItem";
import { Tab } from "../../types";

export default function Navbar() {
  const path = useRouter().pathname;

  return (
    <Flex flexDirection="column" gap={4} pr={7} pt={10}>
      <NavItem text="Team PRs" tabName={Tab.Pulls} selectedTab={path} />
      <NavItem text="Team Reviews" tabName={Tab.Reviews} selectedTab={path} />
      <NavItem text="Time to Review" tabName={Tab.Ttr} selectedTab={path} />
    </Flex>
  );
}
