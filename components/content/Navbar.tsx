import { Flex } from "@chakra-ui/react";

import NavItem from "./NavItem";
import { Tab } from "../../types";

type Props = {
  selectedTab: Tab;
  setTab: Function;
};

export default function Navbar(props: Props) {
  const { selectedTab, setTab } = props;

  return (
    <Flex flexDirection="column" gap={4} pr={7} pt={10}>
      <NavItem
        text="Team PRs"
        tabName="pulls"
        selectedTab={selectedTab}
        setTab={setTab}
      />
      <NavItem
        text="Team Reviews"
        tabName={"reviews"}
        selectedTab={selectedTab}
        setTab={setTab}
      />
      <NavItem
        text="Time to Review"
        tabName={"ttr"}
        selectedTab={selectedTab}
        setTab={setTab}
      />
    </Flex>
  );
}
