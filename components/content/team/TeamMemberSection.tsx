import { Box } from "@chakra-ui/react";

import TeamMemberTitle from "./TeamMemberTitle";
import { Member } from "../../../types";

type Props = {
  member: Member;
  children: React.ReactNode;
};

export default function TeamMemberSection(props: Props) {
  const { member, children } = props;
  return (
    <Box paddingBottom={5} key={member.login}>
      <TeamMemberTitle login={member.login} name={member.name} />
      {children}
    </Box>
  );
}
