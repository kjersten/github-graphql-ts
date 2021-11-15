import { useQuery, gql } from "@apollo/client";
import { format, subWeeks, previousSunday } from "date-fns";
import { Box } from "@chakra-ui/layout";

import TeamMember from "./TeamMember";
import { DateRange } from "../../types";

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
      {members.map((member: Member) => (
        <TeamMember
          key={member.login}
          login={member.login}
          name={member.name}
          org={org}
          dateRange={dateRange}
        />
      ))}
    </Box>
  );
}

export default TeamMembers;
