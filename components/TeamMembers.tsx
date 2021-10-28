import { useQuery, gql } from "@apollo/client";
import { format, subWeeks, previousSunday } from "date-fns";
import { Box } from "@chakra-ui/layout";

import TeamMember from "./TeamMember";

type Props = {
  org: string | undefined;
  team: string | undefined;
};

type Week = {
  beginDate: string;
  endDate: string;
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
  const { org, team } = props;
  const { data, loading, error } = useQuery(QUERY, {
    variables: { org: org, team: team },
  });

  const dateFmt = "yyyy-MM-dd";
  const endDateRaw = previousSunday(Date.now());
  const midDate = format(subWeeks(endDateRaw, 1), dateFmt);
  const beginDate = format(subWeeks(endDateRaw, 2), dateFmt);
  const endDate = format(endDateRaw, dateFmt);
  console.log(`begin Sunday ${beginDate}`);
  console.log(`mid Sunday ${midDate}`);
  console.log(`end Sunday ${endDate}`);
  const weeks = [{ beginDate: midDate, endDate: endDate }];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const members = data.organization.team.members.nodes;
  console.log(members);

  return (
    <Box paddingTop={5}>
      {members.map((member: Member) => (
        <TeamMember
          key={member.login}
          login={member.login}
          name={member.name}
          org={org}
          weeks={weeks}
        />
      ))}
    </Box>
  );
}

export type { Week };
export default TeamMembers;
