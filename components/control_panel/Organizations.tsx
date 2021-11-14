import { useQuery, gql } from "@apollo/client";
import { HStack, FormControl, FormLabel, Select } from "@chakra-ui/react";
import Teams from "./Teams";

type Props = {
  org: string | undefined;
  team: string | undefined;
  setTeam: Function;
  setOrg: Function;
};

type Org = {
  login: string;
};

const QUERY = gql`
  query Organizations {
    viewer {
      login
      organizations(first: 50) {
        nodes {
          id
          name
          login
        }
      }
    }
  }
`;

export default function Organizations(props: Props) {
  const { org, team, setOrg, setTeam } = props;
  const { data, loading, error } = useQuery(QUERY);

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const userOrgs = data.viewer.organizations.nodes;

  return (
    <HStack spacing="5">
      <FormControl id="gh-org" maxW="300">
        <FormLabel>Organization</FormLabel>
        <Select
          placeholder="select an org"
          value={org}
          onChange={(e) => {
            setOrg(e.target.value);
            localStorage.setItem("org", e.target.value);
          }}
        >
          {userOrgs.map((userOrg: Org) => (
            <option key={userOrg.login} value={userOrg.login}>
              {userOrg.login}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="gh-team" maxW="300">
        <FormLabel>Team</FormLabel>
        <Teams org={org} team={team} setTeam={setTeam} />
      </FormControl>
    </HStack>
  );
}
