import { useQuery, gql } from "@apollo/client";
import { Select } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "../../rstore/store";
import { setTeam } from "../../features/team/teamSlice";

type Team = {
  slug: string;
};

const QUERY = gql`
  query Teams($org: String!) {
    organization(login: $org) {
      __typename
      id
      name
      login
      teams(first: 50) {
        nodes {
          __typename
          id
          name
          slug
        }
      }
    }
  }
`;

export default function Organizations() {
  const org = useSelector((state: RootState) => state.team.org);
  const team = useSelector((state: RootState) => state.team.team);
  const dispatch = useDispatch();

  const { data, loading, error } = useQuery(QUERY, {
    variables: { org: org },
  });

  if (!org || loading) {
    return <Select disabled />;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const teams = data.organization.teams.nodes;
  return (
    <Select
      placeholder="select a team"
      value={team}
      onChange={(e) => {
        dispatch(setTeam(e.target.value));
        localStorage.setItem("team", e.target.value);
      }}
    >
      {teams.map((team: Team) => (
        <option key={team.slug} value={team.slug}>
          {team.slug}
        </option>
      ))}
    </Select>
  );
}
