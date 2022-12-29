import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

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
    <Button justifyContent="flex-start" variant={style}>
      <NextLink href={tabName} passHref>
        <Link>{text}</Link>
      </NextLink>
    </Button>
  );
}
