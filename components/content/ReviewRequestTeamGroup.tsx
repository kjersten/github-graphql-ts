import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
} from "@chakra-ui/react";

import ReviewRequest from "./ReviewRequest";
import { Pull, TeamReviewRequest, TeamGroup } from "../../types";

type Props = {
  group: TeamGroup;
  prs: Pull[];
};

function renderAuditLog(reviewRequests: TeamReviewRequest[], prs: Pull[]) {
  const result = reviewRequests.map((request: TeamReviewRequest) => {
    const pull = prs.find((pr: Pull) => pr.id == request.pullId);
    return (
      <ReviewRequest
        key={`${request.teamId}-${request.pullId}`}
        teamReviewRequest={request}
        pull={pull}
      />
    );
  });

  return result;
}

export default function ReviewRequestTeamGroup(props: Props) {
  const { group, prs } = props;
  return (
    <Box key={`{${group.slug}-group`} paddingBottom={5}>
      <Heading as="h3" size="lg">
        {group.slug}
      </Heading>
      <StatGroup paddingBottom={3}>
        <Stat>
          <StatLabel>Requested</StatLabel>
          <StatNumber>{group.reqs.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Not Reviewed</StatLabel>
          <StatNumber>{group.notReviewed}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Avg Total Hours</StatLabel>
          <StatNumber>{group.avgHoursToReview}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Avg Biz Hours to Review</StatLabel>
          <StatNumber>{group.avgBizHoursToReview}</StatNumber>
        </Stat>
      </StatGroup>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            PRs
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>{renderAuditLog(group.reqs, prs)}</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
