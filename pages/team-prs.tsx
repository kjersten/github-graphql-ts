import Layout from "../components/layout";
import LayoutWithNav from "../components/layout_with_nav";
import TeamPulls from "../components/content/team/pulls/TeamPulls";

export default function TeamPrs() {
  return (
    <Layout>
      <LayoutWithNav>
        <TeamPulls />
      </LayoutWithNav>
    </Layout>
  );
}
