import { Button } from "@chakra-ui/react";
import { TeamReviewRequest } from "../../../types";

type Props = {
  auditFileName: string;
  reviewAudit: TeamReviewRequest[];
};

function download(filename: string, reviewAudit: TeamReviewRequest[]) {
  let text: string =
    "PullId,PullUrl,Team,RequestedAt,ReviewedAt,HoursToReview,BizHoursToReview\n";
  text += reviewAudit
    .map(function (rr) {
      let str = `${rr.pullId},${rr.url},${rr.teamSlug},${rr.requestedAt},${rr.reviewedAt},`;
      str += `${rr.hoursToReview},${rr.bizHoursToReview}\n`;
      return str;
    })
    .join("");

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default function DownloadAuditLog(props: Props) {
  const { auditFileName, reviewAudit } = props;
  return (
    <Button
      mb={10}
      colorScheme="blue"
      onClick={() => download(auditFileName, reviewAudit)}
    >
      Download Audit Log
    </Button>
  );
}
