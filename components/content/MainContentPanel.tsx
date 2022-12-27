import { Flex, Box } from "@chakra-ui/react";
import { useState } from "react";

import Everything from "./Everything";
import Navbar from "./Navbar";
import { Tab } from "../../types";

export default function MainContentPanel() {
  const [tab, setTab] = useState<Tab>(Tab.Pulls);
  return (
    <Flex>
      <Navbar selectedTab={tab} setTab={setTab} />
      <Box w="100%">
        <Everything tab={tab} />
      </Box>
    </Flex>
  );
}
