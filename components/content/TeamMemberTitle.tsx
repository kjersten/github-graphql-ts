import { Heading, Box } from "@chakra-ui/react";

type Props = {
  org: string | undefined;
  login: string | undefined;
  name: string | undefined;
};

function TeamMemberTitle(props: Props) {
  const { org, login, name } = props;

  return (
    <Heading as="h2" size="sm">
      {name} <em>({login})</em>
    </Heading>
  );
}

export default TeamMemberTitle;
