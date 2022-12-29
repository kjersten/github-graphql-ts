import { useQuery, gql } from "@apollo/client";
import { Select } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "../../rstore/store";
import { setOrg } from "../../features/team/teamSlice";
import { ORGANIZATIONS_QUERY } from "../../queries/queries";

type Org = {
  login: string;
};

export default function Organizations() {
  const org = useSelector((state: RootState) => state.team.org);
  const dispatch = useDispatch();
  const { data, loading, error } = useQuery(ORGANIZATIONS_QUERY);

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
        dispatch(setOrg(e.target.value));
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
