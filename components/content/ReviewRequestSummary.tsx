import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from "@chakra-ui/react";

type Props = {
  stats: {
    total: number;
    totalNotReviewed: number;
    avgHoursToReview: number;
    avgBizHoursToReview: number;
  };
};

export default function ReviewRequestSummary(props: Props) {
  const { total, totalNotReviewed, avgHoursToReview, avgBizHoursToReview } =
    props.stats;
  return (
    <Box paddingBottom={5}>
      <Heading as="h3" size="lg">
        Overall Stats
      </Heading>
      <StatGroup paddingBottom={3}>
        <Stat>
          <StatLabel>Reviews Requested</StatLabel>
          <StatNumber>{total}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Review Requests Not Done</StatLabel>
          <StatNumber>{totalNotReviewed}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Avg Total Hours</StatLabel>
          <StatNumber>{avgHoursToReview}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Avg Biz Hours to Review</StatLabel>
          <StatNumber>{avgBizHoursToReview}</StatNumber>
        </Stat>
      </StatGroup>
    </Box>
  );
}
