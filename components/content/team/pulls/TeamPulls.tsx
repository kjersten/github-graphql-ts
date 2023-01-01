import { useQuery } from "@apollo/client";
import { parseWeeks } from "../../../../utilities/date-utils";
import { useSelector } from "react-redux";

import type { RootState } from "../../../../rstore/store";
import { DateRange, Member, DetailPage } from "../../../../types";
import TeamMemberSection from "../TeamMemberSection";
import PullsByWeek from "../../shared/PullsByWeek";
import ControlPanel from "../../../control_panel/ControlPanel";
import { TEAM_MEMBER_QUERY } from "../../../../queries/queries";

export default function TeamPulls() {
  const dateRange = useSelector((state: RootState) => state.team.dateRange);
  const org = useSelector((state: RootState) => state.team.org);
  const team = useSelector((state: RootState) => state.team.team);

  const { data, loading, error } = useQuery(TEAM_MEMBER_QUERY, {
    variables: { org: org, team: team },
  });

  if (!org || !team) {
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
        <TeamMemberSection
          member={member}
          page={DetailPage.Pulls}
          key={member.login}
        >
          {weeks.map((week: DateRange) => (
            <PullsByWeek
              key={member.login + week.startString + "_pulls"}
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
