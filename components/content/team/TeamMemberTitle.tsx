import { Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";

import { DetailPage } from "../../../types";

type Props = {
  login: string | undefined;
  name: string | undefined;
  page: DetailPage;
};

export default function TeamMemberTitle(props: Props) {
  const { login, name, page } = props;

  return (
    <Heading as="h2" size="sm">
      <Link as={NextLink} href={`${page}/${login}`} color="blue.500">
        {name} <em>({login})</em>
      </Link>
    </Heading>
  );
}
