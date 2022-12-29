import { Heading } from "@chakra-ui/react";

type Props = {
  login: string | undefined;
  name: string | undefined;
};

export default function TeamMemberTitle(props: Props) {
  const { login, name } = props;

  return (
    <Heading as="h2" size="sm">
      {name} <em>({login})</em>
    </Heading>
  );
}
