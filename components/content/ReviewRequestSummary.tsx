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
    hoursToReview50: number;
    bizHoursToReview50: number;
    hoursToReview75: number;
    bizHoursToReview75: number;
    hoursToReview90: number;
    bizHoursToReview90: number;
  };
};

export default function ReviewRequestSummary(props: Props) {
  const {
    total,
    totalNotReviewed,
    avgHoursToReview,
    avgBizHoursToReview,
    hoursToReview50,
    bizHoursToReview50,
    hoursToReview75,
    bizHoursToReview75,
    hoursToReview90,
    bizHoursToReview90,
  } = props.stats;
  return (
    <>
      <Box>
        <Heading as="h3" size="lg">
          Overall Stats
        </Heading>
        <StatGroup paddingBottom={25}>
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
      <Heading as="h3" size="lg">
        Percent Stats
      </Heading>
      <Box paddingBottom={25}>
        <StatGroup>
          <Stat>
            <StatLabel>P50 Hours</StatLabel>
            <StatNumber>{hoursToReview50}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>P50 Biz Hours</StatLabel>
            <StatNumber>{bizHoursToReview50}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>P75 Hours</StatLabel>
            <StatNumber>{hoursToReview75}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>P75 Biz Hours</StatLabel>
            <StatNumber>{bizHoursToReview75}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>P90 Hours</StatLabel>
            <StatNumber>{hoursToReview90}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>P90 Biz Hours</StatLabel>
            <StatNumber>{bizHoursToReview90}</StatNumber>
          </Stat>
        </StatGroup>
      </Box>
    </>
  );
}
