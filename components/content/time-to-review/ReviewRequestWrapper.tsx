import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, HStack, FormControl, FormLabel } from "@chakra-ui/react";

import ReviewRequests from "./ReviewRequests";
import DateSelector from "../../control_panel/DateSelector";
import Organizations from "../../control_panel/Organizations";
import { getDefaultOneWeekDateRange } from "../../../utilities/date-utils";
import { DateRange } from "../../../types";
import type { RootState } from "../../../rstore/store";

export default function ReviewRequestWrapper() {
  const org = useSelector((state: RootState) => state.team.org);
  const [dateRange, setDateRange] = useState<DateRange>(
    getDefaultOneWeekDateRange()
  );

  return (
    <Box>
      <HStack spacing="5" pb={4}>
        <FormControl id="gh-org" maxW="300">
          <FormLabel>Organization</FormLabel>
          <Organizations />
        </FormControl>
        <FormControl maxW={300}>
          <FormLabel>Date Range</FormLabel>
          <DateSelector dateRange={dateRange} setDateRange={setDateRange} />
        </FormControl>
      </HStack>
      <ReviewRequests dateRange={dateRange} org={org} />
    </Box>
  );
}
