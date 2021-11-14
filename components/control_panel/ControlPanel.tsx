import { HStack, FormControl, FormLabel, Select } from "@chakra-ui/react";
import Organizations from "./Organizations";
import Teams from "./Teams";
import { DateRange } from "../../types";
import DateSelector from "./DateSelector";

type Props = {
  org: string | undefined;
  team: string | undefined;
  dateRange: DateRange;
  setTeam: Function;
  setOrg: Function;
  setDateRange: Function;
};

export default function ControlPanel(props: Props) {
  const { org, team, dateRange, setOrg, setTeam, setDateRange } = props;

  return (
    <HStack spacing="5">
      <FormControl id="gh-org" maxW="300">
        <FormLabel>Organization</FormLabel>
        <Organizations org={org} setOrg={setOrg} />
      </FormControl>
      <FormControl id="gh-team" maxW="300">
        <FormLabel>Team</FormLabel>
        <Teams org={org} team={team} setTeam={setTeam} />
      </FormControl>
      <FormControl>
        <FormLabel>Date Range</FormLabel>
        <DateSelector dateRange={dateRange} setDateRange={setDateRange} />
      </FormControl>
    </HStack>
  );
}
