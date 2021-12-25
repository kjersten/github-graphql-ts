import { useQuery, gql } from "@apollo/client";
import { format, subWeeks, previousSunday } from "date-fns";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import { DateRange } from "../../types";
import TeamMemberTitle from "./TeamMemberTitle";
import PullsForRange from "./PullsForRange";

type Props = {
  org: string | undefined;
  team: string | undefined;
  dateRange: DateRange;
};

type Member = {
  login: string | undefined;
  name: string | undefined;
};

const QUERY = gql`
  query teamMembers($org: String!, $team: String!) {
    organization(login: $org) {
      team(slug: $team) {
        members {
          nodes {
            login
            name
          }
        }
      }
    }
  }
`;

function TeamMembers(props: Props) {
  const { org, team, dateRange } = props;
  const { data, loading, error } = useQuery(QUERY, {
    variables: { org: org, team: team },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const members = data.organization.team.members.nodes;

  return (
    <Box paddingTop={5}>
      <Tabs>
        <TabList>
          <Tab>Pulls</Tab>
          <Tab>Comments</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {members.map((member: Member) => (
              <Box paddingBottom={5} key={member.login}>
                <TeamMemberTitle
                  login={member.login}
                  name={member.name}
                  org={org}
                />
                <PullsForRange
                  org={org}
                  login={member.login}
                  dateRange={dateRange}
                />
              </Box>
            ))}
          </TabPanel>
          <TabPanel>
            <p>Comments will go here</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default TeamMembers;
