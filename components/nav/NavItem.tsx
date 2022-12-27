import { Button } from "@chakra-ui/react";

import { Tab } from "../../types";

type Props = {
  text: String;
  tabName: String;
  selectedTab: Tab;
  setTab: Function;
};

export default function NavItem(props: Props) {
  const { text, tabName, selectedTab, setTab } = props;
  const style = tabName === selectedTab ? "solid" : "ghost";

  return (
    <Button
      justifyContent="flex-start"
      variant={style}
      onClick={() => setTab(tabName)}
    >
      {text}
    </Button>
  );
}
