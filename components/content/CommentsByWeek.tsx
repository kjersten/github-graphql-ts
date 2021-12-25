import { Box } from "@chakra-ui/react";

import { DateRange } from "../../types";

type Props = {
  org: string | undefined;
  login: string | undefined;
  week: DateRange;
};

// for each login, get
//   * # of PR reviews/approvals
//   * # of comments on other people's PRs
function CommentsByWeek(props: Props) {
  const { org, login, week } = props;

  return (
    <Box>
      {week.startString} - {week.endString}{" "}
      <em>(# of approvals and comments to come)</em>
    </Box>
  );
}

export default CommentsByWeek;
