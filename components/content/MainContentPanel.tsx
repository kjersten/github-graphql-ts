import { Flex, Box } from "@chakra-ui/react";
import { useState } from "react";

import TeamPulls from "./team/pulls/TeamPulls";
import TeamReviews from "./team/reviews/TeamReviews";
import ReviewRequestWrapper from "./time-to-review/ReviewRequestWrapper";
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
