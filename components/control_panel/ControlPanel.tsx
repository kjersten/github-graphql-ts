import { HStack, FormControl, FormLabel } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "../../rstore/store";
import { setDateRange } from "../../features/team/teamSlice";
import Organizations from "./Organizations";
import Teams from "./Teams";
import { DateRange } from "../../types";
import DateSelector from "./DateSelector";

export default function ControlPanel() {
  const dateRange = useSelector((state: RootState) => state.team.dateRange);
  const dispatch = useDispatch();
  const setRange = function (value: DateRange) {
    return dispatch(setDateRange(value));
  };

  return (
    <HStack spacing="5">
      <FormControl id="gh-org" maxW="300">
        <FormLabel>Organization</FormLabel>
        <Organizations />
      </FormControl>
      <FormControl id="gh-team" maxW="300">
        <FormLabel>Team</FormLabel>
        <Teams />
      </FormControl>
      <FormControl>
        <FormLabel>Date Range</FormLabel>
        <DateSelector dateRange={dateRange} setDateRange={setRange} />
      </FormControl>
    </HStack>
  );
}
