import { Box } from "@chakra-ui/react";

import TeamMemberTitle from "./TeamMemberTitle";
import { Member, DetailPage } from "../../../types";

type Props = {
  member: Member;
  children: React.ReactNode;
  page: DetailPage;
};

export default function TeamMemberSection(props: Props) {
  const { member, children, page } = props;
  return (
    <Box paddingBottom={5}>
      <TeamMemberTitle login={member.login} name={member.name} page={page} />
      {children}
    </Box>
  );
}
