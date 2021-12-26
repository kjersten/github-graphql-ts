import { Box } from "@chakra-ui/react";

import { DateRange } from "../../types";

type Props = {
  org: string | undefined;
  login: string | undefined;
  week: DateRange;
};

// for each login per week, for each PR reviewed, display:
//   * the reviewer's latest review status (comment, approved, etc)
//   * # of comments by reviewer
//   * total review threads for PR?
function CommentsByWeek(props: Props) {
  const { org, login, week } = props;

  return (
    <Box>
      {week.startString} - {week.endString}
      {"  "}
      <em>(# of approvals and comments to come)</em>
    </Box>
  );
}

export default CommentsByWeek;
