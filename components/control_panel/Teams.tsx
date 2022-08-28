import { useQuery, gql } from "@apollo/client";
import { Select } from "@chakra-ui/react";

type Props = {
  org: string | undefined;
  team: string | undefined;
  setTeam: Function;
  setTeamFullName: Function;
};

type Team = {
  slug: string;
  combinedSlug: string | null;
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
          combinedSlug
        }
      }
    }
  }
`;

export default function Organizations(props: Props) {
  const { org, team, setTeam, setTeamFullName } = props;
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
  console.log(new Date().toUTCString());
  console.log(teams);

  return (
    <Select
      placeholder="select a team"
      value={team}
      onChange={(e) => {
        setTeam(e.target.value);
        localStorage.setItem("team", e.target.value);
        const fullName = e.target.selectedOptions[0].dataset.fullname ?? "";
        setTeamFullName(fullName);
        localStorage.setItem("teamFullName", fullName);
      }}
    >
      {teams.map((team: Team) => (
        <option
          key={team.slug}
          value={team.slug}
          data-fullname={team.combinedSlug}
        >
          {team.slug}
        </option>
      ))}
    </Select>
  );
}
