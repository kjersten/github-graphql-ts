import { useQuery, gql } from "@apollo/client";
import { Select } from "@chakra-ui/react";

type Props = {
  org: string | undefined;
  team: string | undefined;
  setTeam: Function;
};

type Team = {
  slug: string;
};

const QUERY = gql`
  query Teams($org: String!) {
    organization(login: $org) {
      id
      name
      login
      teams(first: 50) {
        nodes {
          id
          name
          slug
          combinedSlug
        }
      }
    }
  }
`;

export default function Organizations(props: Props) {
  const { org, team, setTeam } = props;
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
        setTeam(e.target.value);
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
