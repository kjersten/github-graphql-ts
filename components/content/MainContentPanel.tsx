import { useQuery, gql } from "@apollo/client";
import { parseWeeks } from "../../utilities/date_utils";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import { DateRange } from "../../types";
import TeamMemberTitle from "./TeamMemberTitle";
import PullsByWeek from "./PullsByWeek";
import CommentsByWeek from "./CommentsByWeek";
import ReviewRequests from "./ReviewRequests";

type Props = {
  org: string | undefined;
  team: string | undefined;
  teamFullName: string | undefined;
  dateRange: DateRange;
};

type Member = {
  login: string | undefined;
  name: string | undefined;
};

const QUERY = gql`
  query teamMembers($org: String!, $team: String!) {
    organization(login: $org) {
      __typename
      id
      team(slug: $team) {
        __typename
        id
        members {
          nodes {
            id
            login
            name
          }
        }
      }
    }
  }
`;

function MainContentPanel(props: Props) {
  const { org, team, teamFullName, dateRange } = props;
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
  const weeks = parseWeeks(dateRange);

  return (
    <Box paddingTop={5}>
      <p>
        <i>Sorry, broke the datepicker. Will fix soon.</i>
      </p>
      <Tabs isLazy>
        <TabList>
          <Tab>Pulls</Tab>
          <Tab>Reviews</Tab>
          <Tab>Time to Review</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {members.map((member: Member) => (
              <Box paddingBottom={5} key={member.login}>
                <TeamMemberTitle login={member.login} name={member.name} />
                {weeks.map((week: DateRange) => (
                  <PullsByWeek
                    key={member.login + week.startString + "pulls"}
                    org={org}
                    login={member.login}
                    week={week}
                  />
                ))}
              </Box>
            ))}
          </TabPanel>
          <TabPanel>
            {members.map((member: Member) => (
              <Box paddingBottom={5} key={member.login}>
                <TeamMemberTitle login={member.login} name={member.name} />
                {weeks.map((week: DateRange) => (
                  <CommentsByWeek
                    key={member.login + week.startString + "comments"}
                    org={org}
                    login={member.login}
                    week={week}
                  />
                ))}
              </Box>
            ))}
          </TabPanel>
          <TabPanel>
            <ReviewRequests
              key={team + dateRange.startString + "-reviewRequests"}
              org={org}
              teamFullName={teamFullName}
              dateRange={dateRange}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default MainContentPanel;
