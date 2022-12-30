import Layout from "../components/Layout";
import LayoutWithNav from "../components/LayoutWithNav";
import TeamReviews from "../components/content/team/reviews/TeamReviews";

export default function TeamPrs() {
  return (
    <Layout>
      <LayoutWithNav>
        <TeamReviews />
      </LayoutWithNav>
    </Layout>
  );
}
