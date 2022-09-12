import { useQuery, gql } from "@apollo/client";
import { Select } from "@chakra-ui/react";

type Props = {
  org: string | undefined;
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
          __typename
          id
          name
          login
        }
      }
    }
  }
`;

export default function Organizations(props: Props) {
  const { org, setOrg } = props;
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
  );
}
