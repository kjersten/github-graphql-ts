import { Flex, Box } from "@chakra-ui/react";
import { useState } from "react";

import TeamPulls from "./TeamPulls";
import TeamReviews from "./TeamReviews";
import ReviewRequestWrapper from "./Reviews/ReviewRequestWrapper";
import Navbar from "../nav/Navbar";
import { Tab } from "../../types";

export default function MainContentPanel() {
  const [tab, setTab] = useState<Tab>(Tab.Pulls);
  return (
    <Flex>
      <Navbar selectedTab={tab} setTab={setTab} />
      <Box w="100%">
        {tab === Tab.Pulls && <TeamPulls />}
        {tab === Tab.Reviews && <TeamReviews />}
        {tab === Tab.Ttr && <ReviewRequestWrapper />}
      </Box>
    </Flex>
  );
}
