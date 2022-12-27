import { useQuery, gql } from "@apollo/client";
import { parseWeeks } from "../../utilities/date_utils";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useSelector } from "react-redux";

import type { RootState } from "../../rstore/store";
import { DateRange } from "../../types";
import TeamMemberTitle from "./TeamMemberTitle";
import PullsByWeek from "./PullsByWeek";
import CommentsByWeek from "./CommentsByWeek";
import ReviewRequests from "./Reviews/ReviewRequests";
import ControlPanel from "../control_panel/ControlPanel";

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

function MainContentPanel() {
  const dateRange = useSelector((state: RootState) => state.team.dateRange);
  const org = useSelector((state: RootState) => state.team.org);
  const team = useSelector((state: RootState) => state.team.team);

  const { data, loading, error } = useQuery(QUERY, {
    variables: { org: org, team: team },
  });

  if (!team) {
    return (
      <>
        <ControlPanel />
        <p>select a team</p>
      </>
    );
  }

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
    <>
      <ControlPanel />
      <Box paddingTop={5}>
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
              <ReviewRequests org={org} dateRange={dateRange} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}

export default MainContentPanel;
