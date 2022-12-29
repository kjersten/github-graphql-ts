import { Button } from "@chakra-ui/react";
import NextLink from "next/link";

import { Tab } from "../../types";

type Props = {
  text: String;
  tabName: Tab;
  selectedTab: String;
};

export default function NavItem(props: Props) {
  const { text, tabName, selectedTab } = props;
  const style = tabName === selectedTab ? "solid" : "ghost";

  return (
    <NextLink href={tabName} passHref>
      <Button justifyContent="flex-start" variant={style} w="100%">
        {text}
      </Button>
    </NextLink>
  );
}
