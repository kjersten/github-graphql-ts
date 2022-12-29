import { useQuery } from "@apollo/client";
import { parseWeeks } from "../../../../utilities/date_utils";
import { useSelector } from "react-redux";

import type { RootState } from "../../../../rstore/store";
import { DateRange, Member } from "../../../../types";
import TeamMemberSection from "../TeamMemberSection";
import ReviewsByWeek from "./ReviewsByWeek";
import ControlPanel from "../../../control_panel/ControlPanel";
import { TEAM_MEMBER_QUERY } from "../../../../queries/queries";

export default function TeamReviews() {
  const dateRange = useSelector((state: RootState) => state.team.dateRange);
  const org = useSelector((state: RootState) => state.team.org);
  const team = useSelector((state: RootState) => state.team.team);

  const { data, loading, error } = useQuery(TEAM_MEMBER_QUERY, {
    variables: { org: org, team: team },
  });

  if (!team) {
    return <ControlPanel />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const members = data.organization.team.members.nodes;
  const weeks = parseWeeks(dateRange);

  return (
    <>
      <ControlPanel />
      {members.map((member: Member) => (
        <TeamMemberSection member={member} key={member.login}>
          {weeks.map((week: DateRange) => (
            <ReviewsByWeek
              key={member.login + week.startString + "_reviews"}
              org={org}
              login={member.login}
              week={week}
            />
          ))}
        </TeamMemberSection>
      ))}
    </>
  );
}
