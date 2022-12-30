import Layout from "../components/Layout";
import LayoutWithNav from "../components/LayoutWithNav";
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
