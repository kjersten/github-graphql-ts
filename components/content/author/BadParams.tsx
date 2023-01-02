import { Box, Link } from "@chakra-ui/react";
import NextLink from "next/link";

import { Tab } from "../../../types";

export default function BadParams() {
  return (
    <Box>
      Please select a team member on the{" "}
      <Link as={NextLink} href={Tab.TeamPulls} color="blue.500">
        Team Page
      </Link>
    </Box>
  );
}
